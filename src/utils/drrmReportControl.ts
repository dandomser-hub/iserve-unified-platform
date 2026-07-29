import type {
  DRRMFieldProvenance,
  DRRMReconciliationEvidence,
  DRRMReportControl,
  DRRMValidationEvidence,
} from '@/types/drrm';

interface InitialReportControlParams {
  recordId: string;
  version?: number;
  actor: string;
  capturedAt: string;
  sourceReference: string;
  fieldPaths: string[];
  sourceType?: DRRMFieldProvenance['sourceType'];
  evidenceReferences?: string[];
  snapshot?: Record<string, unknown>;
}

export function createInitialReportControl({
  recordId,
  version = 1,
  actor,
  capturedAt,
  sourceReference,
  fieldPaths,
  sourceType = 'Officer Entry',
  evidenceReferences = [],
  snapshot,
}: InitialReportControlParams): DRRMReportControl {
  const versions = Array.from({ length: version }, (_, index) => {
    const versionNo = index + 1;
    return {
      version: versionNo,
      createdAt: capturedAt,
      createdBy: actor,
      reason: versionNo === 1 ? 'Initial Record' as const : 'Legacy Version' as const,
      supersedesVersion: versionNo > 1 ? versionNo - 1 : undefined,
      changedFields: versionNo === version ? fieldPaths : [],
      sourceReference,
      snapshot: snapshot ?? {
        legacyVersion: true,
        retainedSourceReference: sourceReference,
      },
    };
  });

  return {
    currentVersion: version,
    versions,
    fieldProvenance: [{
      id: `${recordId}-PROV-${version}`,
      fieldPaths,
      sourceType,
      sourceReference,
      capturedBy: actor,
      capturedAt,
      evidenceReferences,
    }],
    validationEvidence: [],
    reconciliationEvidence: [],
  };
}

export function recordReportRevision(
  control: DRRMReportControl,
  params: {
    recordId: string;
    actor: string;
    capturedAt: string;
    changedFields: string[];
    sourceReference: string;
    sourceType?: DRRMFieldProvenance['sourceType'];
    evidenceReferences?: string[];
    returnedCorrection: boolean;
    snapshot: Record<string, unknown>;
  },
): DRRMReportControl {
  const nextVersion = control.currentVersion + 1;
  return {
    ...control,
    currentVersion: nextVersion,
    versions: [...control.versions, {
      version: nextVersion,
      createdAt: params.capturedAt,
      createdBy: params.actor,
      reason: params.returnedCorrection ? 'Returned Correction' : 'Draft Update',
      supersedesVersion: control.currentVersion,
      changedFields: params.changedFields,
      sourceReference: params.sourceReference,
      snapshot: params.snapshot,
    }],
    fieldProvenance: [...control.fieldProvenance, {
      id: `${params.recordId}-PROV-${nextVersion}`,
      fieldPaths: params.changedFields,
      sourceType: params.sourceType ?? 'Officer Entry',
      sourceReference: params.sourceReference,
      capturedBy: params.actor,
      capturedAt: params.capturedAt,
      evidenceReferences: params.evidenceReferences ?? [],
    }],
  };
}

export function retainReviewEvidence(
  control: DRRMReportControl,
  params: {
    recordId: string;
    actor: string;
    validatedAt: string;
    validationIssues: string[];
    reconciliation: DRRMReconciliationEvidence;
    evidenceReferences: string[];
  },
): DRRMReportControl {
  const blockingItems = params.reconciliation.items.filter(item => item.blocking && item.status !== 'Matched');
  const advisoryItems = params.reconciliation.items.filter(item => !item.blocking && item.status !== 'Matched');
  const checks: DRRMValidationEvidence['checks'] = [
    {
      id: 'STRUCTURE',
      label: 'Required fields and controlled references',
      outcome: params.validationIssues.length === 0 ? 'Passed' : 'Failed',
      message: params.validationIssues.length === 0
        ? 'Required fields, values, and event/operational-period references passed.'
        : params.validationIssues.join(' '),
    },
    {
      id: 'PROVENANCE',
      label: 'Field provenance',
      outcome: control.fieldProvenance.length > 0 ? 'Passed' : 'Failed',
      message: control.fieldProvenance.length > 0
        ? `${control.fieldProvenance.length} provenance entr${control.fieldProvenance.length === 1 ? 'y' : 'ies'} retained.`
        : 'No field provenance is retained.',
    },
    {
      id: 'RECONCILIATION',
      label: 'Report reconciliation',
      outcome: blockingItems.length > 0 ? 'Failed' : advisoryItems.length > 0 ? 'Advisory' : 'Passed',
      message: blockingItems.length > 0
        ? `${blockingItems.length} blocking reconciliation item(s) remain.`
        : advisoryItems.length > 0
          ? `${advisoryItems.length} non-blocking point-in-time variance(s) retained for review.`
          : 'All reconciliation items match.',
    },
  ];
  const hasFailure = checks.some(check => check.outcome === 'Failed');
  const hasAdvisory = checks.some(check => check.outcome === 'Advisory');
  const validation: DRRMValidationEvidence = {
    id: `${params.recordId}-VAL-${control.currentVersion}-${params.validatedAt}`,
    version: control.currentVersion,
    validatedAt: params.validatedAt,
    validatedBy: params.actor,
    outcome: hasFailure ? 'Failed' : hasAdvisory ? 'Passed with Advisory' : 'Passed',
    checks,
    evidenceReferences: params.evidenceReferences,
  };

  return {
    ...control,
    validationEvidence: [...control.validationEvidence, validation],
    reconciliationEvidence: [...control.reconciliationEvidence, params.reconciliation],
  };
}

export function getLatestValidationEvidence(control: DRRMReportControl) {
  return control.validationEvidence[control.validationEvidence.length - 1];
}

export function getLatestReconciliationEvidence(control: DRRMReportControl) {
  return control.reconciliationEvidence[control.reconciliationEvidence.length - 1];
}
