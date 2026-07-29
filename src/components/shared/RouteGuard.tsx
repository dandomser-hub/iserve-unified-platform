import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRole } from '@/app/providers/RoleProvider';
import { canAccessRoute, type RouteAccessId } from '@/utils/routeAccess';

interface RouteGuardProps {
  routeId: RouteAccessId;
  children: ReactNode;
}

export function RouteGuard({ routeId, children }: RouteGuardProps) {
  const { roleId } = useRole();
  const location = useLocation();

  if (!roleId) {
    return <Navigate to="/login-demo" replace />;
  }

  if (!canAccessRoute(roleId, routeId)) {
    return (
      <Navigate
        to="/access-denied"
        replace
        state={{ attemptedPath: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}
