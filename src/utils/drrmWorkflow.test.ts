import { describe, expect, it } from 'vitest';
import { mockDANARecords, mockEvacuationRecords, mockSitReps } from '@/data/mockDRRM';
import { hasPermission } from './permissions';
import {
  applyDRRMWorkflowTransition,
  getDRRMWorkflowActions,
  validateDANAForReview,
  validateDROMICForReview,
  validateSitRepForReview,
} from './drrmWorkflow';

describe('P0-05 functional DRRM workflows', () => {
  it('separates focal preparation from Punong Barangay approval', () => {
    expect(getDRRMWorkflowActions('Draft', 'drrm_focal').map(action => action.action)).toEqual([
      'submit-for-review',
    ]);
    expect(getDRRMWorkflowActions('For Review', 'punong_barangay').map(action => action.action)).toEqual([
      'approve',
      'return',
    ]);
    expect(getDRRMWorkflowActions('For Review', 'drrm_focal')).toEqual([]);
    expect(getDRRMWorkflowActions('Draft', 'system_admin')).toEqual([]);
    expect(hasPermission('punong_barangay', 'drrm.approve')).toBe(true);
    expect(hasPermission('drrm_focal', 'drrm.approve')).toBe(false);
  });

  it('enforces the approved Draft-to-review-to-approval-to-submission path', () => {
    const reviewed = applyDRRMWorkflowTransition({
      status: 'Draft',
      action: 'submit-for-review',
      roleId: 'drrm_focal',
      performedBy: 'DRRM Focal',
      validationIssues: [],
      now: '2026-07-27T10:00:00.000Z',
    });
    const approved = applyDRRMWorkflowTransition({
      status: reviewed.status,
      history: reviewed.workflowHistory,
      action: 'approve',
      roleId: 'punong_barangay',
      performedBy: 'Punong Barangay',
      now: '2026-07-27T10:05:00.000Z',
    });
    const submitted = applyDRRMWorkflowTransition({
      status: approved.status,
      history: approved.workflowHistory,
      action: 'submit',
      roleId: 'drrm_focal',
      performedBy: 'DRRM Focal',
      now: '2026-07-27T10:10:00.000Z',
    });

    expect(submitted.status).toBe('Submitted');
    expect(submitted.workflowHistory.map(entry => entry.toStatus)).toEqual([
      'For Review',
      'Approved',
      'Submitted',
    ]);
  });

  it('blocks direct jumps and records a mandatory return reason', () => {
    expect(() =>
      applyDRRMWorkflowTransition({
        status: 'Draft',
        action: 'approve',
        roleId: 'punong_barangay',
        performedBy: 'Punong Barangay',
      }),
    ).toThrow('not allowed');

    expect(() =>
      applyDRRMWorkflowTransition({
        status: 'For Review',
        action: 'return',
        roleId: 'punong_barangay',
        performedBy: 'Punong Barangay',
      }),
    ).toThrow('return reason');

    const returned = applyDRRMWorkflowTransition({
      status: 'For Review',
      action: 'return',
      roleId: 'punong_barangay',
      performedBy: 'Punong Barangay',
      remarks: 'Reconcile the affected-person total.',
      now: '2026-07-27T10:15:00.000Z',
    });
    expect(returned.status).toBe('Returned');
    expect(returned.workflowHistory[0].remarks).toBe('Reconcile the affected-person total.');
  });

  it('blocks review when validation issues remain', () => {
    expect(() =>
      applyDRRMWorkflowTransition({
        status: 'Draft',
        action: 'submit-for-review',
        roleId: 'drrm_focal',
        performedBy: 'DRRM Focal',
        validationIssues: ['Affected area is required.'],
      }),
    ).toThrow('Resolve all validation issues');
  });

  it('validates SitRep, DANA, and DROMIC report structures', () => {
    const sitRep = mockSitReps.find(record => record.status === 'Draft');
    const dana = mockDANARecords.find(record => record.status === 'Draft');
    const dromic = mockEvacuationRecords.find(
      record =>
        record.reportStatus === 'Draft' &&
        record.locationType === 'Outside Evacuation Center',
    );

    expect(sitRep).toBeDefined();
    expect(dana).toBeDefined();
    expect(dromic).toBeDefined();
    expect(validateSitRepForReview(sitRep!)).toEqual([]);
    expect(validateDANAForReview(dana!)).toEqual([]);
    expect(validateDROMICForReview(dromic!)).toEqual([]);

    const invalidSitRep = { ...sitRep!, affectedAreas: [], affectedPersons: -1 };
    expect(validateSitRepForReview(invalidSitRep)).toEqual(
      expect.arrayContaining([
        'At least one affected area is required.',
        'Affected persons must be a non-negative whole number.',
      ]),
    );
  });
});
