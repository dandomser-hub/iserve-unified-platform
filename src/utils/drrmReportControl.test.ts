import { describe, expect, it } from 'vitest';
import {
  getDisasterEvent,
  mockDANARecords,
  mockEvacuationRecords,
  mockSitReps,
} from '@/data/mockDRRM';
import {
  createInitialReportControl,
  recordReportRevision,
  retainReviewEvidence,
} from './drrmReportControl';
import {
  getBlockingReconciliationIssues,
  reconcileDANA,
  reconcileDROMIC,
  reconcileSitRep,
} from './drrmReconciliation';

describe('P0-06 report versioning, provenance, validation evidence, and reconciliation', () => {
  it('keeps every DRRM report version aligned with a retained provenance trail', () => {
    for (const record of [...mockSitReps, ...mockDANARecords, ...mockEvacuationRecords]) {
      expect(record.reportControl.currentVersion).toBe(record.version);
      expect(record.reportControl.versions[record.reportControl.versions.length - 1]?.version).toBe(record.version);
      expect(record.reportControl.fieldProvenance.length).toBeGreaterThan(0);
      expect(record.reportControl.fieldProvenance[record.reportControl.fieldProvenance.length - 1]?.capturedBy).toBeTruthy();
      expect(record.reportControl.fieldProvenance[record.reportControl.fieldProvenance.length - 1]?.capturedAt).toBeTruthy();
    }
  });

  it('creates an immutable superseding version for a returned correction', () => {
    const initial = createInitialReportControl({
      recordId: 'SR-TEST',
      actor: 'DRRM Focal',
      capturedAt: '2026-07-27T10:00:00.000Z',
      sourceReference: 'Initial field report',
      fieldPaths: ['affectedPersons'],
    });
    const revised = recordReportRevision(initial, {
      recordId: 'SR-TEST',
      actor: 'DRRM Focal',
      capturedAt: '2026-07-27T11:00:00.000Z',
      changedFields: ['affectedPersons'],
      sourceReference: 'Corrected household tally',
      evidenceReferences: ['Registration sheet 03'],
      returnedCorrection: true,
      snapshot: { affectedPersons: 20 },
    });

    expect(initial.currentVersion).toBe(1);
    expect(initial.versions).toHaveLength(1);
    expect(revised.currentVersion).toBe(2);
    expect(revised.versions[1]).toMatchObject({
      version: 2,
      supersedesVersion: 1,
      reason: 'Returned Correction',
    });
    expect(
      revised.fieldProvenance[revised.fieldProvenance.length - 1]?.evidenceReferences,
    ).toEqual(['Registration sheet 03']);
    expect(revised.versions[0].snapshot).not.toEqual(revised.versions[1].snapshot);
    expect(revised.versions[1].snapshot).toEqual({ affectedPersons: 20 });
  });

  it('retains version-scoped validation and reconciliation evidence', () => {
    const sitRep = mockSitReps.find(record => record.status === 'Draft')!;
    const reconciliation = reconcileSitRep(
      sitRep,
      getDisasterEvent(sitRep.eventId),
      'DRRM Focal',
      '2026-07-27T12:00:00.000Z',
    );
    const updated = retainReviewEvidence(sitRep.reportControl, {
      recordId: sitRep.id,
      actor: 'DRRM Focal',
      validatedAt: '2026-07-27T12:00:00.000Z',
      validationIssues: [],
      reconciliation,
      evidenceReferences: ['EVT-2024-EMONG', 'OP003'],
    });

    expect(updated.validationEvidence).toHaveLength(1);
    expect(updated.validationEvidence[0]).toMatchObject({
      version: sitRep.version,
      outcome: 'Passed with Advisory',
      validatedBy: 'DRRM Focal',
    });
    expect(updated.reconciliationEvidence[0].version).toBe(sitRep.version);
    expect(getBlockingReconciliationIssues(reconciliation)).toEqual([]);
  });

  it('separates advisory point-in-time variances from blocking SitRep defects', () => {
    const sitRep = mockSitReps.find(record => record.status === 'Draft')!;
    const advisory = reconcileSitRep(
      sitRep,
      getDisasterEvent(sitRep.eventId),
      'Reviewer',
      '2026-07-27T12:05:00.000Z',
    );
    expect(advisory.items.some(item => !item.blocking && item.status === 'Variance')).toBe(true);
    expect(getBlockingReconciliationIssues(advisory)).toEqual([]);

    const impossible = reconcileSitRep(
      { ...sitRep, affectedPersons: 1, injuries: 2 },
      getDisasterEvent(sitRep.eventId),
      'Reviewer',
      '2026-07-27T12:06:00.000Z',
    );
    expect(getBlockingReconciliationIssues(impossible)).toEqual(
      expect.arrayContaining([expect.stringContaining('Accountability')]),
    );
  });

  it('blocks unsupported DANA estimates and internally inconsistent DROMIC totals', () => {
    const dana = mockDANARecords.find(record => record.id === 'DANA004')!;
    const danaEvidence = reconcileDANA(dana, 'Reviewer', '2026-07-27T12:10:00.000Z');
    expect(getBlockingReconciliationIssues(danaEvidence)).toEqual(
      expect.arrayContaining([expect.stringContaining('Damage estimate')]),
    );

    const center = mockEvacuationRecords.find(record => record.id === 'EV001')!;
    const mismatched = reconcileDROMIC(
      { ...center, displacedPersons: center.displacedPersons + 1 },
      'Reviewer',
      '2026-07-27T12:11:00.000Z',
    );
    expect(getBlockingReconciliationIssues(mismatched)).toEqual(
      expect.arrayContaining([expect.stringContaining('SADD person total')]),
    );
  });
});
