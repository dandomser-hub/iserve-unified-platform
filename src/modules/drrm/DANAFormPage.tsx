import { ChevronDown, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAudit } from '@/app/providers/AuditProvider';
import { useMockData } from '@/app/providers/MockDataProvider';
import { useCurrentRole, useRole } from '@/app/providers/RoleProvider';
import { DRRMReportEvidencePanel } from '@/components/shared/DRRMReportEvidencePanel';
import { DRRMWorkflowPanel } from '@/components/shared/DRRMWorkflowPanel';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { StatusChip, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormField, Input, Select, Textarea } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import {
  getDisasterEvent,
  getOperationalPeriod,
  mockDisasterEvents,
  mockOperationalPeriods,
} from '@/data/mockDRRM';
import type { DANARecord, DRRMWorkflowAction } from '@/types/drrm';
import { formatDate, formatCurrency } from '@/utils/formatters';
import {
  applyDRRMWorkflowTransition,
  validateDANAForReview,
} from '@/utils/drrmWorkflow';
import {
  createInitialReportControl,
  recordReportRevision,
  retainReviewEvidence,
} from '@/utils/drrmReportControl';
import {
  getBlockingReconciliationIssues,
  reconcileDANA,
} from '@/utils/drrmReconciliation';

type DANAEditor = {
  id?: string;
  assessmentDate: string;
  sector: string;
  affectedHouseholds: string;
  affectedPersons: string;
  damageDescription: string;
  estimatedDamage: string;
  immediateNeeds: string;
  evidenceNotes: string;
};

const DANA_SECTORS = ['Housing', 'Agriculture', 'Infrastructure', 'Livelihood / Commerce', 'Health', 'Education', 'Other'];

function splitLines(value: string): string[] {
  return value.split(/\n|,/).map(item => item.trim()).filter(Boolean);
}

