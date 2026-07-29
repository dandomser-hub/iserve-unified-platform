import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusChip } from '@/components/ui/Badge';
import { mockBDRRMCActions } from '@/data/mockDRRM';
import { formatDate } from '@/utils/formatters';

type ActionItem = { item: string; responsible: string; deadline: string; status: 'Pending' | 'In Progress' | 'Done' };

export function BDRRMCActionTrackerPage() {
  const columns: Column<ActionItem>[] = [
    { key: 'item', header: 'Action Item', render: a => a.item },
    { key: 'responsible', header: 'Responsible', render: a => a.responsible },
    { key: 'deadline', header: 'Deadline', render: a => formatDate(a.deadline) },
    { key: 'status', header: 'Status', render: a => <StatusChip status={a.status} /> },
  ];

  return (
    <PageScaffold
      title="BDRRMC Action Tracker"
      subtitle="Monitor Barangay Disaster Risk Reduction and Management Committee actions and decisions"
      breadcrumbs={[{ label: 'DRRM' }, { label: 'BDRRMC Actions' }]}
      moduleTag="DRRM"
      priorityTag="P1"
    >
      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-6">
        {mockBDRRMCActions.map(action => (
          <Card key={action.id}>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-forest/5 to-ocean/5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-800">{action.agenda}</h3>
                <StatusChip status={action.status} />
              </div>
              <p className="text-sm text-slate-600">Meeting Date: {formatDate(action.meetingDate)}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Attendees */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">Attendees</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {action.attendees.map((attendee, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-forest rounded-full"></span>
                      {attendee}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decisions */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">Decisions</p>
                <ul className="space-y-2">
                  {action.decisions.map((decision, idx) => (
                    <li key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                      {decision}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Items Table */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">Action Items</p>
                <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                  <DataTable columns={columns} data={action.actionItems} rowKey={a => a.item} />
                </div>
              </div>

              {/* Minutes (if available) */}
              {action.minutes && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Minutes</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{action.minutes}</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockBDRRMCActions.length === 0 && (
        <Card className="text-center py-12 bg-slate-50 border-slate-200">
          <p className="text-slate-600 font-medium">No BDRRMC actions recorded</p>
        </Card>
      )}
    </PageScaffold>
  );
}
