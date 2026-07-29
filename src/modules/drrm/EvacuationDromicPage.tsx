import { AlertCircle, CheckCircle2, Clock, MapPin, Users } from 'lucide-react';
import { useAudit } from '@/app/providers/AuditProvider';
import { useMockData } from '@/app/providers/MockDataProvider';
import { useCurrentRole, useRole } from '@/app/providers/RoleProvider';
import { DRRMReportEvidencePanel } from '@/components/shared/DRRMReportEvidencePanel';
import { DRRMWorkflowPanel } from '@/components/shared/DRRMWorkflowPanel';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { StatusChip, Badge } from '@/components/ui/Badge';
import {
  getDisasterEvent,
  getOperationalPeriod,
  mockDisasterEvents,
} from '@/data/mockDRRM';
import type { DRRMWorkflowAction, EvacuationRecord } from '@/types/drrm';
import { formatDate } from '@/utils/formatters';
import {
  DROMIC_AGE_BANDS,
  evaluateDROMICProfile,
  sumSexDisaggregatedCount,
} from '@/utils/dromic';
import {
  applyDRRMWorkflowTransition,
  validateDROMICForReview,
} from '@/utils/drrmWorkflow';
import { retainReviewEvidence } from '@/utils/drrmReportControl';
import {
  getBlockingReconciliationIssues,
  reconcileDROMIC,
} from '@/utils/drrmReconciliation';

