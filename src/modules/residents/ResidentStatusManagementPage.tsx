import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Select, Textarea, Input } from '@/components/ui/FormField';
import { StatusChip } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { useMockData } from '@/app/providers/MockDataProvider';
import { useAudit } from '@/app/providers/AuditProvider';
import { formatDate } from '@/utils/formatters';
import type { Resident, ResidentStatus } from '@/types/resident';

const STATUS_TRANSITIONS: Record<ResidentStatus, ResidentStatus[]> = {
  'Active': ['Transferred Out', 'Deceased', 'Inactive'],
  'Inactive': ['Active'],
  'Transferred Out': ['Active'],
  'Deceased': [],
};

export function ResidentStatusManagementPage() {
  const { residents, setResidents, showToast } = useMockData();
  const { logEvent } = useAudit();
  const [search, setSearch] = useState('');
  const [changeModal, setChangeModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [newStatus, setNewStatus] = useState<ResidentStatus | ''>('');
  const [reason, setReason] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');

  const filtered = residents.filter(r => {
    const q = search.toLowerCase();
    return !q || `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) || r.residentNo.toLowerCase().includes(q);
  });

  const columns: Column<Resident>[] = [
    { key: 'residentNo', header: 'Resident No.', render: r => <span className="font-mono text-xs text-slate-600">{r.residentNo}</span> },
    { key: 'name', header: 'Name', render: r => <span className="font-medium">{r.lastName}, {r.firstName}</span> },
    { key: 'purok', header: 'Purok', render: r => <span className="text-xs text-slate-500">{r.purok}</span> },
    { key: 'status', header: 'Current Status', render: r => <StatusChip status={r.status} /> },
    { key: 'updatedAt', header: 'Last Updated', render: r => <span className="text-xs text-slate-500">{formatDate(r.updatedAt)}</span> },
    {
      key: 'actions', header: 'Action',
      render: r => (
        <Button size="sm" variant="secondary" onClick={() => { setSelectedResident(r); setNewStatus(''); setReason(''); setEffectiveDate(''); setChangeModal(true); }}>
          Change Status
        </Button>
      ),
    },
  ];

  function handleStatusChange() {
    if (!selectedResident || !newStatus) return;
    setResidents(prev => prev.map(r => r.id === selectedResident.id ? { ...r, status: newStatus as ResidentStatus, updatedAt: new Date().toISOString().split('T')[0] } : r));
    logEvent({ action: 'Updated', module: 'Residents', recordId: selectedResident.id, recordLabel: `${selectedResident.lastName}, ${selectedResident.firstName}`, description: `Status changed from ${selectedResident.status} to ${newStatus}. Reason: ${reason}` });
    showToast(`Status updated to "${newStatus}" for ${selectedResident.lastName}, ${selectedResident.firstName}.`);
    setChangeModal(false);
  }

  return (
    <PageScaffold
      title="Resident Status Management"
      subtitle="Manage transfers, deceased records, and status changes"
      breadcrumbs={[{ label: 'Residents', href: '/residents' }, { label: 'Status Management' }]}
      moduleTag="Residents"
      priorityTag="P1"
    >
      <div className="mb-4 flex gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resident..." className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 flex-1 max-w-xs" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <DataTable columns={columns} data={filtered.slice(0, 15)} rowKey={r => r.id} emptyMessage="No residents found." />
      </div>

      <Modal
        isOpen={changeModal}
        onClose={() => setChangeModal(false)}
        title={`Change Status: ${selectedResident?.lastName}, ${selectedResident?.firstName}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setChangeModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleStatusChange} disabled={!newStatus || !reason || !effectiveDate}>Confirm Change</Button>
          </div>
        }
      >
        {selectedResident && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{selectedResident.lastName}, {selectedResident.firstName}</p>
                <div className="flex items-center gap-2 mt-1"><span className="text-xs text-slate-500">Current status:</span><StatusChip status={selectedResident.status} /></div>
              </div>
            </div>
            <FormField label="New Status" required>
              <Select value={newStatus} onChange={e => setNewStatus(e.target.value as ResidentStatus)}>
                <option value="">Select new status</option>
                {(STATUS_TRANSITIONS[selectedResident.status] || []).map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </FormField>
            {STATUS_TRANSITIONS[selectedResident.status]?.length === 0 && (
              <p className="text-sm text-slate-500 italic">No further status transitions available for "{selectedResident.status}" records.</p>
            )}
            <FormField label="Effective Date" required>
              <Input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} />
            </FormField>
            <FormField label="Reason / Remarks" required>
              <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Enter reason for status change" />
            </FormField>
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">Document history will be preserved upon status change.</p>
          </div>
        )}
      </Modal>
    </PageScaffold>
  );
}
