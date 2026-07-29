import React, { useState, useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/Badge';
import { useAudit } from '@/app/providers/AuditProvider';
import { formatCurrency } from '@/utils/formatters';
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { mockAnnexE1Items } from '@/data/mockGAD';

export function AnnexE1WorkspacePage() {
  const { logEvent } = useAudit();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return mockAnnexE1Items.filter((item) => {
      const matchesSearch =
        item.plannedActivity.toLowerCase().includes(searchValue.toLowerCase()) ||
        (item.actualActivity?.toLowerCase().includes(searchValue.toLowerCase()) ?? false);

      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchValue, statusFilter]);

  const handleStatusChange = (itemId: string) => {
    logEvent({
      action: 'Updated',
      module: 'GAD',
      recordLabel: `Annex E-1 Item ${itemId}`,
      description: 'Status changed to For Review',
    });
    alert('Item marked for review');
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === 'all' ? null : value);
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Draft', label: 'Draft' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'For Review', label: 'For Review' },
    { value: 'Submitted', label: 'Submitted' },
  ];

  return (
    <PageScaffold
      title="Annex E-1 Workspace"
      subtitle="Accomplishment Reports and Budget Implementation"
      moduleTag="GAD"
      priorityTag="P1"
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <SearchFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          placeholder="Search by planned or actual activity..."
          filters={
            <select value={statusFilter || 'all'} onChange={(e) => handleStatusFilterChange(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          }
        />

        {/* Items Grid */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const variance = (item.actualExpenditure || 0) - (item.plannedBudget || 0);
              const varianceIsNegative = variance < 0;

              return (
                <Card key={item.id} className="p-6 border-l-4 border-l-teal-500">
                  <div className="space-y-5">
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.plannedActivity}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Planned Activity
                        </p>
                      </div>
                      <div className="ml-4">
                        <StatusChip status={item.status} />
                      </div>
                    </div>

                    {/* Actual Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                          Actual Activity
                        </label>
                        {item.actualActivity ? (
                          <p className="text-gray-800 p-3 bg-gray-50 rounded text-sm">
                            {item.actualActivity}
                          </p>
                        ) : (
                          <div className="text-gray-500 p-3 bg-gray-50 rounded text-sm italic flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Not yet implemented
                          </div>
                        )}
                      </div>

                      {/* Budget Comparison */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                          Budget Implementation
                        </label>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Planned Budget</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(item.plannedBudget)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Actual Expenditure</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(item.actualExpenditure ?? 0)}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-gray-200 flex justify-between">
                            <span className="text-gray-700 font-medium">Variance</span>
                            <span
                              className={`font-bold ${
                                varianceIsNegative
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {formatCurrency(variance)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Evidence Section */}
                    <div className="pt-4 border-t border-gray-200">
                      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                        MOVS Evidence
                      </label>
                      {item.movsEvidence ? (
                        <div className="p-3 bg-green-50 rounded border border-green-200 flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span className="text-sm text-green-800">{item.movsEvidence}</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-center">
                          <Upload className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No evidence uploaded</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                      {item.status !== 'For Review' && item.status !== 'Submitted' && (
                        <Button
                          variant="primary"
                          onClick={() => handleStatusChange(item.id)}
                        >
                          Mark for Review
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-12 text-center">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No Annex E-1 items found</p>
            </Card>
          )}
        </div>
      </div>
    </PageScaffold>
  );
}
