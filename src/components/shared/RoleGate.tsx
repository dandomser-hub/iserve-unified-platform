import type { ReactNode } from 'react';
import type { Permission } from '@/types/auth';
import { useRole } from '@/app/providers/RoleProvider';
import { hasPermission, canAccess } from '@/utils/permissions';
import { Lock } from 'lucide-react';

interface RoleGateProps {
  permission?: Permission;
  permissions?: Permission[]; // any of these
  children: ReactNode;
  fallback?: ReactNode;
  /** Show a locked placeholder instead of hiding */
  showLocked?: boolean;
  lockedMessage?: string;
}

export function RoleGate({ permission, permissions, children, fallback, showLocked, lockedMessage }: RoleGateProps) {
  const { roleId } = useRole();

  if (!roleId) return null;

  const allowed = permission
    ? hasPermission(roleId, permission)
    : permissions
    ? canAccess(roleId, permissions)
    : false;

  if (allowed) return <>{children}</>;

  if (showLocked) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <Lock size={14} />
        <span>{lockedMessage || 'Access restricted for your role.'}</span>
      </div>
    );
  }

  return fallback ? <>{fallback}</> : null;
}

interface PermissionButtonProps {
  permission: Permission;
  children: ReactNode;
  disabledMessage?: string;
  className?: string;
  onClick?: () => void;
}

export function PermissionButton({ permission, children, disabledMessage, className, onClick }: PermissionButtonProps) {
  const { roleId } = useRole();
  const allowed = roleId ? hasPermission(roleId, permission) : false;

  if (!allowed) {
    return (
      <div className="relative group inline-flex">
        <div className={`opacity-50 cursor-not-allowed pointer-events-none ${className}`}>
          {children}
        </div>
        {disabledMessage && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
            <div className="bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
              {disabledMessage}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
