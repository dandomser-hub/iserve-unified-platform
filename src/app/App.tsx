import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { RoleProvider } from './providers/RoleProvider';
import { MockDataProvider } from './providers/MockDataProvider';
import { AuditProvider } from './providers/AuditProvider';
import { router } from './router';
import { RouteLoadingFallback } from '@/components/shared/RouteLoadingFallback';

// Provider order: RoleProvider first (audit and mock data read role)
export function App() {
  return (
    <RoleProvider>
      <MockDataProvider>
        <AuditProvider>
          <Suspense fallback={<RouteLoadingFallback />}>
            <RouterProvider router={router} />
          </Suspense>
        </AuditProvider>
      </MockDataProvider>
    </RoleProvider>
  );
}
