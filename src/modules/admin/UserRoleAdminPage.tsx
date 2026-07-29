import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { formatDateTime } from '@/utils/formatters';
import { AlertCircle, Shield } from 'lucide-react';
import { mockUsers } from '@/data/mockUsers';
import type { DemoUser } from '@/types/auth';

const ROLE_LABELS: Record<string, string> = {
  system_admin: 'System Admin',
  punong_barangay: 'Punong Barangay',
  barangay_secretary: 'Secretary',
  barangay_treasurer: 'Treasurer',
  drrm_focal: 'DRRM Focal',
  gad_focal: 'GAD Focal',
  municipal_reviewer: 'Municipal Reviewer',
  read_only_auditor: 'Read-Only Auditor',
};

const ROLE_COLORS: Record<string, string> = {
  system_admin: 'bg-slate-800 text-white',
  punong_barangay: 'bg-forest text-white',
  barangay_secretary: 'bg-sky-600 text-white',
  barangay_treasurer: 'bg-grass text-white',
  drrm_focal: 'bg-amber-600 text-white',
  gad_focal: 'bg-ocean text-white',
  municipal_reviewer: 'bg-slate-500 text-white',
  read_only_auditor: 'bg-slate-400 text-white',
};

export function UserRoleAdminPage() {
  const columns: Column<DemoUser>[] = [
    { key: 'name', header: 'Name', render: u => <span className="font-medium text-slate-800">{u.name}</span> },
    { key: 'email', header: 'Email', render: u => <span className="text-sm text-slate-600">{u.email}</span> },
    {
      key: 'roleId',
      header: 'Role',
      render: u => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[u.roleId] ?? 'bg-slate-100 text-slate-700'}`}>
          {ROLE_LABELS[u.roleId] ?? u.roleId}
        </span>
      ),
    },
    { key: 'accessScope', header: 'Access Scope', render: u => <span className="text-xs text-slate-600">{u.accessScope}</span> },
    { key: 'status', header: 'Status', render: u => <StatusChip status={u.status === 'active' ? 'Active' : 'Inactive'} /> },
    { key: 'lastActive', header: 'Last Active', render: u => <span className="text-xs text-slate-500">{formatDateTime(u.lastActive)}</span> },
    {
      key: 'id',
      header: 'Actions',
      render: () => (
        <Button variant="secondary" size="sm" onClick={() => alert('Edit dialog — no changes saved in demo')}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <PageScaffold
      title="User & Role Administration"
      subtitle="Manage Barangay iSERVE users and access roles"
      breadcrumbs={[{ label: 'Admin' }, { label: 'Users & Roles' }]}
      moduleTag="Admin"
      priorityTag="P1"
    >
      {/* Demo notice */}
      <div className="mb-5 p-4 bg-sky-50 border border-sky-200 rounded-xl flex gap-3">
        <AlertCircle size={18} className="text-sky-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-sky-800"><span className="font-semibold">Demo Environment:</span> No real authentication or password management is performed. All user data is simulated. Edit buttons are non-functional demonstrations only.</p>
      </div>

      {/* Role legend */}
      <Card className="mb-5">
        <div className="flex items-center gap-2 mb-4 p-1">
          <Shield size={16} className="text-slate-500" />
          <h3 className="font-semibold text-slate-800">Role Reference</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(ROLE_LABELS).map(([id, label]) => (
            <div key={id} className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${ROLE_COLORS[id]}`}>{label.split(' ').map(w => w[0]).join('')}</span>
              <span className="text-xs text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-3 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-700">System Users ({mockUsers.length})</span>
        </div>
        <DataTable columns={columns} data={mockUsers} rowKey={u => u.id} />
      </div>

      {/* Security note */}
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-900"><span className="font-semibold">Security Note:</span> User passwords are never stored or displayed in this interface. Password resets and authentication are handled by the dedicated authentication service. All user administration actions are logged in the audit trail.</p>
      </div>
    </PageScaffold>
  );
}