export function DANAFormPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { danaRecords, setDANARecords, showToast } = useMockData();
  const { roleId } = useRole();
  const currentRole = useCurrentRole();
  const { logEvent } = useAudit();
  const [editor, setEditor] = useState<DANAEditor | null>(null);

  function openEditor(record?: DANARecord) {
    setEditor(record ? {
      id: record.id,
      assessmentDate: record.assessmentDate,
      sector: record.sector,
      affectedHouseholds: String(record.affectedHouseholds),
      affectedPersons: String(record.affectedPersons),
      damageDescription: record.damageDescription,
      estimatedDamage: String(record.estimatedDamage),
      immediateNeeds: record.immediateNeeds.join('\n'),
      evidenceNotes: record.evidenceNotes ?? '',
    } : {
      assessmentDate: new Date().toISOString().slice(0, 10),
      sector: DANA_SECTORS[0],
      affectedHouseholds: '0',
      affectedPersons: '0',
      damageDescription: '',
      estimatedDamage: '0',
      immediateNeeds: '',
      evidenceNotes: '',
    });
  }

  function saveEditor() {
    if (!editor) return;
    const affectedHouseholds = Number(editor.affectedHouseholds);
    const affectedPersons = Number(editor.affectedPersons);
    const estimatedDamage = Number(editor.estimatedDamage);
    if (
      !editor.assessmentDate ||
      !editor.sector.trim() ||
      !editor.damageDescription.trim() ||
      !Number.isInteger(affectedHouseholds) ||
      affectedHouseholds < 0 ||
      !Number.isInteger(affectedPersons) ||
      affectedPersons < 0 ||
      !Number.isFinite(estimatedDamage) ||
      estimatedDamage < 0
    ) {
      showToast('Complete the required DANA fields with valid non-negative values.', 'error');
      return;
    }

    const now = new Date().toISOString();
    if (editor.id) {
      setDANARecords(previous => previous.map(record => {
        if (record.id !== editor.id) return record;
        const changedFields = [
          'assessmentDate',
          'sector',
          'affectedHouseholds',
          'affectedPersons',
          'damageDescription',
          'estimatedDamage',
          'immediateNeeds',
          'evidenceNotes',
        ];
        const evidenceReference = editor.evidenceNotes.trim() || 'Field DANA assessment update';
        const reportControl = recordReportRevision(record.reportControl, {
          recordId: record.id,
          actor: currentRole?.label ?? 'DRRM Focal',
          capturedAt: now,
          changedFields,
          sourceReference: evidenceReference,
          sourceType: 'Field Observation',
          evidenceReferences: editor.evidenceNotes.trim() ? [editor.evidenceNotes.trim()] : [],
          returnedCorrection: record.status === 'Returned',
          snapshot: {
            assessmentDate: editor.assessmentDate,
            sector: editor.sector,
            affectedHouseholds,
            affectedPersons,
            damageDescription: editor.damageDescription.trim(),
            estimatedDamage,
            immediateNeeds: splitLines(editor.immediateNeeds),
            evidenceNotes: editor.evidenceNotes.trim(),
          },
        });
        return {
          ...record,
          assessmentDate: editor.assessmentDate,
          sector: editor.sector,
          affectedHouseholds,
          affectedPersons,
          damageDescription: editor.damageDescription.trim(),
          estimatedDamage,
          immediateNeeds: splitLines(editor.immediateNeeds),
          evidenceNotes: editor.evidenceNotes.trim() || undefined,
          validationStatus: 'Pending',
          version: reportControl.currentVersion,
          reportControl,
        };
      }));
      logEvent({
        action: 'Updated',
        module: 'DRRM',
        recordId: editor.id,
        recordLabel: danaRecords.find(record => record.id === editor.id)?.danaNo,
        description: 'Updated a Draft or Returned DANA assessment before validation.',
      });
      showToast('DANA changes saved and marked Pending validation.');
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

    const sequence = danaRecords.length + 1;
    const record: DANARecord = {
      id: `DANA${String(sequence).padStart(3, '0')}`,
      danaNo: `DANA-${new Date().getFullYear()}-${String(sequence).padStart(3, '0')}`,
      eventId: event.id,
      operationalPeriodId: period.id,
      assessmentDate: editor.assessmentDate,
      sector: editor.sector,
      affectedHouseholds,
      affectedPersons,
      damageDescription: editor.damageDescription.trim(),
      estimatedDamage,
      immediateNeeds: splitLines(editor.immediateNeeds),
      validationStatus: 'Pending',
      assessedBy: currentRole?.label ?? 'DRRM Focal',
      evidenceNotes: editor.evidenceNotes.trim() || undefined,
      version: 1,
      reportControl: createInitialReportControl({
        recordId: `DANA${String(sequence).padStart(3, '0')}`,
        actor: currentRole?.label ?? 'DRRM Focal',
        capturedAt: now,
        sourceReference: editor.evidenceNotes.trim() || 'Field DANA assessment',
        sourceType: 'Field Observation',
        fieldPaths: [
          'assessmentDate',
          'sector',
          'affectedHouseholds',
          'affectedPersons',
          'damageDescription',
          'estimatedDamage',
          'immediateNeeds',
          'evidenceNotes',
        ],
        evidenceReferences: editor.evidenceNotes.trim() ? [editor.evidenceNotes.trim()] : [],
        snapshot: {
          assessmentDate: editor.assessmentDate,
          sector: editor.sector,
          affectedHouseholds,
          affectedPersons,
          damageDescription: editor.damageDescription.trim(),
          estimatedDamage,
          immediateNeeds: splitLines(editor.immediateNeeds),
          evidenceNotes: editor.evidenceNotes.trim(),
        },
      }),
      status: 'Draft',
      workflowHistory: [],
      createdAt: now,
    };
    setDANARecords(previous => [...previous, record]);
    setExpandedId(record.id);
    logEvent({
      action: 'Created',
      module: 'DRRM',
      recordId: record.id,
      recordLabel: record.danaNo,
      description: `Created ${record.danaNo} as a Draft.`,
    });
    showToast(`${record.danaNo} created as Draft.`);
    setEditor(null);
  }

  function handleTransition(
    dana: DANARecord,
    action: DRRMWorkflowAction,
    remarks?: string,
  ) {
    try {
      const now = new Date().toISOString();
      const reconciliation = reconcileDANA(
        dana,
        currentRole?.label ?? 'Unknown User',
        now,
      );
      const validationIssues = [
        ...validateDANAForReview(dana),
        ...getBlockingReconciliationIssues(reconciliation),
      ];
      const result = applyDRRMWorkflowTransition({
        status: dana.status,
        history: dana.workflowHistory,
        action,
        roleId,
        performedBy: currentRole?.label ?? 'Unknown User',
        remarks,
        validationIssues,
      });
      setDANARecords(previous => previous.map(record => record.id === dana.id ? {
        ...record,
        status: result.status,
        validationStatus: action === 'submit-for-review'
          ? 'Validated'
          : action === 'return'
            ? 'Returned'
            : record.validationStatus,
        workflowHistory: result.workflowHistory,
        reportControl: action === 'submit-for-review'
          ? retainReviewEvidence(record.reportControl, {
              recordId: record.id,
              actor: currentRole?.label ?? 'Unknown User',
              validatedAt: now,
              validationIssues,
              reconciliation,
              evidenceReferences: [
                record.evidenceNotes ?? 'No separate evidence note',
                getOperationalPeriod(record.operationalPeriodId)?.reportingCutoff
                  ?? record.operationalPeriodId,
              ],
            })
          : record.reportControl,
      } : record));
      logEvent({
        action: action === 'approve' ? 'Approved'
          : action === 'return' ? 'Returned'
          : action === 'submit' ? 'Submitted'
          : 'Validated',
        module: 'DRRM',
        recordId: dana.id,
        recordLabel: dana.danaNo,
        description: `${result.workflowHistory[result.workflowHistory.length - 1]?.actionLabel}: ${dana.danaNo}`,
      });
      showToast(`${dana.danaNo} moved to ${result.status}.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Workflow action failed.', 'error');
    }
  }

  return (
    <PageScaffold
      title="DANA Assessment Forms"
      subtitle="Damage and Needs Assessment records"
      breadcrumbs={[{ label: 'DRRM' }, { label: 'DANA' }]}
      moduleTag="DRRM"
      priorityTag="P0"
      actions={roleId === 'drrm_focal' ? (
        <Button size="sm" variant="primary" onClick={() => openEditor()}>
          <Plus size={14} /> New DANA
        </Button>
      ) : undefined}
    >
      {/* DANA Records List */}
      <div className="grid grid-cols-1 gap-4">
        {danaRecords.map(dana => (
          <Card key={dana.id}>
            <div
              onClick={() => setExpandedId(expandedId === dana.id ? null : dana.id)}
              className="p-5 border-b border-slate-100 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition"
            >
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="font-mono text-sm">{dana.danaNo}</span>
                  <Badge variant="default" className="text-xs" label={dana.sector} />
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {getDisasterEvent(dana.eventId)?.name ?? 'Unknown event'} · {formatDate(dana.assessmentDate)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-forest">{formatCurrency(dana.estimatedDamage)}</p>
                  <p className="text-xs text-slate-500">Damage estimate</p>
                </div>
                <StatusChip status={dana.validationStatus} />
                <ChevronDown
                  size={20}
                  className={`text-slate-400 transition ${expandedId === dana.id ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === dana.id && (
              <div className="p-6 bg-slate-50 space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Assessment Date</p>
                    <p className="font-semibold text-slate-800">{formatDate(dana.assessmentDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Event Name</p>
                    <p className="font-semibold text-slate-800">{getDisasterEvent(dana.eventId)?.name ?? 'Unknown event'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Operational Period</p>
                    <p className="font-semibold text-slate-800">
                      {getOperationalPeriod(dana.operationalPeriodId)?.periodNo
                        ? `Period ${getOperationalPeriod(dana.operationalPeriodId)?.periodNo}`
                        : 'Unknown period'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Version</p>
                    <p className="font-semibold text-slate-800">v{dana.version}</p>
                  </div>
                </div>

                {/* Affected Numbers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white border border-slate-200 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Households</p>
                    <p className="text-xl font-bold text-ocean">{dana.affectedHouseholds}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Persons</p>
                    <p className="text-xl font-bold text-sky">{dana.affectedPersons}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Est. Damage</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(dana.estimatedDamage)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Validation</p>
                    <StatusChip status={dana.validationStatus} />
                  </div>
                </div>

                {/* Damage Description */}
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Damage Description</p>
                  <p className="text-slate-700 leading-relaxed p-3 bg-white border border-slate-200 rounded">
                    {dana.damageDescription}
                  </p>
                </div>

                {/* Immediate Needs */}
                {dana.immediateNeeds && dana.immediateNeeds.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Immediate Needs</p>
                    <ul className="space-y-1">
                      {dana.immediateNeeds.map((need, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                          {need}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Assessment Info */}
                <div className="pt-4 border-t border-slate-300 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Assessed By</p>
                    <p className="font-semibold text-slate-800">{dana.assessedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Status</p>
                    <StatusChip status={dana.status} />
                  </div>
                </div>

                {/* Evidence Notes */}
                {dana.evidenceNotes && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-xs text-blue-600 font-semibold uppercase mb-2">Evidence Notes</p>
                    <p className="text-sm text-blue-900">{dana.evidenceNotes}</p>
                  </div>
                )}

                <DRRMReportEvidencePanel
                  control={dana.reportControl}
                  liveReconciliation={reconcileDANA(
                    dana,
                    currentRole?.label ?? 'Current Viewer',
                    new Date().toISOString(),
                  )}
                />

                <DRRMWorkflowPanel
                  status={dana.status}
                  history={dana.workflowHistory}
                  validationIssues={[
                    ...validateDANAForReview(dana),
                    ...getBlockingReconciliationIssues(reconcileDANA(
                      dana,
                      currentRole?.label ?? 'Current Viewer',
                      new Date().toISOString(),
                    )),
                  ]}
                  onTransition={(action, remarks) => handleTransition(dana, action, remarks)}
                />

                {roleId === 'drrm_focal' && ['Draft', 'Returned'].includes(dana.status) && (
                  <Button variant="secondary" onClick={() => openEditor(dana)}>
                    <Pencil size={15} /> Edit Assessment
                  </Button>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {danaRecords.length === 0 && (
        <Card className="text-center py-12 bg-slate-50 border-slate-200">
          <p className="text-slate-600 font-medium">No DANA records found</p>
        </Card>
      )}

      <Modal
        isOpen={editor !== null}
        onClose={() => setEditor(null)}
        title={editor?.id ? 'Edit DANA Assessment' : 'Create DANA Assessment'}
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
            <FormField label="Assessment Date" required>
              <Input type="date" value={editor.assessmentDate} onChange={event => setEditor({ ...editor, assessmentDate: event.target.value })} />
            </FormField>
            <FormField label="Sector" required>
              <Select value={editor.sector} onChange={event => setEditor({ ...editor, sector: event.target.value })}>
                {DANA_SECTORS.map(sector => <option key={sector} value={sector}>{sector}</option>)}
              </Select>
            </FormField>
            <FormField label="Affected Households" required>
              <Input type="number" min="0" value={editor.affectedHouseholds} onChange={event => setEditor({ ...editor, affectedHouseholds: event.target.value })} />
            </FormField>
            <FormField label="Affected Persons" required>
              <Input type="number" min="0" value={editor.affectedPersons} onChange={event => setEditor({ ...editor, affectedPersons: event.target.value })} />
            </FormField>
            <FormField label="Estimated Damage (PHP)" required>
              <Input type="number" min="0" step="0.01" value={editor.estimatedDamage} onChange={event => setEditor({ ...editor, estimatedDamage: event.target.value })} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Damage Description" required>
                <Textarea value={editor.damageDescription} onChange={event => setEditor({ ...editor, damageDescription: event.target.value })} rows={4} />
              </FormField>
            </div>
            <FormField label="Immediate Needs" hint="One item per line.">
              <Textarea value={editor.immediateNeeds} onChange={event => setEditor({ ...editor, immediateNeeds: event.target.value })} rows={4} />
            </FormField>
            <FormField label="Evidence Notes">
              <Textarea value={editor.evidenceNotes} onChange={event => setEditor({ ...editor, evidenceNotes: event.target.value })} rows={4} />
            </FormField>
          </div>
        )}
      </Modal>
    </PageScaffold>
  );
}
