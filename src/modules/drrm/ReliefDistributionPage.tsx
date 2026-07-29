import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card, StatCard } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { getDisasterEvent, mockReliefDistributions } from '@/data/mockDRRM';
import type { ReliefDistribution } from '@/types/drrm';
import { formatDate } from '@/utils/formatters';
import { Package } from 'lucide-react';

export function ReliefDistributionPage() {
  // Calculate metrics
  const totalDistributions = mockReliefDistributions.length;
  const distinctEvents = new Set(mockReliefDistributions.map(d => d.eventId)).size;

  // Get unique events for display
  const eventSummary = mockReliefDistributions.reduce((acc, dist) => {
    const existing = acc.find(e => e.eventId === dist.eventId);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ eventId: dist.eventId, count: 1 });
    }
    return acc;
  }, [] as Array<{ eventId: string; count: number }>);

  const columns: Column<ReliefDistribution>[] = [
    { key: 'recipientName', header: 'Recipient', render: d => d.recipientName },
    { key: 'assistanceType', header: 'Assistance Type', render: d => d.assistanceType },
    { key: 'quantity', header: 'Quantity', render: d => `${d.quantity} ${d.unit}` },
    { key: 'distributionDate', header: 'Distribution Date', render: d => formatDate(d.distributionDate) },
    { key: 'source', header: 'Source', render: d => d.source },
    { key: 'issuedBy', header: 'Issued By', render: d => d.issuedBy },
    { key: 'eventId', header: 'Event', render: d => getDisasterEvent(d.eventId)?.name ?? 'Unknown event' },
    { key: 'remarks', header: 'Remarks', render: d => d.remarks || '—' },
  ];

  return (
    <PageScaffold
      title="Relief Distribution Records"
      subtitle="Track all relief assistance provided to beneficiaries"
      breadcrumbs={[{ label: 'DRRM' }, { label: 'Relief Distribution' }]}
      moduleTag="DRRM"
      priorityTag="P1"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard
          title="Total Distributions"
          value={totalDistributions}
          subtitle="Relief transactions recorded"
          icon={<Package size={20} />}
          color="grass"
        />
        <StatCard
          title="Distinct Events"
          value={distinctEvents}
          subtitle="Emergency events covered"
          icon={<Package size={20} />}
          color="ocean"
        />
      </div>

      {/* Event Summary */}
      {eventSummary.length > 0 && (
        <Card className="mb-6">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Relief by Event</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {eventSummary.map((event, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <p className="font-semibold text-slate-800 text-sm">
                    {getDisasterEvent(event.eventId)?.name ?? 'Unknown event'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{event.count} distribution(s)</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Distribution Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={mockReliefDistributions} rowKey={d => d.id} emptyMessage="No relief distributions recorded." />
      </div>
    </PageScaffold>
  );
}
