import { describe, expect, it } from 'vitest';
import { mockEvacuationRecords } from '@/data/mockDRRM';
import {
  DROMIC_AGE_BANDS,
  evaluateDROMICProfile,
  sumSexDisaggregatedCount,
} from './dromic';

describe('P0-04 DROMIC population and SADD structure', () => {
  it('uses the seven DROMIC age groups without duplicated summary fields', () => {
    expect(DROMIC_AGE_BANDS.map(({ key }) => key)).toEqual([
      'infant0To6Months',
      'toddler7MonthsTo2Years',
      'preschool3To5Years',
      'schoolAge6To12Years',
      'teenage13To17Years',
      'adult18To59Years',
      'elderly60YearsAndAbove',
    ]);

    for (const record of mockEvacuationRecords) {
      expect(record).not.toHaveProperty('males');
      expect(record).not.toHaveProperty('females');
      expect(record).not.toHaveProperty('children');
      expect(record).not.toHaveProperty('seniors');
      expect(record).not.toHaveProperty('pwdCount');
    }
  });

  it('requires every inside-EC record to have a reconciled profile', () => {
    const insideRecords = mockEvacuationRecords.filter(
      record => record.locationType === 'Inside Evacuation Center',
    );

    expect(insideRecords.length).toBeGreaterThan(0);

    for (const record of insideRecords) {
      const result = evaluateDROMICProfile(record);
      expect(record.disaggregatedPopulation).toBeDefined();
      expect(result.ageSex.total).toBe(record.displacedPersons);
      expect(result.variance).toBe(0);
      expect(result.issues).toEqual([]);
      expect(result.annexExportReady).toBe(true);
    }
  });

  it('stores non-negative whole-number sex, age, and sectoral counts', () => {
    for (const record of mockEvacuationRecords) {
      const profile = record.disaggregatedPopulation;
      if (!profile) continue;

      for (const { key } of DROMIC_AGE_BANDS) {
        const count = profile.ageSex[key];
        for (const value of [count.male, count.female, count.notReported]) {
          expect(Number.isInteger(value)).toBe(true);
          expect(value).toBeGreaterThanOrEqual(0);
        }
      }

      for (const count of [
        profile.sectoral.childHeadedFamilies,
        profile.sectoral.singleHeadedFamilies,
        profile.sectoral.soloParents,
        profile.sectoral.personsWithDisability,
        profile.sectoral.indigenousPeoples,
        profile.sectoral.fourPsBeneficiaries,
      ]) {
        expect(sumSexDisaggregatedCount(count)).toBeGreaterThanOrEqual(0);
        for (const value of [count.male, count.female, count.notReported]) {
          expect(Number.isInteger(value)).toBe(true);
          expect(value).toBeGreaterThanOrEqual(0);
        }
      }

      expect(Number.isInteger(profile.sectoral.pregnantWomen)).toBe(true);
      expect(Number.isInteger(profile.sectoral.lactatingMothers)).toBe(true);
      expect(profile.sectoral.pregnantWomen).toBeGreaterThanOrEqual(0);
      expect(profile.sectoral.lactatingMothers).toBeGreaterThanOrEqual(0);
    }
  });

  it('blocks Annex readiness when totals or sex reporting are incomplete', () => {
    const source = mockEvacuationRecords.find(
      record => record.locationType === 'Inside Evacuation Center',
    );
    expect(source?.disaggregatedPopulation).toBeDefined();

    const mismatched = structuredClone(source!);
    mismatched.displacedPersons += 1;
    const mismatchResult = evaluateDROMICProfile(mismatched);
    expect(mismatchResult.variance).toBe(1);
    expect(mismatchResult.annexExportReady).toBe(false);
    expect(mismatchResult.issues).toContain(
      'Age-and-sex total differs from displaced persons by 1.',
    );

    const unreported = structuredClone(source!);
    const infant = unreported.disaggregatedPopulation!.ageSex.infant0To6Months;
    infant.male -= 1;
    infant.notReported += 1;
    const unreportedResult = evaluateDROMICProfile(unreported);
    expect(unreportedResult.variance).toBe(0);
    expect(unreportedResult.annexExportReady).toBe(false);
    expect(unreportedResult.issues).toContain(
      '1 person(s) do not yet have a reported sex category.',
    );
  });

  it('keeps outside-EC counts separate and does not overstate Annex readiness', () => {
    const outsideRecords = mockEvacuationRecords.filter(
      record => record.locationType === 'Outside Evacuation Center',
    );

    expect(outsideRecords.length).toBeGreaterThan(0);

    for (const record of outsideRecords) {
      const result = evaluateDROMICProfile(record);
      expect(record.displacedFamilies).toBeGreaterThan(0);
      expect(record.displacedPersons).toBeGreaterThan(0);
      expect(result.annexExportReady).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    }
  });
});
