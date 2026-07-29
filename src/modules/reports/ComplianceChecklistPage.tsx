import React, { useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { StatCard, Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { mockComplianceItems } from '@/data/mockReports';
import type { ComplianceItem } from '@/types/report';

export function ComplianceChecklistPage() {
  const stats = useMemo(() => {
    const compliant = mockComplianceItems.filter(
      (item) => item.status === 'Compliant'
    ).length;
    const inProgress = mockComplianceItems.filter(
      (item) => item.status === 'In Progress'
    ).length;
    const needsAction = mockComplianceItems.filter(
      (item) => item.status === 'Needs Action'
    ).length;

    const total = mockComplianceItems.length;
    const percentage = total > 0 ? Math.round((compliant / total) * 100) : 0;

    return {
      compliant,
      inProgress,
      needsAction,
      total,
      percentage,
    };
  }, []);

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const grouped: Record<string, ComplianceItem[]> = {};

    mockComplianceItems.forEach((item) => {
      const category = item.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });

    return grouped;
  }, []);

  const columns: Column<ComplianceItem>[] = [
    { key: 'item', header: 'Item', render: (item) => item.item },
    { key: 'evidenceReference', header: 'Evidence Reference', render: (item) => item.evidenceReference || '—' },
    { key: 'status', header: 'Status', render: (item) => <StatusChip status={item.status} /> },
    { key: 'responsibleRole', header: 'Responsible Role', render: (item) => item.responsibleRole },
    { key: 'remarks', header: 'Remarks', render: (item) => item.remarks || '—' },
  ];

  return (
    <PageScaffold
      title="Compliance Checklist"
      subtitle="SGLGB / Sangguniang Barangay Gender and Development Compliance"
      moduleTag="Compliance"
      priorityTag="P1"
    >
      <div className="space-y-8">
        {/* Overall Compliance Percentage */}
        <div className="relative h-32 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 flex items-center justify-center border-2 border-green-200">
          <div className="text-center">
            <p className="text-xs text-green-700 uppercase tracking-wider mb-2">
              Overall Compliance Rate
            </p>
            <p className="text-5xl font-bold text-green-700">{stats.percentage}%</p>
            <p className="text-sm text-green-600 mt-2">
              {stats.compliant} of {stats.total} items compliant
            </p>
          </div>
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
            <div className="relative w-24 h-24">
              <svg
                className="transform -rotate-90"
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="8"
                  strokeDasharray={`${(stats.percentage / 100) * 282.7} 282.7`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Compliant Items"
            value={stats.compliant.toString()}
            subtitle={`${stats.percentage}% of total`}
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress.toString()}
            subtitle="Being worked on"
            icon={<Clock size={20} />}
          />
          <StatCard
            title="Needs Action"
            value={stats.needsAction.toString()}
            subtitle="Requires attention"
            icon={<AlertCircle size={20} />}
          />
        </div>

        {/* Compliance Items by Category */}
        <div className="space-y-8">
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category}>
              <Card className="border-l-4 border-l-indigo-600 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category}
                </h3>

                <div className="overflow-x-auto">
                  <DataTable
                    columns={columns}
                    data={items}
                    rowKey={item => item.id}
                    emptyMessage="No items in this category"
                  />
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Legend */}
        <Card className="p-4 bg-gray-50">
          <p className="text-xs text-gray-600 uppercase tracking-wider font-medium mb-3">
            Status Legend
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <StatusChip status="Compliant" />
              <span className="text-gray-700">Requirement met and documented</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusChip status="In Progress" />
              <span className="text-gray-700">Work in progress</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusChip status="Needs Action" />
              <span className="text-gray-700">Action required</span>
            </div>
          </div>
        </Card>
      </div>
    </PageScaffold>
  );
}
