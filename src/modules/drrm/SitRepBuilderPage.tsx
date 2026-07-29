import { ChevronDown, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAudit } from '@/app/providers/AuditProvider';
import { useMockData } from '@/app/providers/MockDataProvider';
import { useCurrentRole, useRole } from '@/app/providers/RoleProvider';
import { DRRMReportEvidencePanel } from '@/components/shared/DRRMReportEvidencePanel';
import { DRRMWorkflowPanel } from '@/components/shared/DRRMWorkflowPanel';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusChip, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormField, Input, Textarea } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import {
  getDisasterEvent,
  getOperationalPeriod,
  mockDisasterEvents,
  mockOperationalPeriods,
} from '@/data/mockDRRM';
import type { DRRMWorkflowAction, SitRep } from '@/types/drrm';
import { formatDate, formatDateTime } from '@/utils/formatters';
import {
  applyDRRMWorkflowTransition,
  validateSitRepForReview,
} from '@/utils/drrmWorkflow';
import {
  createInitialReportControl,
  recordReportRevision,
  retainReviewEvidence,
} from '@/utils/drrmReportControl';
import {
  getBlockingReconciliationIssues,
  reconcileSitRep,
} from '@/utils/drrmReconciliation';

type Lifeline = { lifeline: string; status: string };
type SitRepEditor = {
  id?: string;
  affectedAreas: string;
  affectedFamilies: string;
  affectedPersons: string;
  casualties: string;
  injuries: string;
  missingPersons: string;
  immediateNeeds: string;
  actionsTaken: string;
};

const EMPTY_EDITOR: SitRepEditor = {
  affectedAreas: '',
  affectedFamilies: '0',
  affectedPersons: '0',
  casualties: '0',
  injuries: '0',
  missingPersons: '0',
  immediateNeeds: '',
  actionsTaken: '',
};

function splitLines(value: string): string[] {
  return value.split(/\n|,/).map(item => item.trim()).filter(Boolean);
}

