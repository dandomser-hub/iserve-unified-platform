import React, { useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { StatCard, Card } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { formatCurrency } from '@/utils/formatters';
import { AlertCircle, DollarSign } from 'lucide-react';
import { mockGADBudget } from '@/data/mockGAD';
import type { GADBudgetAttribution } from '@/types/gad';

export function GADBudgetAttributionPage() {
  const totalAttributed = useMemo(() => {
    return mockGADBudget.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, []);

  const columns: Column<GADBudgetAttribution>[] = [
    { key: 'budgetSource', header: 'Budget Source', render: (item) => item.budgetSource },
    { key: 'referenceNo', header: 'Reference Number', render: (item) => item.referenceNo },
    { key: 'amount', header: 'Amount', render: (item) => formatCurrency(item.amount) },
    { key: 'attributedTo', header: 'Attributed To', render: (item) => item.attributedTo },
    { key: 'year', header: 'Year', render: (item) => item.year },
    { key: 'quarter', header: 'Quarter', render: (item) => item.quarter },
    { key: 'attributionNotes', header: 'Notes', render: (item) => item.attributionNotes },
  ];

  return (
    <PageScaffold
      title="GAD Budget Attribution"
      subtitle="Budget Tracking and Attribution Records"
      moduleTag="GAD"
      priorityTag="P1"
    >
      <div className="space-y-8">
        {/* Summary Card */}
        <StatCard
          title="Total Attributed Budget"
          value={formatCurrency(totalAttributed)}
          subtitle={`${mockGADBudget?.length || 0} budget items tracked`}
          icon={<DollarSign size={20} />}
        />

        {/* Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-900 font-medium">
              Attribution Reference Only
            </p>
            <p className="text-sm text-amber-800 mt-1">
              Budget attribution is for reference tracking only. This is not an
              accounting ledger or official financial record. For authoritative
              budget and expenditure reports, refer to the Finance/Accounting module
              and official DBM records.
            </p>
          </div>
        </div>

        {/* Data Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Budget Attribution Records
          </h3>
          <DataTable
            columns={columns}
            data={mockGADBudget}
            rowKey={item => item.id}
            emptyMessage="No budget attribution records found"
          />
        </Card>

        {/* Attribution Summary by Source */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Attribution Summary by Source
          </h3>
          <div className="space-y-4">
            {mockGADBudget && mockGADBudget.length > 0 ? (
              (() => {
                const bySource = mockGADBudget.reduce(
                  (acc, item) => {
                    const source = item.budgetSource || 'Unknown';
                    if (!acc[source]) {
                      acc[source] = 0;
                    }
                    acc[source] += item.amount || 0;
                    return acc;
                  },
                  {} as Record<string, number>
                );

                const maxAmount = Math.max(...Object.values(bySource));

                return Object.entries(bySource).map(([source, amount]) => (
                  <div key={source}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {source}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${(amount / maxAmount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ));
              })()
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </Card>

        {/* Attribution Summary by Quarter */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Attribution Summary by Quarter
          </h3>
          <div className="space-y-4">
            {mockGADBudget && mockGADBudget.length > 0 ? (
              (() => {
                const byQuarter = mockGADBudget.reduce(
                  (acc, item) => {
                    const quarter = item.quarter || 'Unknown';
                    if (!acc[quarter]) {
                      acc[quarter] = 0;
                    }
                    acc[quarter] += item.amount || 0;
                    return acc;
                  },
                  {} as Record<string, number>
                );

                const maxAmount = Math.max(...Object.values(byQuarter));

                return Object.entries(byQuarter)
                  .sort()
                  .map(([quarter, amount]) => (
                    <div key={quarter}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {quarter}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-teal-600 h-2.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${(amount / maxAmount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ));
              })()
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </Card>
      </div>
    </PageScaffold>
  );
}
