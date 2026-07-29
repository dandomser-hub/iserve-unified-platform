import { AlertTriangle, CheckCircle2, Database, GitCommit, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { DRRMReconciliationEvidence, DRRMReportControl } from '@/types/drrm';
import { formatDateTime } from '@/utils/formatters';
import {
  getLatestReconciliationEvidence,
  getLatestValidationEvidence,
} from '@/utils/drrmReportControl';

interface DRRMReportEvidencePanelProps {
  control: DRRMReportControl;
  liveReconciliation: DRRMReconciliationEvidence;
}

function stateClass(state: string) {
  return state === 'Matched' || state === 'Passed'
    ? 'bg-green-100 text-green-700'
    : state === 'Variance' || state === 'Passed with Advisory'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700';
}

export function DRRMReportEvidencePanel({
  control,
  liveReconciliation,
}: DRRMReportEvidencePanelProps) {
  const validation = getLatestValidationEvidence(control);
  const retainedReconciliation = getLatestReconciliationEvidence(control);
  const reconciliation = retainedReconciliation?.version === control.currentVersion
    ? retainedReconciliation
    : liveReconciliation;
  const blockingItems = reconciliation.items.filter(
    item => item.blocking && item.status !== 'Matched',
  );

  return (
    <Card>
      <div className="p-4 border-b border-slate-100">
        <h4 className="font-semibold text-slate-800">Version and Evidence Control</h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Retained revisions, field sources, validation results, and reconciliation evidence
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="p-3 rounded border border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 flex items-center gap-1"><GitCommit size={13} /> Current version</p>
            <p className="text-lg font-bold text-slate-800">v{control.currentVersion}</p>
          </div>
          <div className="p-3 rounded border border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 flex items-center gap-1"><Database size={13} /> Provenance entries</p>
            <p className="text-lg font-bold text-slate-800">{control.fieldProvenance.length}</p>
          </div>
          <div className="p-3 rounded border border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 flex items-center gap-1"><ShieldCheck size={13} /> Latest validation</p>
            <span className={`inline-flex mt-1 px-2 py-0.5 rounded text-xs font-semibold ${stateClass(validation?.outcome ?? 'Incomplete')}`}>
              {validation?.outcome ?? 'Not yet validated'}
            </span>
          </div>
          <div className="p-3 rounded border border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500 flex items-center gap-1"><CheckCircle2 size={13} /> Reconciliation</p>
            <span className={`inline-flex mt-1 px-2 py-0.5 rounded text-xs font-semibold ${stateClass(reconciliation.status)}`}>
              {reconciliation.status}
            </span>
          </div>
        </div>

        {blockingItems.length > 0 && (
          <div className="p-3 rounded border border-red-200 bg-red-50 text-red-800 text-xs">
            <p className="font-semibold flex items-center gap-1">
              <AlertTriangle size={14} /> Blocking reconciliation issue
            </p>
            {blockingItems.map(item => <p key={item.id} className="mt-1">{item.label}: {item.explanation}</p>)}
          </div>
        )}

        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
            Current reconciliation
          </h5>
          <div className="space-y-2">
            {reconciliation.items.map(item => (
              <div key={item.id} className="p-2 rounded border border-slate-200 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className={`px-2 py-0.5 rounded font-semibold ${stateClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-slate-500 mt-1">
                  Source: {item.sourceReference}
                  {item.reportedValue !== undefined && item.referenceValue !== undefined
                    ? ` · Reported ${item.reportedValue}, reference ${item.referenceValue}`
                    : ''}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              Version trail
            </h5>
            <div className="space-y-2">
              {[...control.versions].reverse().map(version => (
                <div key={version.version} className="text-xs">
                  <p className="font-semibold text-slate-700">
                    v{version.version} · {version.reason}
                  </p>
                  <p className="text-slate-500">
                    {version.createdBy} · {formatDateTime(version.createdAt)}
                  </p>
                  {version.changedFields.length > 0 && (
                    <p className="text-slate-500">Fields: {version.changedFields.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              Field provenance
            </h5>
            <div className="space-y-2">
              {[...control.fieldProvenance].reverse().slice(0, 4).map(entry => (
                <div key={entry.id} className="text-xs">
                  <p className="font-semibold text-slate-700">{entry.sourceType} · {entry.sourceReference}</p>
                  <p className="text-slate-500">
                    {entry.capturedBy} · {formatDateTime(entry.capturedAt)}
                  </p>
                  <p className="text-slate-500">Fields: {entry.fieldPaths.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {validation && (
          <div className="pt-3 border-t border-slate-200">
            <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              Retained validation evidence · v{validation.version}
            </h5>
            <p className="text-xs text-slate-500 mb-2">
              {validation.validatedBy} · {formatDateTime(validation.validatedAt)}
            </p>
            <div className="space-y-1">
              {validation.checks.map(check => (
                <p key={check.id} className="text-xs text-slate-700">
                  <span className="font-semibold">{check.label}:</span> {check.message}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
