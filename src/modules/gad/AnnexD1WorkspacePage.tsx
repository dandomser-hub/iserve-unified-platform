import React, { useState, useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip, Badge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { useAudit } from '@/app/providers/AuditProvider';
import { formatCurrency } from '@/utils/formatters';
import { ChevronRight, X } from 'lucide-react';
import { mockAnnexD1Items } from '@/data/mockGAD';
import type { GADAnnexD1Item } from '@/types/gad';

export function AnnexD1WorkspacePage() {
  const { logEvent } = useAudit();
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const filteredItems = useMemo(() => {
    return mockAnnexD1Items.filter((item) => {
      const matchesSearch =
        item.genderIssue.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.gadResultStatement.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.activity.toLowerCase().includes(searchValue.toLowerCase());

      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchValue, statusFilter]);

  const columns: Column<GADAnnexD1Item>[] = [
    { key: 'genderIssue', header: 'Gender Issue', render: (item) => item.genderIssue },
    { key: 'gadResultStatement', header: 'GAD Result Statement', render: (item) => item.gadResultStatement },
    { key: 'activity', header: 'Activity', render: (item) => item.activity },
    { key: 'budget', header: 'Budget', render: (item) => formatCurrency(item.budget) },
    { key: 'responsiblePerson', header: 'Responsible Person', render: (item) => item.responsiblePerson },
    { key: 'status', header: 'Status', render: (item) => <StatusChip status={item.status} /> },
  ];

  const handleSelectItem = (item: GADAnnexD1Item) => {
    setSelectedItem(item);
    setShowDetailPanel(true);
  };

  const handleSubmitEndorsed = () => {
    if (selectedItem) {
      logEvent({
        action: 'Submitted',
        module: 'GAD',
        recordLabel: selectedItem.genderIssue,
        description: `Submitted Annex D-1 item for endorsement`,
      });
      alert('Item submitted for endorsement');
      setShowDetailPanel(false);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === 'all' ? null : value);
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Draft', label: 'Draft' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Endorsed', label: 'Endorsed' },
    { value: 'Completed', label: 'Completed' },
  ];

  return (
    <PageScaffold
      title="Annex D-1 Workspace"
      subtitle="Gender Issues and GAD Result Statements"
      moduleTag="GAD"
      priorityTag="P1"
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <SearchFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          placeholder="Search by gender issue, GAD statement, or activity..."
          filters={
            <select value={statusFilter || 'all'} onChange={(e) => handleStatusFilterChange(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
              <option value="all">All Statuses</option>
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          }
        />

        {/* Table */}
        <Card>
          <DataTable
            columns={columns}
            data={filteredItems}
            rowKey={item => item.id}
            emptyMessage="No Annex D-1 items found"
          />
        </Card>

        {/* Detail Panel Modal */}
        <Modal
          isOpen={showDetailPanel}
          onClose={() => setShowDetailPanel(false)}
          title="Annex D-1 Item Details"
          size="lg"
        >
          {selectedItem && (
            <div className="space-y-6">
              {/* Main Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender Issue
                  </label>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded">
                    {selectedItem.genderIssue}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="p-3">
                    <StatusChip status={selectedItem.status} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GAD Result Statement
                  </label>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded">
                    {selectedItem.gadResultStatement}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity
                  </label>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded">
                    {selectedItem.activity}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget
                  </label>
                  <p className="text-lg font-semibold text-green-700 p-3 bg-gray-50 rounded">
                    {formatCurrency(selectedItem.budget)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsible Person
                  </label>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded">
                    {selectedItem.responsiblePerson}
                  </p>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cause
                  </label>
                  <p className="text-gray-700 p-3 bg-gray-50 rounded text-sm">
                    {selectedItem.cause || 'Not specified'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Performance Indicator
                  </label>
                  <p className="text-gray-700 p-3 bg-gray-50 rounded text-sm">
                    {selectedItem.performanceIndicator || 'Not specified'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevant Organizational PAP
                  </label>
                  <p className="text-gray-700 p-3 bg-gray-50 rounded text-sm">
                    {selectedItem.relevantOrgPAP || 'Not specified'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <p className="text-gray-700 p-3 bg-gray-50 rounded text-sm">
                    {selectedItem.remarks || 'No remarks'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => setShowDetailPanel(false)}
                >
                  Close
                </Button>
                {selectedItem.status === 'Endorsed' && (
                  <Button variant="primary" onClick={handleSubmitEndorsed}>
                    Submit for Processing
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageScaffold>
  );
}
