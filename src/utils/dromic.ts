import type {
  DROMICAgeSexDistribution,
  EvacuationRecord,
  SexDisaggregatedCount,
} from '@/types/drrm';

export type DROMICAgeBand = keyof DROMICAgeSexDistribution;

export const DROMIC_AGE_BANDS: {
  key: DROMICAgeBand;
  label: string;
}[] = [
  { key: 'infant0To6Months', label: 'Infant (0–6 months)' },
  { key: 'toddler7MonthsTo2Years', label: 'Toddler (7 months–2 years)' },
  { key: 'preschool3To5Years', label: 'Preschool (3–5 years)' },
  { key: 'schoolAge6To12Years', label: 'School age (6–12 years)' },
  { key: 'teenage13To17Years', label: 'Teenage (13–17 years)' },
  { key: 'adult18To59Years', label: 'Adult (18–59 years)' },
  { key: 'elderly60YearsAndAbove', label: 'Elderly (60 years and above)' },
];

export function sumSexDisaggregatedCount(count: SexDisaggregatedCount) {
  return count.male + count.female + count.notReported;
}

export function summarizeAgeSexDistribution(
  distribution: DROMICAgeSexDistribution,
) {
  return DROMIC_AGE_BANDS.reduce(
    (summary, { key }) => {
      const count = distribution[key];
      summary.male += count.male;
      summary.female += count.female;
      summary.notReported += count.notReported;
      summary.total += sumSexDisaggregatedCount(count);
      return summary;
    },
    { male: 0, female: 0, notReported: 0, total: 0 },
  );
}

export function evaluateDROMICProfile(record: EvacuationRecord) {
  const profile = record.disaggregatedPopulation;
  const issues: string[] = [];

  if (!profile) {
    return {
      ageSex: { male: 0, female: 0, notReported: 0, total: 0 },
      children: 0,
      elderly: 0,
      personsWithDisability: 0,
      variance: record.displacedPersons,
      annexExportReady: false,
      issues: ['Sex-, age-, and sectoral-disaggregated profile not captured.'],
    };
  }

  const ageSex = summarizeAgeSexDistribution(profile.ageSex);
  const children = DROMIC_AGE_BANDS.slice(0, 5).reduce(
    (total, { key }) =>
      total + sumSexDisaggregatedCount(profile.ageSex[key]),
    0,
  );
  const elderly = sumSexDisaggregatedCount(
    profile.ageSex.elderly60YearsAndAbove,
  );
  const personsWithDisability = sumSexDisaggregatedCount(
    profile.sectoral.personsWithDisability,
  );
  const variance = record.displacedPersons - ageSex.total;

  if (variance !== 0) {
    issues.push(
      `Age-and-sex total differs from displaced persons by ${Math.abs(variance)}.`,
    );
  }
  if (profile.dataQualityStatus !== 'Complete') {
    issues.push(`Data quality status is ${profile.dataQualityStatus}.`);
  }
  if (ageSex.notReported > 0) {
    issues.push(
      `${ageSex.notReported} person(s) do not yet have a reported sex category.`,
    );
  }
  if (profile.sectoral.pregnantWomen > ageSex.female) {
    issues.push('Pregnant women count exceeds the female population total.');
  }
  if (profile.sectoral.lactatingMothers > ageSex.female) {
    issues.push('Lactating mothers count exceeds the female population total.');
  }
  if (personsWithDisability > ageSex.total) {
    issues.push(
      'Persons with disability count exceeds the displaced population total.',
    );
  }

  return {
    ageSex,
    children,
    elderly,
    personsWithDisability,
    variance,
    annexExportReady:
      record.locationType === 'Inside Evacuation Center' &&
      profile.dataQualityStatus === 'Complete' &&
      variance === 0 &&
      ageSex.notReported === 0 &&
      issues.length === 0,
    issues,
  };
}
