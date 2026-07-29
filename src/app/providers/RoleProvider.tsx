import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { RoleId } from '@/types/auth';
import { ROLES } from '@/utils/constants';

interface RoleContextValue {
  roleId: RoleId | null;
  setRole: (roleId: RoleId) => void;
  clearRole: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);
const STORAGE_KEY = 'iserve_demo_role';

export function RoleProvider({ children }: { children: ReactNode }) {
  const [roleId, setRoleId] = useState<RoleId | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Validate stored role is a known role
    if (stored && ROLES.some(r => r.id === stored)) return stored as RoleId;
    return null;
  });

  function setRole(id: RoleId) {
    localStorage.setItem(STORAGE_KEY, id);
    setRoleId(id);
  }

  function clearRole() {
    localStorage.removeItem(STORAGE_KEY);
    setRoleId(null);
  }

  return (
    <RoleContext.Provider value={{ roleId, setRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}

export function useCurrentRole() {
  const { roleId } = useRole();
  return ROLES.find(r => r.id === roleId) ?? null;
}
