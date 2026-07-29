import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { StatusChip, Badge } from '@/components/ui/Badge';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { useMockData } from '@/app/providers/MockDataProvider';
import { formatDateTime } from '@/utils/formatters';
import { DOCUMENT_TYPES } from '@/data/mockReferenceData';
import type { DocumentRequest, DocumentStatus } from '@/types/document';
import { AlertTriangle } from 'lucide-react';

const STATUS_ORDER: DocumentStatus[] = ['Draft', 'For Validation', 'For Approval', 'Approved', 'For Release', 'Released', 'Returned', 'Cancelled'];

export function DocumentQueuePage() {
  const { documentRequests } = useMockData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [view, setView] = useState<'list' | 'kanban'>('list');

  const filtered = documentRequests.filter(d => {
    const q = search.toLowerCase();
    const match = !q || d.residentName.toLowerCase().includes(q) || d.requestNo.toLowerCase().includes(q);
    const matchStatus = !statusFilter || d.status === statusFilter;
    const matchType = !typeFilter || d.documentType === typeFilter;
    return match && matchStatus && matchType;
  });

  const columns: Column<DocumentRequest>[] = [
    { key: 'requestNo', header: 'Request No.', render: d => <span className="font-mono text-xs text-slate-600">{d.requestNo}</span> },
    { key: 'residentName', header: 'Resident', render: d => <span className="font-medium">{d.residentName}</span> },
    { key: 'documentType', header: 'Document Type', render: d => <span className="text-sm">{d.documentType}</span> },
    { key: 'flags', header: 'Flags', render: d => (
      <div className="flex gap-1">
        {d.hasBlotterFlag && <Badge label="Blotter" variant="warning" />}
        {d.hasKPFlag && <Badge label="KP" variant="warning" />}
      </div>
    )},
    { key: 'status', header: 'Status', render: d => <StatusChip status={d.status} /> },
    { key: 'createdAt', header: 'Created', render: d => <span className="text-xs text-slate-500">{formatDateTime(d.createdAt)}</span> },
    { key: 'action', header: '', render: d => (
      <Button size="sm" variant="secondary" onClick={e => { e.stopPropagation(); navigate(`/documents/${d.id}/workspace`); }}>Open</Button>
    )},
  ];

  // Kanban grouped by status
  const byStatus = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = filtered.filter(d => d.status === s);
    return acc;
  }, {} as Record<string, DocumentRequest[]>);

  const STATUS_COLORS: Record<string, string> = {
    'Draft': 'border-slate-300',
    'For Validation': 'border-sky-300',
    'For Approval': 'border-amber-400',
    'Approved': 'border-green-400',
    'For Release': 'border-sky-400',
    'Released': 'border-green-600',
    'Returned': 'border-orange-400',
    'Cancelled': 'border-red-400',
  };

  return (
    <PageScaffold
      title="Document Queue"
      subtitle="Track and manage all document requests"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Documents', href: '/documents/intake' }, { label: 'Queue' }]}
      moduleTag="Documents"
      priorityTag="P0"
      actions={
        <div className="flex items-center gap-2">
          <Button size="sm" variant={view === 'list' ? 'primary' : 'secondary'} onClick={() => setView('list')}>List</Button>
          <Button size="sm" variant={view === 'kanban' ? 'primary' : 'secondary'} onClick={() => setView('kanban')}>Kanban</Button>
        </div>
      }
    >
      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by resident or request no..."
        filters={
          <>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none">
              <option value="">All Statuses</option>
              {STATUS_ORDER.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none">
              <option value="">All Types</option>
              {DOCUMENT_TYPES.slice(0, 10).map(t => <option key={t}>{t}</option>)}
            </select>
          </>
        }
      />

      {view === 'list' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mt-0">
          <DataTable
            columns={columns}
            data={filtered}
            rowKey={d => d.id}
            onRowClick={d => navigate(`/documents/${d.id}/workspace`)}
            emptyMessage="No document requests found."
          />
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {STATUS_ORDER.slice(0, 6).map(status => {
              const items = byStatus[status] || [];
              return (
                <div key={status} className="w-64 flex-shrink-0">
                  <div className={`flex items-center justify-between mb-3 pb-2 border-b-2 ${STATUS_COLORS[status]}`}>
                    <span className="text-sm font-semibold text-slate-700">{status}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => navigate(`/documents/${doc.id}/workspace`)}
                        className="w-full text-left bg-white border border-slate-200 rounded-xl p-3 hover:shadow-md transition-all hover:border-forest/30"
                      >
                        <p className="text-xs font-mono text-slate-400">{doc.requestNo}</p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{doc.residentName}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{doc.documentType}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          {doc.hasBlotterFlag && <div className="flex items-center gap-0.5 text-amber-600"><AlertTriangle size={11} /><span className="text-xs">Blotter</span></div>}
                        </div>
                      </button>
                    ))}
                    {items.length === 0 && <div className="text-center py-6 text-slate-300 text-xs">Empty</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PageScaffold>
  );
}
