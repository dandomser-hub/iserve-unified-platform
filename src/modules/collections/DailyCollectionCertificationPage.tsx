import { Download, FileText } from 'lucide-react';
import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { mockCollectionRecords } from '@/data/mockCollections';
import { BARANGAY_INFO } from '@/data/mockReferenceData';
import { formatCurrency, formatDate } from '@/utils/formatters';

type FeeGrouping = {
  feeItem: string;
  count: number;
  total: number;
};

export function DailyCollectionCertificationPage() {
  const [selectedDate, setSelectedDate] = useState('2024-06-15');
  const [certifyStatus, setCertifyStatus] = useState<'draft' | 'submitted' | 'certified'>('draft');

  // Filter records by selected date
  const dayRecords = mockCollectionRecords.filter(r => r.transactionDate === selectedDate);

  // Group by fee item
  const grouped = dayRecords.reduce((acc, record) => {
    const existing = acc.find(g => g.feeItem === record.feeItem);
    if (existing) {
      existing.count++;
      existing.total += record.amount;
    } else {
      acc.push({
        feeItem: record.feeItem,
        count: 1,
        total: record.amount,
      });
    }
    return acc;
  }, [] as FeeGrouping[]);

  const grandTotal = dayRecords.reduce((sum, r) => sum + r.amount, 0);

  const columns: Column<FeeGrouping>[] = [
    { key: 'feeItem', header: 'Fee Item', render: g => g.feeItem },
    { key: 'count', header: 'Count', render: g => g.count },
    { key: 'total', header: 'Total', render: g => <span className="font-semibold text-forest">{formatCurrency(g.total)}</span> },
  ];

  const handleCertify = () => {
    setCertifyStatus('certified');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageScaffold
      title="Daily Collection Certification"
      subtitle="Certify daily collections for official record"
      breadcrumbs={[{ label: 'Collections' }, { label: 'Certification' }]}
      moduleTag="Collections"
      priorityTag="P0"
    >
      {/* Date Filter */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
        />
      </div>

      {/* Summary Table */}
      <Card className="mb-6">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Collection Summary by Fee Item</h3>
          <p className="text-xs text-slate-500 mt-1">For {formatDate(selectedDate)}</p>
        </div>
        <div className="p-5">
          {grouped.length > 0 ? (
            <>
              <DataTable columns={columns} data={grouped} rowKey={g => g.feeItem} />
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Grand Total:</span>
                <span className="text-lg font-bold text-forest">{formatCurrency(grandTotal)}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 py-4">No collections recorded for this date.</p>
          )}
        </div>
      </Card>

      {/* Certification Preview */}
      <Card className="mb-6">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Certification Preview</h3>
          <StatusChip status={certifyStatus} />
        </div>
        <div className="p-6 space-y-4 bg-slate-50">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Barangay</p>
            <p className="font-semibold text-slate-800">{BARANGAY_INFO.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Certification Date</p>
              <p className="font-semibold text-slate-800">{formatDate(selectedDate)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Amount</p>
              <p className="font-bold text-lg text-forest">{formatCurrency(grandTotal)}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Prepared By</p>
            <p className="font-semibold text-slate-800">{BARANGAY_INFO.treasurer}</p>
            <p className="text-xs text-slate-500">Barangay Treasurer</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Transaction Count</p>
            <p className="font-semibold text-slate-800">{dayRecords.length} transactions</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white"
        >
          <Download size={16} />
          Export/Print Simulation
        </Button>

        {certifyStatus !== 'certified' && (
          <Button
            onClick={handleCertify}
            className="flex items-center gap-2 bg-forest hover:bg-forest-dark text-white"
          >
            <FileText size={16} />
            Certify Collections
          </Button>
        )}

        {certifyStatus === 'certified' && (
          <div className="flex items-center gap-2 px-4 py-2 bg-grass-50 border border-grass-200 rounded-lg">
            <div className="w-2 h-2 bg-grass rounded-full"></div>
            <span className="text-sm font-medium text-grass-800">Collections Certified</span>
          </div>
        )}
      </div>
    </PageScaffold>
  );
}
