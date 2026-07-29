import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuditEvent, AuditAction, AuditModule } from '@/types/audit';
import { mockAuditEvents } from '@/data/mockAudit';
import { useRole } from './RoleProvider';
import { ROLES } from '@/utils/constants';

interface AuditContextValue {
  events: AuditEvent[];
  logEvent: (params: { action: AuditAction; module: AuditModule; recordId?: string; recordLabel?: string; description: string }) => void;
}

const AuditContext = createContext<AuditContextValue | null>(null);

export function AuditProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AuditEvent[]>([...mockAuditEvents]);
  const { roleId } = useRole();

  function logEvent(params: { action: AuditAction; module: AuditModule; recordId?: string; recordLabel?: string; description: string }) {
    const role = ROLES.find(r => r.id === roleId);
    const newEvent: AuditEvent = {
      id: `AUD${Date.now()}`,
      userId: roleId ?? 'unknown',
      userName: role?.label ?? 'Unknown User',
      userRole: role?.label ?? 'Unknown Role',
      action: params.action,
      module: params.module,
      recordId: params.recordId,
      recordLabel: params.recordLabel,
      description: params.description,
      timestamp: new Date().toISOString(),
      ipDevice: '127.0.0.1 / Demo Browser',
      privacyLevel: 'Internal',
    };
    // Prepend so newest is first
    setEvents(prev => [newEvent, ...prev]);
  }

  return (
    <AuditContext.Provider value={{ events, logEvent }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error('useAudit must be used within AuditProvider');
  return ctx;
}
