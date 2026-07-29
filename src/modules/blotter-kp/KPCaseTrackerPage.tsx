import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { Card } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusChip, Badge } from '@/components/ui/Badge';
import { Timeline } from '@/components/ui/Timeline';
import { mockKPCases } from '@/data/mockBlotterKP';
import type { KPCase } from '@/types/blotter';
import { KP_DISPUTE_CATEGORIES } from '@/data/mockReferenceData';
import { formatDate, formatDateTime } from '@/utils/formatters';

export function KPCaseTrackerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  const filtered = mockKPCases.filter(kpCase => {
    const matchesSearch =
      !searchTerm ||
      kpCase.caseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpCase.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpCase.respondent.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !categoryFilter || kpCase.disputeCategory === categoryFilter;
    const matchesStatus = !statusFilter || kpCase.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const statuses = ['Filed', 'Summons Prepared', 'Hearing Scheduled', 'In Conciliation', 'Settled', 'Referred', 'CFA Issued', 'Closed'];

  const columns: Column<KPCase>[] = [
    { key: 'caseNo', header: 'Case No.', render: c => <span className="font-mono text-sm font-semibold cursor-pointer hover:text-forest" onClick={() => setExpandedCaseId(expandedCaseId === c.id ? null : c.id)}>{c.caseNo}</span> },
    { key: 'disputeCategory', header: 'Dispute Category', render: c => <Badge label={c.disputeCategory} variant="default" className="text-xs" /> },
    { key: 'complainant', header: 'Complainant', render: c => c.complainant },
    { key: 'respondent', header: 'Respondent', render: c => c.respondent },
    { key: 'filedDate', header: 'Filed Date', render: c => formatDate(c.filedDate) },
    { key: 'status', header: 'Status', render: c => <StatusChip status={c.status} /> },
    { key: 'hearingSchedule', header: 'Hearing Schedule', render: c => c.hearingSchedule ? formatDateTime(c.hearingSchedule) : '—' },
    {
      key: 'actions',
      header: 'Actions',
      render: c => (
        <button onClick={() => setExpandedCaseId(expandedCaseId === c.id ? null : c.id)} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition">
          <ChevronDown size={14} className={`transition ${expandedCaseId === c.id ? 'rotate-180' : ''}`} />
          View Details
        </button>
      ),
    },
  ];

  return (
    <PageScaffold
      title="KP Case Tracker"
      subtitle="Monitor and manage Lupon Tagapamayapa dispute resolution cases"
      breadcrumbs={[{ label: 'Blotter & KP' }, { label: 'Case Tracker' }]}
      moduleTag="KP Cases"
      priorityTag="P0"
    >
      {/* Status Flow Reference */}
      <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-lg">
        <p className="text-xs text-sky-600 font-semibold mb-3 uppercase">Case Status Flow:</p>
        <div className="flex flex-wrap gap-2 items-center">
          {['Filed', 'Summons Prepared', 'Hearing Scheduled', 'In Conciliation', 'Settled/Referred/CFA Issued', 'Closed'].map((status, idx) => (
            <div key={status} className="flex items-center gap-2">
              <span className="inline-block px-2 py-1 bg-white border border-sky-200 rounded text-xs font-medium text-sky-700">
                {status}
              </span>
              {idx < 5 && <span className="text-sky-400">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by case number, complainant, or respondent..."
        filters={
          <>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
              <option value="">All Dispute Categories</option>
              {KP_DISPUTE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
              <option value="">All Statuses</option>
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </>
        }
      />

      {/* Cases Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={filtered} rowKey={c => c.id} emptyMessage="No cases match your filters." />
      </div>

      {/* Expanded Detail View */}
      {expandedCaseId && (
        <div className="mt-6">
          {filtered
            .filter(c => c.id === expandedCaseId)
            .map(kpCase => (
              <Card key={kpCase.id}>
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center justify-between">
                    {kpCase.caseNo}
                    <StatusChip status={kpCase.status} />
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Dispute Category</p>
                      <p className="font-semibold text-slate-800">{kpCase.disputeCategory}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Filed Date</p>
                      <p className="font-semibold text-slate-800">{formatDate(kpCase.filedDate)}</p>
                    </div>
                  </div>

                  {/* Parties */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Complainant</p>
                      <p className="font-semibold text-forest">{kpCase.complainant}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Respondent</p>
                      <p className="font-semibold text-forest">{kpCase.respondent}</p>
                    </div>
                  </div>

                  {/* Hearing Info */}
                  {kpCase.hearingSchedule && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Hearing Scheduled</p>
                        <p className="font-semibold text-slate-800">{formatDateTime(kpCase.hearingSchedule)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Venue</p>
                        <p className="font-semibold text-slate-800">{kpCase.venue || 'To be confirmed'}</p>
                      </div>
                    </div>
                  )}

                  {/* Settlement Info */}
                  {kpCase.settlementSummary && (
                    <div className="p-4 bg-grass-50 border border-grass-200 rounded">
                      <p className="text-xs text-grass-600 font-semibold uppercase mb-2">Settlement Terms</p>
                      <p className="text-sm text-grass-900">{kpCase.settlementSummary}</p>
                    </div>
                  )}

                  {/* Lupon Info */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Lupon</p>
                    <p className="font-semibold text-slate-800">{kpCase.lupon}</p>
                  </div>

                  {/* Workflow History Timeline */}
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-4 font-semibold">Case Timeline</p>
                    <Timeline
                      events={kpCase.workflowHistory.map((h, idx) => ({
                        id: `event-${idx}`,
                        label: h.status,
                        status: h.action,
                        timestamp: formatDateTime(h.performedAt),
                        actor: h.performedBy,
                      }))}
                    />
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </PageScaffold>
  );
}
