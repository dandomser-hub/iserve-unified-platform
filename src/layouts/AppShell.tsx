import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useRole } from '@/app/providers/RoleProvider';
import { Sidebar } from './Sidebar';
import { HeaderBar } from './HeaderBar';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { PrototypeDisclosure } from '@/components/shared/PrototypeDisclosure';

export function AppShell() {
  const { roleId } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect to login if no role selected
  if (!roleId) {
    return <Navigate to="/login-demo" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <HeaderBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <PrototypeDisclosure />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
