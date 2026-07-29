import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/Badge';
import { mockKPMinutes } from '@/data/mockBlotterKP';
import { formatDate } from '@/utils/formatters';

export function KPMinutesSettlementPage() {
  return (
    <PageScaffold
      title="KP Minutes & Settlement Records"
      subtitle="View settlement agreements and mediation session minutes"
      breadcrumbs={[{ label: 'Blotter & KP' }, { label: 'Minutes' }]}
      moduleTag="KP Cases"
      priorityTag="P1"
    >
      {/* Minutes Cards */}
      <div className="grid grid-cols-1 gap-6">
        {mockKPMinutes.map(minutes => (
          <Card key={minutes.id}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{minutes.caseNo}</h3>
                <p className="text-sm text-slate-500 mt-1">Session on {formatDate(minutes.sessionDate)}</p>
              </div>
              {minutes.complianceStatus && <StatusChip status={minutes.complianceStatus} />}
            </div>

            <div className="p-6 space-y-6">
              {/* Session Summary */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Session Summary</p>
                <p className="text-slate-700 leading-relaxed">{minutes.minutesSummary}</p>
              </div>

              {/* Settlement Terms */}
              {minutes.settlementTerms && (
                <div className="p-4 bg-grass-50 border border-grass-200 rounded">
                  <p className="text-xs text-grass-600 uppercase tracking-wide font-semibold mb-2">Settlement Terms</p>
                  <p className="text-sm text-grass-900 leading-relaxed">{minutes.settlementTerms}</p>
                </div>
              )}

              {/* Key Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Compliance Status</p>
                  {minutes.complianceStatus ? <StatusChip status={minutes.complianceStatus} /> : <p className="text-sm text-slate-600">—</p>}
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Prepared By</p>
                  <p className="font-semibold text-slate-800">{minutes.preparedBy}</p>
                </div>
              </div>

              {/* Next Steps */}
              {minutes.nextSteps && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold mb-2">Next Steps</p>
                  <p className="text-sm text-blue-900 leading-relaxed">{minutes.nextSteps}</p>
                </div>
              )}

              {/* Attendees */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">Attendees</p>
                <ul className="space-y-1">
                  {minutes.attendees.map((attendee, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                      {attendee}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockKPMinutes.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-slate-500 text-sm">No settlement minutes recorded yet.</p>
        </Card>
      )}
    </PageScaffold>
  );
}
