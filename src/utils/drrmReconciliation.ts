import type {
  DANARecord,
  DisasterEvent,
  DRRMReconciliationEvidence,
  DRRMReconciliationItem,
  EvacuationRecord,
  SitRep,
} from '@/types/drrm';
import { evaluateDROMICProfile } from './dromic';

function item(params: Omit<DRRMReconciliationItem, 'status'>): DRRMReconciliationItem {
  const complete = params.reportedValue !== undefined && params.referenceValue !== undefined;
  return {
    ...params,
    status: !complete
      ? 'Incomplete'
      : params.reportedValue === params.referenceValue
        ? 'Matched'
        : 'Variance',
  };
}

function evidence(
  recordId: string,
  version: number,
  actor: string,
  reconciledAt: string,
  items: DRRMReconciliationItem[],
): DRRMReconciliationEvidence {
  const status = items.some(entry => entry.status === 'Incomplete')
    ? 'Incomplete'
    : items.some(entry => entry.status === 'Variance')
      ? 'Variance'
      : 'Matched';
  return {
    id: `${recordId}-REC-${version}-${reconciledAt}`,
    version,
    reconciledAt,
    reconciledBy: actor,
    status,
    items,
  };
}

export function reconcileSitRep(
  record: SitRep,
  event: DisasterEvent | undefined,
  actor: string,
  reconciledAt: string,
): DRRMReconciliationEvidence {
  const accountability = record.casualties + record.injuries + record.missingPersons;
  return evidence(record.id, record.version, actor, reconciledAt, [
    item({
      id: 'SITREP-AFFECTED-FAMILIES',
      label: 'Affected families vs event snapshot',
      reportedValue: record.affectedFamilies,
      referenceValue: event?.population.affected.families,
      blocking: false,
      sourceReference: event ? `${event.eventCode} population snapshot as of ${event.population.asOf}` : record.eventId,
      explanation: 'A point-in-time variance is advisory because reporting cutoffs may differ.',
    }),
    item({
      id: 'SITREP-AFFECTED-PERSONS',
      label: 'Affected persons vs event snapshot',
      reportedValue: record.affectedPersons,
      referenceValue: event?.population.affected.persons,
      blocking: false,
      sourceReference: event ? `${event.eventCode} population snapshot as of ${event.population.asOf}` : record.eventId,
      explanation: 'A point-in-time variance is advisory because reporting cutoffs may differ.',
    }),
    item({
      id: 'SITREP-ACCOUNTABILITY',
      label: 'Casualties, injuries, and missing persons within affected persons',
      reportedValue: Math.min(accountability, record.affectedPersons),
      referenceValue: accountability,
      blocking: true,
      sourceReference: record.sitRepNo,
      explanation: 'Accountability figures cannot exceed the affected-person total.',
    }),
  ]);
}

export function reconcileDANA(
  record: DANARecord,
  actor: string,
  reconciledAt: string,
): DRRMReconciliationEvidence {
  const evidencePresent = record.estimatedDamage === 0 || Boolean(record.evidenceNotes?.trim());
  const peoplePlausible = record.affectedHouseholds === 0 || record.affectedPersons >= record.affectedHouseholds;
  return evidence(record.id, record.version, actor, reconciledAt, [
    item({
      id: 'DANA-HOUSEHOLD-PERSON',
      label: 'Affected households supported by affected-person count',
      reportedValue: peoplePlausible ? 1 : 0,
      referenceValue: 1,
      blocking: true,
      sourceReference: record.danaNo,
      explanation: 'A household count greater than zero requires at least as many affected persons.',
    }),
    item({
      id: 'DANA-DAMAGE-EVIDENCE',
      label: 'Damage estimate supported by evidence reference',
      reportedValue: evidencePresent ? 1 : 0,
      referenceValue: 1,
      blocking: true,
      sourceReference: record.evidenceNotes?.trim() || 'No evidence reference recorded',
      explanation: 'A non-zero damage estimate requires evidence notes or a source reference.',
    }),
  ]);
}

export function reconcileDROMIC(
  record: EvacuationRecord,
  actor: string,
  reconciledAt: string,
): DRRMReconciliationEvidence {
  const profile = evaluateDROMICProfile(record);
  const episodePersons = record.householdEpisodes.reduce((sum, episode) => sum + episode.persons, 0);
  const profileTotal = record.disaggregatedPopulation ? profile.ageSex.total : undefined;
  return evidence(record.id, record.version, actor, reconciledAt, [
    item({
      id: 'DROMIC-SADD-TOTAL',
      label: 'SADD person total vs displaced persons',
      reportedValue: profileTotal,
      referenceValue: record.locationType === 'Inside Evacuation Center'
        ? record.displacedPersons
        : profileTotal,
      blocking: record.locationType === 'Inside Evacuation Center',
      sourceReference: record.disaggregatedPopulation?.source ?? 'No SADD profile captured',
      explanation: record.locationType === 'Inside Evacuation Center'
        ? 'Inside-EC SADD totals must reconcile with the reported displaced-person total.'
        : 'Outside-EC SADD is optional until captured through a controlled household process.',
    }),
    item({
      id: 'DROMIC-EPISODE-UPPER-BOUND',
      label: 'Household episode persons within displaced persons',
      reportedValue: Math.min(episodePersons, record.displacedPersons),
      referenceValue: episodePersons,
      blocking: true,
      sourceReference: `${record.householdEpisodes.length} linked household displacement episode(s)`,
      explanation: 'Linked household episode persons cannot exceed the report total; partial episode coverage is retained as an advisory gap.',
    }),
    item({
      id: 'DROMIC-EPISODE-COVERAGE',
      label: 'Household episode coverage vs displaced persons',
      reportedValue: episodePersons,
      referenceValue: record.displacedPersons,
      blocking: false,
      sourceReference: `${record.householdEpisodes.length} linked household displacement episode(s)`,
      explanation: 'A variance records incomplete household episode coverage without inventing person records.',
    }),
  ]);
}

export function getBlockingReconciliationIssues(
  reconciliation: DRRMReconciliationEvidence,
): string[] {
  return reconciliation.items
    .filter(entry => entry.blocking && entry.status !== 'Matched')
    .map(entry => `${entry.label}: ${entry.explanation}`);
}
