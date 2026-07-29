import { Calendar, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { StatCard } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusChip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockCollectionRecords } from '@/data/mockCollections';
import { formatCurrency, formatDate } from '@/utils/formatters';

type CollectionRecord = typeof mockCollectionRecords[0];

export function CollectionReferenceLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Filter logic
  const filtered = mockCollectionRecords.filter(record => {
    const matchesSearch =
      !searchTerm ||
      record.transactionRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.feeItem.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || record.status === statusFilter;
    const matchesDate = !dateFilter || record.transactionDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Daily summary calculations
  const today = '2024-06-15';
  const todayRecords = mockCollectionRecords.filter(r => r.transactionDate === today);
  const todayTotal = todayRecords.reduce((sum, r) => sum + r.amount, 0);

  const currentMonth = '2024-06';
  const monthRecords = mockCollectionRecords.filter(r => r.transactionDate.startsWith(currentMonth));
  const monthTotal = monthRecords.reduce((sum, r) => sum + r.amount, 0);

  const columns: Column<CollectionRecord>[] = [
    { key: 'transactionRef', header: 'Transaction Ref', render: r => <span className="font-mono text-sm font-semibold">{r.transactionRef}</span> },
    { key: 'payerName', header: 'Payer Name', render: r => r.payerName },
    { key: 'feeItem', header: 'Fee Item', render: r => r.feeItem },
    { key: 'amount', header: 'Amount', render: r => <span className="text-forest font-semibold">{formatCurrency(r.amount)}</span> },
    { key: 'orReferenceNo', header: 'OR Reference', render: r => r.orReferenceNo || '—' },
    { key: 'encodedBy', header: 'Encoded By', render: r => r.encodedBy },
    { key: 'transactionDate', header: 'Date', render: r => formatDate(r.transactionDate) },
    { key: 'status', header: 'Status', render: r => <StatusChip status={r.status} /> },
  ];

  const statuses = ['Recorded', 'Certified'];

  return (
    <PageScaffold
      title="Collection Reference Log"
      subtitle="Reference-only collection tracking"
      breadcrumbs={[{ label: 'Collections' }, { label: 'Reference Log' }]}
      moduleTag="Collections"
      priorityTag="P0"
    >
      {/* Disclaimer Banner */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 items-start">
        <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-900 text-sm">Prototype reference log only</p>
          <p className="text-sm text-amber-800">This is not an accounting ledger. Use official collection records for audit and financial reporting purposes.</p>
        </div>
      </div>

      {/* Daily Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Today's Total"
          value={formatCurrency(todayTotal)}
          subtitle={`${todayRecords.length} transactions`}
          icon={<Calendar size={20} />}
          color="forest"
        />
        <StatCard
          title="Month Total"
          value={formatCurrency(monthTotal)}
          subtitle={`June 2024 (${monthRecords.length} transactions)`}
          icon={<Calendar size={20} />}
          color="ocean"
        />
        <StatCard
          title="Transaction Count"
          value={mockCollectionRecords.length}
          subtitle="All-time reference entries"
          icon={<Calendar size={20} />}
          color="grass"
        />
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by ref, payer name, or fee item..."
        filters={
          <>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="">All Statuses</option>
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </>
        }
      />

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={filtered} rowKey={r => r.id} emptyMessage="No records match your filters." />
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs text-slate-600">
          <span className="font-semibold">Note:</span> This reference log displays collection entries for documentation and tracking purposes only.
          All financial transactions must be reconciled with official accounting records maintained by the Barangay Treasurer's Office.
        </p>
      </div>
    </PageScaffold>
  );
}