export function SitRepBuilderPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { sitReps, setSitReps, showToast } = useMockData();
  const { roleId } = useRole();
  const currentRole = useCurrentRole();
  const { logEvent } = useAudit();
  const [editor, setEditor] = useState<SitRepEditor | null>(null);

  function openEditor(record?: SitRep) {
    setEditor(record ? {
      id: record.id,
      affectedAreas: record.affectedAreas.join(', '),
      affectedFamilies: String(record.affectedFamilies),
      affectedPersons: String(record.affectedPersons),
      casualties: String(record.casualties),
      injuries: String(record.injuries),
      missingPersons: String(record.missingPersons),
      immediateNeeds: record.immediateNeeds.join('\n'),
      actionsTaken: record.actionsTaken.join('\n'),
    } : {
      ...EMPTY_EDITOR,
      affectedAreas: mockDisasterEvents.find(event => event.status === 'De-escalating' || event.status === 'Active')
        ?.affectedAreas.join(', ') ?? '',
    });
  }

  function saveEditor() {
    if (!editor) return;
    const numbers = {
      affectedFamilies: Number(editor.affectedFamilies),
      affectedPersons: Number(editor.affectedPersons),
      casualties: Number(editor.casualties),
      injuries: Number(editor.injuries),
      missingPersons: Number(editor.missingPersons),
    };
    if (
      splitLines(editor.affectedAreas).length === 0 ||
      Object.values(numbers).some(value => !Number.isInteger(value) || value < 0)
    ) {
      showToast('Enter an affected area and non-negative whole-number counts.', 'error');
      return;
    }

    const now = new Date().toISOString();
    if (editor.id) {
      setSitReps(previous => previous.map(record => {
        if (record.id !== editor.id) return record;
        const changedFields = [
          'affectedAreas',
          'affectedFamilies',
          'affectedPersons',
          'casualties',
          'injuries',
          'missingPersons',
          'immediateNeeds',
          'actionsTaken',
        ];
        const reportControl = recordReportRevision(record.reportControl, {
          recordId: record.id,
          actor: currentRole?.label ?? 'DRRM Focal',
          capturedAt: now,
          changedFields,
          sourceReference: 'Barangay EOC SitRep correction',
          evidenceReferences: [
            getOperationalPeriod(record.operationalPeriodId)?.reportingCutoff
              ?? record.operationalPeriodId,
          ],
          returnedCorrection: record.status === 'Returned',
          snapshot: {
            affectedAreas: splitLines(editor.affectedAreas),
            ...numbers,
            immediateNeeds: splitLines(editor.immediateNeeds),
            actionsTaken: splitLines(editor.actionsTaken),
            lifelinesStatus: record.lifelinesStatus,
          },
        });
        return {
          ...record,
          ...numbers,
          affectedAreas: splitLines(editor.affectedAreas),
          immediateNeeds: splitLines(editor.immediateNeeds),
          actionsTaken: splitLines(editor.actionsTaken),
          version: reportControl.currentVersion,
          reportControl,
          updatedAt: now,
        };
      }));
      logEvent({
        action: 'Updated',
        module: 'DRRM',
        recordId: editor.id,
        recordLabel: sitReps.find(record => record.id === editor.id)?.sitRepNo,
        description: 'Updated a Draft or Returned SitRep before validation.',
      });
      showToast('SitRep changes saved.');
      setEditor(null);
      return;
    }

    const event = mockDisasterEvents.find(
      item => item.status !== 'Archived' && item.status !== 'Closed',
    );
    const period = event
      ? mockOperationalPeriods.find(item => item.eventId === event.id && item.status === 'Active')
      : undefined;
    if (!event || !period) {
      showToast('An active disaster event and operational period are required.', 'error');
      return;
    }

    const sequence = sitReps.length + 1;
    const id = `SR${String(sequence).padStart(3, '0')}`;
    const record: SitRep = {
      id,
      sitRepNo: `SITREP-${new Date().getFullYear()}-${String(sequence).padStart(3, '0')}`,
      eventId: event.id,
      operationalPeriodId: period.id,
      affectedAreas: splitLines(editor.affectedAreas),
      ...numbers,
      lifelinesStatus: [],
      immediateNeeds: splitLines(editor.immediateNeeds),
      actionsTaken: splitLines(editor.actionsTaken),
      preparedBy: currentRole?.label ?? 'DRRM Focal',
      version: 1,
      reportControl: createInitialReportControl({
        recordId: id,
        actor: currentRole?.label ?? 'DRRM Focal',
        capturedAt: now,
        sourceReference: 'Barangay EOC SitRep encoding',
        fieldPaths: [
          'affectedAreas',
          'affectedFamilies',
          'affectedPersons',
          'casualties',
          'injuries',
          'missingPersons',
          'immediateNeeds',
          'actionsTaken',
        ],
        evidenceReferences: [period.reportingCutoff],
        snapshot: {
          affectedAreas: splitLines(editor.affectedAreas),
          ...numbers,
          lifelinesStatus: [],
          immediateNeeds: splitLines(editor.immediateNeeds),
          actionsTaken: splitLines(editor.actionsTaken),
        },
      }),
      status: 'Draft',
      workflowHistory: [],
      createdAt: now,
      updatedAt: now,
    };
    setSitReps(previous => [...previous, record]);
    setExpandedId(record.id);
    logEvent({
      action: 'Created',
      module: 'DRRM',
      recordId: record.id,
      recordLabel: record.sitRepNo,
      description: `Created ${record.sitRepNo} as a Draft.`,
    });
    showToast(`${record.sitRepNo} created as Draft.`);
    setEditor(null);
  }

  function handleTransition(
    sitRep: SitRep,
    action: DRRMWorkflowAction,
    remarks?: string,
  ) {
    try {
      const now = new Date().toISOString();
      const reconciliation = reconcileSitRep(
        sitRep,
        getDisasterEvent(sitRep.eventId),
        currentRole?.label ?? 'Unknown User',
        now,
      );
      const validationIssues = [
        ...validateSitRepForReview(sitRep),
        ...getBlockingReconciliationIssues(reconciliation),
      ];
      const result = applyDRRMWorkflowTransition({
        status: sitRep.status,
        history: sitRep.workflowHistory,
        action,
        roleId,
        performedBy: currentRole?.label ?? 'Unknown User',
        remarks,
        validationIssues,
      });
      setSitReps(previous => previous.map(record => record.id === sitRep.id ? {
        ...record,
        status: result.status,
        workflowHistory: result.workflowHistory,
        reportControl: action === 'submit-for-review'
          ? retainReviewEvidence(record.reportControl, {
              recordId: record.id,
              actor: currentRole?.label ?? 'Unknown User',
              validatedAt: now,
              validationIssues,
              reconciliation,
              evidenceReferences: [
                getDisasterEvent(record.eventId)?.eventCode ?? record.eventId,
                getOperationalPeriod(record.operationalPeriodId)?.reportingCutoff
                  ?? record.operationalPeriodId,
              ],
            })
          : record.reportControl,
        submittedBy: result.status === 'Submitted'
          ? currentRole?.label
          : record.submittedBy,
        updatedAt: now,
      } : record));
      logEvent({
        action: action === 'approve' ? 'Approved'
          : action === 'return' ? 'Returned'
          : action === 'submit' ? 'Submitted'
          : 'Validated',
        module: 'DRRM',
        recordId: sitRep.id,
        recordLabel: sitRep.sitRepNo,
        description: `${result.workflowHistory[result.workflowHistory.length - 1]?.actionLabel}: ${sitRep.sitRepNo}`,
      });
      showToast(`${sitRep.sitRepNo} moved to ${result.status}.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Workflow action failed.', 'error');
    }
  }

  const eventName = (sitRep: SitRep) => getDisasterEvent(sitRep.eventId)?.name ?? 'Unknown event';
  const periodLabel = (sitRep: SitRep) => {
    const period = getOperationalPeriod(sitRep.operationalPeriodId);
    return period
      ? `${formatDateTime(period.startsAt)} to ${formatDateTime(period.endsAt)}`
      : 'Unknown operational period';
  };

  // List view table columns
  const columns: Column<SitRep>[] = [
    { key: 'sitRepNo', header: 'SitRep No.', render: s => <span className="font-mono text-sm font-semibold">{s.sitRepNo}</span> },
    { key: 'eventId', header: 'Event', render: s => eventName(s) },
    { key: 'operationalPeriodId', header: 'Operational Period', render: s => <span className="text-xs">{periodLabel(s)}</span> },
    { key: 'version', header: 'Version', render: s => <Badge label={`v${s.version}`} variant="default" /> },
    { key: 'status', header: 'Status', render: s => <StatusChip status={s.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      render: s => (
        <button onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition">
          <ChevronDown size={14} className={`transition ${expandedId === s.id ? 'rotate-180' : ''}`} />
          Details
        </button>
      ),
    },
  ];

  return (
    <PageScaffold
      title="Situation Report (SitRep) Builder"
      subtitle="Create and manage situational reports for emergencies"
      breadcrumbs={[{ label: 'DRRM' }, { label: 'SitRep' }]}
      moduleTag="DRRM"
      priorityTag="P0"
      actions={roleId === 'drrm_focal' ? (
        <Button size="sm" variant="primary" onClick={() => openEditor()}>
          <Plus size={14} /> New SitRep
        </Button>
      ) : undefined}
    >
      {/* List View */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-6">
        <DataTable columns={columns} data={sitReps} rowKey={s => s.id} />
        {sitReps.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <p className="text-sm">No SitReps created yet.</p>
          </div>
        )}
      </div>

      {/* Expanded Detail View */}
      {expandedId && (
        <div className="space-y-6">
          {sitReps
            .filter(s => s.id === expandedId)
            .map(sitRep => (
              <Card key={sitRep.id}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{sitRep.sitRepNo}</h3>
                    <p className="text-sm text-slate-600 mt-1">{eventName(sitRep)}</p>
                  </div>
                  <StatusChip status={sitRep.status} />
                </div>

                <div className="p-6 space-y-6">
                  {/* Header Info */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Event Name</p>
                      <p className="font-semibold text-slate-800">{eventName(sitRep)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Operational Period</p>
                      <p className="font-semibold text-slate-800 text-sm">{periodLabel(sitRep)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Version</p>
                      <p className="font-semibold text-slate-800">v{sitRep.version}</p>
                    </div>
                  </div>

                  {/* Affected Areas */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Affected Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {sitRep.affectedAreas.map((area, idx) => (
                        <Badge key={idx} label={area} variant="default" />
                      ))}
                    </div>
                  </div>

                  {/* Casualty Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Casualties</p>
                      <p className="text-2xl font-bold text-red-600">{sitRep.casualties}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Injuries</p>
                      <p className="text-2xl font-bold text-amber-600">{sitRep.injuries}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Missing</p>
                      <p className="text-2xl font-bold text-slate-600">{sitRep.missingPersons}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Families</p>
                      <p className="text-2xl font-bold text-ocean">{sitRep.affectedFamilies}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Persons</p>
                      <p className="text-2xl font-bold text-sky">{sitRep.affectedPersons}</p>
                    </div>
                  </div>

                  {/* Lifelines Status */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">Lifelines Status</p>
                    <div className="space-y-2">
                      {sitRep.lifelinesStatus.map((lifeline, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded">
                          <span className="font-semibold text-slate-800">{lifeline.lifeline}</span>
                          <span className="text-sm text-slate-700">{lifeline.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Immediate Needs */}
                  {sitRep.immediateNeeds.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Immediate Needs</p>
                      <ul className="space-y-1">
                        {sitRep.immediateNeeds.map((need, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            {need}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions Taken */}
                  {sitRep.actionsTaken.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Actions Taken</p>
                      <ul className="space-y-1">
                        {sitRep.actionsTaken.map((action, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-grass-500 rounded-full"></span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prepared By */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Prepared By</p>
                      <p className="font-semibold text-slate-800">{sitRep.preparedBy}</p>
                    </div>
                    {sitRep.submittedBy && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Submitted By</p>
                        <p className="font-semibold text-slate-800">{sitRep.submittedBy}</p>
                      </div>
                    )}
                  </div>

                  <DRRMReportEvidencePanel
                    control={sitRep.reportControl}
                    liveReconciliation={reconcileSitRep(
                      sitRep,
                      getDisasterEvent(sitRep.eventId),
                      currentRole?.label ?? 'Current Viewer',
                      new Date().toISOString(),
                    )}
                  />

                  <DRRMWorkflowPanel
                    status={sitRep.status}
                    history={sitRep.workflowHistory}
                    validationIssues={[
                      ...validateSitRepForReview(sitRep),
                      ...getBlockingReconciliationIssues(reconcileSitRep(
                        sitRep,
                        getDisasterEvent(sitRep.eventId),
                        currentRole?.label ?? 'Current Viewer',
                        new Date().toISOString(),
                      )),
                    ]}
                    onTransition={(action, remarks) => handleTransition(sitRep, action, remarks)}
                  />

                  {roleId === 'drrm_focal' && ['Draft', 'Returned'].includes(sitRep.status) && (
                    <Button variant="secondary" onClick={() => openEditor(sitRep)}>
                      <Pencil size={15} /> Edit Draft Data
                    </Button>
                  )}
                </div>
              </Card>
            ))}
        </div>
      )}

      <Modal
        isOpen={editor !== null}
        onClose={() => setEditor(null)}
        title={editor?.id ? 'Edit SitRep Draft' : 'Create SitRep Draft'}
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditor(null)}>Cancel</Button>
            <Button variant="primary" onClick={saveEditor}>Save Draft</Button>
          </div>
        }
      >
        {editor && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Affected Areas" required hint="Separate entries with commas.">
              <Input
                value={editor.affectedAreas}
                onChange={event => setEditor({ ...editor, affectedAreas: event.target.value })}
              />
            </FormField>
            <FormField label="Affected Families" required>
              <Input type="number" min="0" value={editor.affectedFamilies} onChange={event => setEditor({ ...editor, affectedFamilies: event.target.value })} />
            </FormField>
            <FormField label="Affected Persons" required>
              <Input type="number" min="0" value={editor.affectedPersons} onChange={event => setEditor({ ...editor, affectedPersons: event.target.value })} />
            </FormField>
            <FormField label="Casualties" required>
              <Input type="number" min="0" value={editor.casualties} onChange={event => setEditor({ ...editor, casualties: event.target.value })} />
            </FormField>
            <FormField label="Injuries" required>
              <Input type="number" min="0" value={editor.injuries} onChange={event => setEditor({ ...editor, injuries: event.target.value })} />
            </FormField>
            <FormField label="Missing Persons" required>
              <Input type="number" min="0" value={editor.missingPersons} onChange={event => setEditor({ ...editor, missingPersons: event.target.value })} />
            </FormField>
            <FormField label="Immediate Needs" hint="One item per line." >
              <Textarea value={editor.immediateNeeds} onChange={event => setEditor({ ...editor, immediateNeeds: event.target.value })} rows={4} />
            </FormField>
            <FormField label="Actions Taken" hint="One item per line.">
              <Textarea value={editor.actionsTaken} onChange={event => setEditor({ ...editor, actionsTaken: event.target.value })} rows={4} />
            </FormField>
          </div>
        )}
      </Modal>
    </PageScaffold>
  );
}