export function EvacuationDromicPage() {
  const currentEvent = mockDisasterEvents.find(event => event.status !== 'Archived' && event.status !== 'Closed');
  const { evacuationRecords, setEvacuationRecords, showToast } = useMockData();
  const { roleId } = useRole();
  const currentRole = useCurrentRole();
  const { logEvent } = useAudit();

  function handleTransition(
    record: EvacuationRecord,
    action: DRRMWorkflowAction,
    remarks?: string,
  ) {
    try {
      const now = new Date().toISOString();
      const reconciliation = reconcileDROMIC(
        record,
        currentRole?.label ?? 'Unknown User',
        now,
      );
      const validationIssues = [
        ...validateDROMICForReview(record),
        ...getBlockingReconciliationIssues(reconciliation),
      ];
      const result = applyDRRMWorkflowTransition({
        status: record.reportStatus,
        history: record.workflowHistory,
        action,
        roleId,
        performedBy: currentRole?.label ?? 'Unknown User',
        remarks,
        validationIssues,
      });
      setEvacuationRecords(previous => previous.map(item => item.id === record.id ? {
        ...item,
        reportStatus: result.status,
        workflowHistory: result.workflowHistory,
        reportControl: action === 'submit-for-review'
          ? retainReviewEvidence(item.reportControl, {
              recordId: item.id,
              actor: currentRole?.label ?? 'Unknown User',
              validatedAt: now,
              validationIssues,
              reconciliation,
              evidenceReferences: [
                item.disaggregatedPopulation?.source ?? 'Household displacement episodes',
                getOperationalPeriod(item.operationalPeriodId)?.reportingCutoff
                  ?? item.operationalPeriodId,
              ],
            })
          : item.reportControl,
      } : item));
      logEvent({
        action: action === 'approve' ? 'Approved'
          : action === 'return' ? 'Returned'
          : action === 'submit' ? 'Submitted'
          : 'Validated',
        module: 'DRRM',
        recordId: record.id,
        recordLabel: record.evacuationCenterName,
        description: `${result.workflowHistory[result.workflowHistory.length - 1]?.actionLabel}: ${record.evacuationCenterName}`,
      });
      showToast(`${record.evacuationCenterName} report moved to ${result.status}.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Workflow action failed.', 'error');
    }
  }

  return (
    <PageScaffold
      title="Evacuation and Displacement"
      subtitle="DROMIC-ready monitoring: Disaster Response Operations Management, Information and Communication"
      breadcrumbs={[{ label: 'DRRM' }, { label: 'Evacuation and Displacement' }]}
      moduleTag="DRRM"
      priorityTag="P0"
    >
      {currentEvent && (
        <Card className="mb-6">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">DROMIC population snapshot — {currentEvent.name}</h3>
            <p className="text-xs text-slate-500 mt-1">Current and cumulative figures are stored separately.</p>
          </div>
          <div className="p-5 grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              ['Affected', currentEvent.population.affected],
              ['Current inside EC', currentEvent.population.currentDisplaced.insideEvacuationCenters],
              ['Current outside EC', currentEvent.population.currentDisplaced.outsideEvacuationCenters],
              ['Cumulative inside EC', currentEvent.population.cumulativeDisplaced.insideEvacuationCenters],
              ['Cumulative outside EC', currentEvent.population.cumulativeDisplaced.outsideEvacuationCenters],
            ].map(([label, count]) => (
              <div key={label as string} className="p-3 bg-slate-50 border border-slate-200 rounded">
                <p className="text-xs text-slate-500 font-semibold">{label as string}</p>
                <p className="text-lg font-bold text-slate-800 mt-1">
                  {(count as { families: number; persons: number }).families} families
                </p>
                <p className="text-xs text-slate-600">
                  {(count as { families: number; persons: number }).persons} persons
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Evacuation Centers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {evacuationRecords.map(center => {
          const profileSummary = evaluateDROMICProfile(center);
          const profile = center.disaggregatedPopulation;

          return (
          <Card key={center.id} className={center.status === 'Open' ? 'border-sky-200 border-2' : ''}>
            <div className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 border-b border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{center.evacuationCenterName}</h3>
                  <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                    <MapPin size={14} />
                    {center.address}
                  </p>
                  <p className="text-xs text-sky-700 mt-2">
                    {getDisasterEvent(center.eventId)?.name ?? 'Unknown event'} · Operational Period{' '}
                    {getOperationalPeriod(center.operationalPeriodId)?.periodNo ?? '—'}
                  </p>
                </div>
                <StatusChip status={center.status} />
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-white border border-sky-200 rounded">
                  <p className="text-xs text-sky-600 font-semibold uppercase">Families</p>
                  <p className="text-2xl font-bold text-sky-800">{center.displacedFamilies}</p>
                </div>
                <div className="p-2 bg-white border border-sky-200 rounded">
                  <p className="text-xs text-sky-600 font-semibold uppercase">Persons</p>
                  <p className="text-2xl font-bold text-sky-800">{center.displacedPersons}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* DROMIC Disaggregation */}
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Badge label={center.locationType} variant="default" className="text-xs" />
                  {center.locationType === 'Inside Evacuation Center' && (
                    <Badge
                      label={profileSummary.annexExportReady ? 'Annex C/D ready' : 'Reconciliation required'}
                      className={
                        profileSummary.annexExportReady
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }
                    />
                  )}
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">
                  Sex and age distribution
                </p>
                {profile ? (
                  <>
                    <div className="overflow-x-auto border border-slate-200 rounded">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-100 text-slate-600">
                          <tr>
                            <th className="text-left p-2">Age group</th>
                            <th className="text-right p-2">Male</th>
                            <th className="text-right p-2">Female</th>
                            <th className="text-right p-2">Not reported</th>
                            <th className="text-right p-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DROMIC_AGE_BANDS.map(({ key, label }) => {
                            const count = profile.ageSex[key];
                            return (
                              <tr key={key} className="border-t border-slate-200">
                                <td className="p-2 text-slate-700">{label}</td>
                                <td className="p-2 text-right font-medium">{count.male}</td>
                                <td className="p-2 text-right font-medium">{count.female}</td>
                                <td className="p-2 text-right font-medium">{count.notReported}</td>
                                <td className="p-2 text-right font-bold">
                                  {sumSexDisaggregatedCount(count)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                          <tr>
                            <td className="p-2 font-semibold">Total</td>
                            <td className="p-2 text-right font-bold">{profileSummary.ageSex.male}</td>
                            <td className="p-2 text-right font-bold">{profileSummary.ageSex.female}</td>
                            <td className="p-2 text-right font-bold">{profileSummary.ageSex.notReported}</td>
                            <td className="p-2 text-right font-bold">{profileSummary.ageSex.total}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                        <span className="text-sm text-slate-700">Children (under 18)</span>
                        <span className="font-bold text-slate-800">{profileSummary.children}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                        <span className="text-sm text-slate-700">Elderly (60+)</span>
                        <span className="font-bold text-slate-800">{profileSummary.elderly}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                        <span className="text-sm text-slate-700">Pregnant women</span>
                        <span className="font-bold text-slate-800">{profile.sectoral.pregnantWomen}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                        <span className="text-sm text-slate-700">Lactating mothers</span>
                        <span className="font-bold text-slate-800">{profile.sectoral.lactatingMothers}</span>
                      </div>
                      <div className="col-span-2 flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200">
                        <span className="text-sm text-slate-700">Persons with disability</span>
                        <span className="font-bold text-slate-800">{profileSummary.personsWithDisability}</span>
                      </div>
                    </div>

                    <div
                      className={`mt-3 flex gap-2 rounded border p-3 ${
                        profileSummary.issues.length === 0
                          ? 'border-green-200 bg-green-50 text-green-800'
                          : 'border-amber-200 bg-amber-50 text-amber-800'
                      }`}
                    >
                      {profileSummary.issues.length === 0 ? (
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      )}
                      <div className="text-xs">
                        <p className="font-semibold">
                          {profileSummary.issues.length === 0
                            ? 'Population totals reconciled'
                            : 'Data quality review required'}
                        </p>
                        {profileSummary.issues.map(issue => (
                          <p key={issue} className="mt-1">{issue}</p>
                        ))}
                        <p className="mt-1">
                          Source: {profile.source} · Status: {profile.dataQualityStatus}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-sm text-slate-600">
                    Outside-EC families and persons remain separately counted. A disaggregated
                    profile has not been captured for this record and is not presented as DROMIC
                    Annex C/D-ready.
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Household displacement episodes</p>
                <p className="text-sm text-slate-700 mt-1">
                  {center.householdEpisodes.length} sample episode(s); person-level details are captured only when operationally necessary.
                </p>
              </div>

              {/* Origin Puroks */}
              {center.originPuroks.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Origin Puroks</p>
                  <div className="flex flex-wrap gap-2">
                    {center.originPuroks.map((purok, idx) => (
                      <Badge key={idx} label={purok} variant="default" className="text-xs" />
                    ))}
                  </div>
                </div>
              )}

              {/* Needs */}
              {center.needs.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Needs</p>
                  <div className="flex flex-wrap gap-2">
                    {center.needs.map((need, idx) => (
                      <Badge key={idx} label={need} variant="warning" className="text-xs" />
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Info */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Clock size={14} />
                    Reporting Date
                  </span>
                  <span className="font-semibold text-slate-800">{formatDate(center.reportingDate)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Users size={14} />
                    Managed By
                  </span>
                  <span className="font-semibold text-slate-800">{center.managedBy}</span>
                </div>
              </div>

              <DRRMReportEvidencePanel
                control={center.reportControl}
                liveReconciliation={reconcileDROMIC(
                  center,
                  currentRole?.label ?? 'Current Viewer',
                  new Date().toISOString(),
                )}
              />

              <DRRMWorkflowPanel
                status={center.reportStatus}
                history={center.workflowHistory}
                validationIssues={[
                  ...validateDROMICForReview(center),
                  ...getBlockingReconciliationIssues(reconcileDROMIC(
                    center,
                    currentRole?.label ?? 'Current Viewer',
                    new Date().toISOString(),
                  )),
                ]}
                onTransition={(action, remarks) => handleTransition(center, action, remarks)}
              />
            </div>
          </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {evacuationRecords.length === 0 && (
        <Card className="text-center py-12 bg-slate-50 border-slate-200">
          <p className="text-slate-600 font-medium">No evacuation centers on record</p>
        </Card>
      )}
    </PageScaffold>
  );
}
