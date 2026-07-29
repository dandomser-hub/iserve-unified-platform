import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusChip } from '@/components/ui/Badge';
import { mockKPNotices } from '@/data/mockBlotterKP';
import type { KPNotice } from '@/types/blotter';
import { formatDate } from '@/utils/formatters';

export function KPNoticesSchedulePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceStatusFilter, setServiceStatusFilter] = useState('');

  const filtered = mockKPNotices.filter(notice => {
    const matchesSearch =
      !searchTerm ||
      notice.caseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.noticeType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesServiceStatus = !serviceStatusFilter || notice.serviceStatus === serviceStatusFilter;

    return matchesSearch && matchesServiceStatus;
  });

  const serviceStatuses = ['Pending', 'Served', 'Failed', 'Unable to Locate'];

  const columns: Column<KPNotice>[] = [
    { key: 'caseNo', header: 'Case No.', render: n => <span className="font-mono text-sm font-semibold">{n.caseNo}</span> },
    { key: 'noticeType', header: 'Notice Type', render: n => n.noticeType },
    { key: 'recipient', header: 'Recipient', render: n => n.recipient },
    { key: 'issuedDate', header: 'Issued Date', render: n => formatDate(n.issuedDate) },
    { key: 'serviceStatus', header: 'Service Status', render: n => <StatusChip status={n.serviceStatus} /> },
    { key: 'scheduleDate', header: 'Scheduled Date', render: n => n.scheduleDate ? formatDate(n.scheduleDate) : '—' },
    { key: 'venue', header: 'Venue', render: n => n.venue || '—' },
  ];

  return (
    <PageScaffold
      title="KP Notices & Schedule"
      subtitle="Track service of notices for KP cases"
      breadcrumbs={[{ label: 'Blotter & KP' }, { label: 'Notices' }]}
      moduleTag="KP Cases"
      priorityTag="P1"
    >
      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by case number, notice type, or recipient..."
        filters={
          <select value={serviceStatusFilter} onChange={e => setServiceStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
            <option value="">All Service Statuses</option>
            {serviceStatuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        }
      />

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={filtered} rowKey={n => n.id} emptyMessage="No notices match your filters." />
      </div>
    </PageScaffold>
  );
}
