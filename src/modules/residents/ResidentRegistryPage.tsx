import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus } from 'lucide-react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable';
import { StatusChip, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormField, Input, Select, Textarea } from '@/components/ui/FormField';
import { RoleGate } from '@/components/shared/RoleGate';
import { useMockData } from '@/app/providers/MockDataProvider';
import { useAudit } from '@/app/providers/AuditProvider';
import { formatDate } from '@/utils/formatters';
import { PUROKS, SECTOR_TAGS } from '@/data/mockReferenceData';
import type { Resident } from '@/types/resident';

const PAGE_SIZE = 10;

export function ResidentRegistryPage() {
  const { residents, setResidents, showToast } = useMockData();
  const { logEvent } = useAudit();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [purokFilter, setPurokFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', middleName: '', lastName: '', sex: '', birthDate: '', civilStatus: '', address: '', purok: '', remarks: '' });

  const filtered = residents.filter(r => {
    const name = `${r.firstName} ${r.middleName} ${r.lastName}`.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || r.residentNo.toLowerCase().includes(search.toLowerCase());
    const matchPurok = !purokFilter || r.purok === purokFilter;
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchSector = !sectorFilter || r.sectorTags.includes(sectorFilter as any);
    return matchSearch && matchPurok && matchStatus && matchSector;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: Column<Resident>[] = [
    { key: 'residentNo', header: 'Resident No.', render: r => <span className="font-mono text-xs text-slate-600">{r.residentNo}</span> },
    { key: 'name', header: 'Name', render: r => <span className="font-medium text-slate-900">{r.lastName}, {r.firstName} {r.middleName}</span> },
    { key: 'age', header: 'Age / Sex', render: r => <span className="text-slate-600">{r.age} · {r.sex}</span> },
    { key: 'purok', header: 'Purok', render: r => <span className="text-slate-600 text-xs">{r.purok}</span> },
    { key: 'sectors', header: 'Sectors', render: r => (
      <div className="flex flex-wrap gap-1">
        {r.sectorTags.slice(0, 2).map(t => <Badge key={t} label={t} variant="info" />)}
        {r.sectorTags.length > 2 && <Badge label={`+${r.sectorTags.length - 2}`} variant="neutral" />}
      </div>
    )},
    { key: 'status', header: 'Status', render: r => <StatusChip status={r.status} /> },
    { key: 'registeredAt', header: 'Registered', render: r => <span className="text-slate-500 text-xs">{formatDate(r.registeredAt)}</span> },
  ];

  function handleAddResident() {
    const newRes: Resident = {
      id: `R${Date.now()}`, residentNo: `BRG-2024-${String(residents.length + 1).padStart(3, '0')}`,
      firstName: form.firstName, middleName: form.middleName, lastName: form.lastName,
      sex: form.sex as any, birthDate: form.birthDate, age: 0, ageGroup: 'Adult (31-59)',
      civilStatus: form.civilStatus as any, address: form.address, purok: form.purok,
      sectorTags: [], isVoter: false, status: 'Active', privacyLevel: 'Internal',
      registeredAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0],
      remarks: form.remarks,
    };
    setResidents(prev => [...prev, newRes]);
    logEvent({ action: 'Created', module: 'Residents', recordId: newRes.id, recordLabel: `${newRes.lastName}, ${newRes.firstName}`, description: `New resident registered: ${newRes.lastName}, ${newRes.firstName} ${newRes.middleName}` });
    showToast(`Resident ${newRes.lastName}, ${newRes.firstName} registered successfully.`);
    setAddOpen(false);
    setForm({ firstName: '', middleName: '', lastName: '', sex: '', birthDate: '', civilStatus: '', address: '', purok: '', remarks: '' });
  }

  return (
    <PageScaffold
      title="Resident Registry"
      subtitle={`${residents.length} total residents registered`}
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Residents' }]}
      moduleTag="Residents"
      priorityTag="P0"
      actions={
        <RoleGate permission="residents.create">
          <Button variant="primary" onClick={() => setAddOpen(true)}>
            <UserPlus size={15} /> Register Resident
          </Button>
        </RoleGate>
      }
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <SearchFilterBar
          searchValue={search}
          onSearchChange={v => { setSearch(v); setPage(1); }}
          placeholder="Search by name or resident no..."
          filters={
            <>
              <select value={purokFilter} onChange={e => { setPurokFilter(e.target.value); setPage(1); }} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-forest/20">
                <option value="">All Puroks</option>
                {PUROKS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-forest/20">
                <option value="">All Statuses</option>
                {['Active', 'Transferred Out', 'Deceased', 'Inactive'].map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={sectorFilter} onChange={e => { setSectorFilter(e.target.value); setPage(1); }} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-forest/20">
                <option value="">All Sectors</option>
                {SECTOR_TAGS.map(s => <option key={s}>{s}</option>)}
              </select>
            </>
          }
        />
        <DataTable
          columns={columns}
          data={paginated}
          rowKey={r => r.id}
          onRowClick={r => navigate(`/residents/${r.id}`)}
          emptyMessage="No residents found matching the filters."
        />
        {filtered.length > PAGE_SIZE && (
          <Pagination currentPage={page} totalPages={totalPages} onPage={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
        )}
      </div>

      {/* Quick stats */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active', count: residents.filter(r => r.status === 'Active').length, color: 'text-green-600' },
          { label: 'Senior Citizens', count: residents.filter(r => r.sectorTags.includes('Senior Citizen')).length, color: 'text-sky-600' },
          { label: 'PWD', count: residents.filter(r => r.sectorTags.includes('Person with Disability (PWD)')).length, color: 'text-amber-600' },
          { label: '4Ps Beneficiaries', count: residents.filter(r => r.sectorTags.includes('4Ps Beneficiary')).length, color: 'text-ocean' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <p className={`text-xl font-bold ${item.color}`}>{item.count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Add Resident Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Register New Resident"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddResident} disabled={!form.firstName || !form.lastName || !form.sex || !form.purok}>
              <Plus size={15} /> Register
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="First Name" required>
            <Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="e.g. Juan" />
          </FormField>
          <FormField label="Middle Name">
            <Input value={form.middleName} onChange={e => setForm(f => ({ ...f, middleName: e.target.value }))} placeholder="e.g. Santos" />
          </FormField>
          <FormField label="Last Name" required>
            <Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="e.g. Dela Cruz" />
          </FormField>
          <FormField label="Sex" required>
            <Select value={form.sex} onChange={e => setForm(f => ({ ...f, sex: e.target.value }))}>
              <option value="">Select sex</option>
              <option>Male</option>
              <option>Female</option>
            </Select>
          </FormField>
          <FormField label="Birth Date" required>
            <Input type="date" value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} />
          </FormField>
          <FormField label="Civil Status" required>
            <Select value={form.civilStatus} onChange={e => setForm(f => ({ ...f, civilStatus: e.target.value }))}>
              <option value="">Select</option>
              {['Single', 'Married', 'Widowed', 'Separated', 'Annulled'].map(s => <option key={s}>{s}</option>)}
            </Select>
          </FormField>
          <div className="sm:col-span-1"><FormField label="Purok / Sitio" required>
            <Select value={form.purok} onChange={e => setForm(f => ({ ...f, purok: e.target.value }))}>
              <option value="">Select purok</option>
              {PUROKS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </Select>
          </FormField></div>
          <div className="sm:col-span-2"><FormField label="Address" required>
            <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="House/lot, street" />
          </FormField></div>
          <div className="sm:col-span-3"><FormField label="Remarks">
            <Textarea value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} placeholder="Optional notes" rows={2} />
          </FormField></div>
        </div>
        <p className="mt-4 text-xs text-slate-400">Additional details (sector tags, voter status, household) can be added in the resident profile.</p>
      </Modal>
    </PageScaffold>
  );
}
