import type { RoleId } from '@/types/auth';
import type {
  DANARecord,
  DRRMReportStatus,
  DRRMWorkflowAction,
  DRRMWorkflowHistoryEntry,
  EvacuationRecord,
  SitRep,
} from '@/types/drrm';
import { getDisasterEvent, getOperationalPeriod } from '@/data/mockDRRM';
import { evaluateDROMICProfile } from './dromic';

export interface DRRMWorkflowTransition {
  action: DRRMWorkflowAction;
  label: string;
  from: DRRMReportStatus;
  to: DRRMReportStatus;
  roles: readonly RoleId[];
  requiresRemarks?: boolean;
}

export interface DRRMWorkflowResult {
  status: DRRMReportStatus;
  workflowHistory: DRRMWorkflowHistoryEntry[];
}

export const DRRM_WORKFLOW_TRANSITIONS: readonly DRRMWorkflowTransition[] = [
  {
    action: 'submit-for-review',
    label: 'Validate & Send for Review',
    from: 'Draft',
    to: 'For Review',
    roles: ['drrm_focal'],
  },
  {
    action: 'submit-for-review',
    label: 'Validate & Resubmit',
    from: 'Returned',
    to: 'For Review',
    roles: ['drrm_focal'],
  },
  {
    action: 'approve',
    label: 'Approve Report',
    from: 'For Review',
    to: 'Approved',
    roles: ['punong_barangay'],
  },
  {
    action: 'return',
    label: 'Return for Revision',
    from: 'For Review',
    to: 'Returned',
    roles: ['punong_barangay'],
    requiresRemarks: true,
  },
  {
    action: 'submit',
    label: 'Submit Approved Report',
    from: 'Approved',
    to: 'Submitted',
    roles: ['drrm_focal', 'punong_barangay'],
  },
] as const;

export function getDRRMWorkflowActions(
  status: DRRMReportStatus,
  roleId: RoleId | null,
): DRRMWorkflowTransition[] {
  if (!roleId) return [];
  return DRRM_WORKFLOW_TRANSITIONS.filter(
    transition => transition.from === status && transition.roles.includes(roleId),
  );
}

export function applyDRRMWorkflowTransition(params: {
  status: DRRMReportStatus;
  history?: DRRMWorkflowHistoryEntry[];
  action: DRRMWorkflowAction;
  roleId: RoleId | null;
  performedBy: string;
  remarks?: string;
  validationIssues?: string[];
  now?: string;
}): DRRMWorkflowResult {
  const transition = getDRRMWorkflowActions(params.status, params.roleId).find(
    candidate => candidate.action === params.action,
  );

  if (!transition) {
    throw new Error('This workflow action is not allowed for the current role and status.');
  }

  if (
    transition.action === 'submit-for-review' &&
    (params.validationIssues?.length ?? 0) > 0
  ) {
    throw new Error('Resolve all validation issues before sending this record for review.');
  }

  const remarks = params.remarks?.trim();
  if (transition.requiresRemarks && !remarks) {
    throw new Error('A return reason is required.');
  }

  const performedAt = params.now ?? new Date().toISOString();
  const entry: DRRMWorkflowHistoryEntry = {
    id: `DRRMWF-${performedAt}-${params.action}`,
    action: params.action,
    actionLabel: transition.label,
    fromStatus: transition.from,
    toStatus: transition.to,
    performedBy: params.performedBy,
    performedAt,
    remarks,
  };

  return {
    status: transition.to,
    workflowHistory: [...(params.history ?? []), entry],
  };
}

function validateOperationalContext(eventId: string, operationalPeriodId: string): string[] {
  const issues: string[] = [];
  const event = getDisasterEvent(eventId);
  const period = getOperationalPeriod(operationalPeriodId);

  if (!event) issues.push('Select a valid disaster event.');
  if (!period) issues.push('Select a valid operational period.');
  if (event && period && period.eventId !== event.id) {
    issues.push('The operational period does not belong to the selected disaster event.');
  }

  return issues;
}

export function validateSitRepForReview(record: SitRep): string[] {
  const issues = validateOperationalContext(record.eventId, record.operationalPeriodId);
  if (!record.sitRepNo.trim()) issues.push('SitRep number is required.');
  if (record.affectedAreas.length === 0) issues.push('At least one affected area is required.');
  if (!record.preparedBy.trim()) issues.push('Prepared-by information is required.');
  for (const [label, value] of [
    ['Casualties', record.casualties],
    ['Injuries', record.injuries],
    ['Missing persons', record.missingPersons],
    ['Affected families', record.affectedFamilies],
    ['Affected persons', record.affectedPersons],
  ] as const) {
    if (!Number.isInteger(value) || value < 0) issues.push(`${label} must be a non-negative whole number.`);
  }
  return issues;
}

export function validateDANAForReview(record: DANARecord): string[] {
  const issues = validateOperationalContext(record.eventId, record.operationalPeriodId);
  if (!record.danaNo.trim()) issues.push('DANA number is required.');
  if (!record.assessmentDate) issues.push('Assessment date is required.');
  if (!record.sector.trim()) issues.push('Assessment sector is required.');
  if (!record.damageDescription.trim()) issues.push('Damage description is required.');
  if (!record.assessedBy.trim()) issues.push('Assessor information is required.');
  if (!Number.isInteger(record.affectedHouseholds) || record.affectedHouseholds < 0) {
    issues.push('Affected households must be a non-negative whole number.');
  }
  if (!Number.isInteger(record.affectedPersons) || record.affectedPersons < 0) {
    issues.push('Affected persons must be a non-negative whole number.');
  }
  if (!Number.isFinite(record.estimatedDamage) || record.estimatedDamage < 0) {
    issues.push('Estimated damage must be zero or greater.');
  }
  return issues;
}

export function validateDROMICForReview(record: EvacuationRecord): string[] {
  const issues = validateOperationalContext(record.eventId, record.operationalPeriodId);
  if (!record.evacuationCenterName.trim()) issues.push('Location or evacuation center is required.');
  if (!record.reportingDate) issues.push('Reporting date is required.');
  if (!record.managedBy.trim()) issues.push('Responsible officer is required.');
  if (!Number.isInteger(record.displacedFamilies) || record.displacedFamilies < 0) {
    issues.push('Displaced families must be a non-negative whole number.');
  }
  if (!Number.isInteger(record.displacedPersons) || record.displacedPersons < 0) {
    issues.push('Displaced persons must be a non-negative whole number.');
  }

  if (record.locationType === 'Inside Evacuation Center') {
    issues.push(...evaluateDROMICProfile(record).issues);
  }

  return issues;
}
