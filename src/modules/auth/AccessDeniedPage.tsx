import { LockKeyhole } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '@/app/providers/RoleProvider';
import { Button } from '@/components/ui/Button';
import { ROLE_HOME } from '@/utils/constants';

interface AccessDeniedState {
  attemptedPath?: string;
}

export function AccessDeniedPage() {
  const { roleId } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as AccessDeniedState | null;

  if (!roleId) return null;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <LockKeyhole size={28} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your current role is not authorized to open this page.
        </p>
        {state?.attemptedPath && (
          <p className="mt-3 break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-500">
            {state.attemptedPath}
          </p>
        )}
        <div className="mt-6">
          <Button variant="primary" onClick={() => navigate(ROLE_HOME[roleId], { replace: true })}>
            Go to my authorized home
          </Button>
        </div>
      </div>
    </div>
  );
}
