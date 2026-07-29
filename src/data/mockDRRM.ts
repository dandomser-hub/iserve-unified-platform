import type {
  EarlyWarning,
  SitRep,
  DANARecord,
  EvacuationRecord,
  HazardRisk,
  DRRMResource,
  ReliefDistribution,
  BDRRMCAction,
  DisasterEvent,
  OperationalPeriod,
  DRRMOperationalContext,
  DRRMRecordLink,
  DRRMRecordReference,
  DRRMRecordType,
} from "@/types/drrm";
import { createInitialReportControl } from "@/utils/drrmReportControl";

export const mockDisasterEvents: DisasterEvent[] = [
  {
    id: "DE001",
    eventCode: "EVT-2024-EMONG",
    name: "Typhoon Emong",
    eventType: "Typhoon",
    status: "De-escalating",
    onsetAt: "2024-06-10T06:00:00",
    affectedAreas: ["Purok 1 - Riverside", "Purok 3 - Seaside"],
    leadOfficer: "DRRM Focal Mangubat",
    population: {
      affected: { families: 50, persons: 200 },
      currentDisplaced: {
        insideEvacuationCenters: { families: 10, persons: 40 },
        outsideEvacuationCenters: { families: 2, persons: 8 },
      },
      cumulativeDisplaced: {
        insideEvacuationCenters: { families: 45, persons: 180 },
        outsideEvacuationCenters: { families: 5, persons: 20 },
      },
      asOf: "2024-06-12T06:00:00",
    },
  },
  {
    id: "DE002",
    eventCode: "EVT-2024-TOWN-FIRE",
    name: "Town Center Fire Incident",
    eventType: "Fire",
    status: "Archived",
    onsetAt: "2024-04-05T13:30:00",
    closedAt: "2024-04-10T09:00:00",
    affectedAreas: ["Purok 5 - Town Center"],
    leadOfficer: "DRRM Focal Mangubat",
    population: {
      affected: { families: 5, persons: 22 },
      currentDisplaced: {
        insideEvacuationCenters: { families: 0, persons: 0 },
        outsideEvacuationCenters: { families: 0, persons: 0 },
      },
      cumulativeDisplaced: {
        insideEvacuationCenters: { families: 0, persons: 0 },
        outsideEvacuationCenters: { families: 5, persons: 22 },
      },
      asOf: "2024-04-10T09:00:00",
    },
  },
];

export const mockOperationalPeriods: OperationalPeriod[] = [
  {
    id: "OP001",
    eventId: "DE001",
    periodNo: 1,
    startsAt: "2024-06-10T06:00:00",
    endsAt: "2024-06-11T06:00:00",
    reportingCutoff: "2024-06-11T06:00:00",
    eocActivationLevel: "Full Activation",
    eocLocation: "Barangay Hall EOC",
    incidentCommander: "Hon. Reyes (Punong Barangay)",
    objectives: [
      "Protect life",
      "Complete priority evacuation",
      "Maintain lifeline coordination",
    ],
    status: "Completed",
    handoverNotes: "Continue evacuation support and damage monitoring.",
  },
  {
    id: "OP002",
    eventId: "DE001",
    periodNo: 2,
    startsAt: "2024-06-11T06:00:00",
    endsAt: "2024-06-12T06:00:00",
    reportingCutoff: "2024-06-12T06:00:00",
    eocActivationLevel: "Partial Activation",
    eocLocation: "Barangay Hall EOC",
    incidentCommander: "Hon. Reyes (Punong Barangay)",
    objectives: [
      "Support safe return",
      "Restore lifelines",
      "Begin validated damage assessment",
    ],
    status: "Completed",
    handoverNotes: "Shift to recovery monitoring and final reporting.",
  },
  {
    id: "OP003",
    eventId: "DE001",
    periodNo: 3,
    startsAt: "2024-06-12T06:00:00",
    endsAt: "2024-06-13T06:00:00",
    reportingCutoff: "2024-06-13T06:00:00",
    eocActivationLevel: "Monitoring",
    eocLocation: "Barangay Hall EOC",
    incidentCommander: "DRRM Focal Mangubat",
    objectives: [
      "Complete final SitRep",
      "Validate DANA observations",
      "Reconcile relief records",
    ],
    status: "Active",
  },
  {
    id: "OP004",
    eventId: "DE002",
    periodNo: 1,
    startsAt: "2024-04-05T13:30:00",
    endsAt: "2024-04-06T08:00:00",
    reportingCutoff: "2024-04-06T08:00:00",
    eocActivationLevel: "Partial Activation",
    eocLocation: "Barangay Hall",
    incidentCommander: "Hon. Reyes (Punong Barangay)",
    objectives: [
      "Support BFP response",
      "Account for residents",
      "Arrange temporary shelter",
    ],
    status: "Closed",
    handoverNotes: "Transferred to recovery and assistance coordination.",
  },
];

const context = {
  emong1: { eventId: "DE001", operationalPeriodId: "OP001" },
  emong2: { eventId: "DE001", operationalPeriodId: "OP002" },
  emong3: { eventId: "DE001", operationalPeriodId: "OP003" },
  fire1: { eventId: "DE002", operationalPeriodId: "OP004" },
} as const;

function sitRepControl(
  id: string,
  version: number,
  actor: string,
  capturedAt: string,
) {
  return createInitialReportControl({
    recordId: id,
    version,
    actor,
    capturedAt,
    sourceReference: "Barangay EOC SitRep encoding",
    sourceType: "Officer Entry",
    fieldPaths: [
      "affectedAreas",
      "casualties",
      "injuries",
      "missingPersons",
      "affectedFamilies",
      "affectedPersons",
      "lifelinesStatus",
      "immediateNeeds",
      "actionsTaken",
    ],
    evidenceReferences: ["Controlled event and operational-period records"],
  });
}

function danaControl(id: string, actor: string, capturedAt: string, evidenceReference?: string) {
  return createInitialReportControl({
    recordId: id,
    actor,
    capturedAt,
    sourceReference: evidenceReference ?? "Field DANA assessment",
    sourceType: "Field Observation",
    fieldPaths: [
      "assessmentDate",
      "sector",
      "affectedHouseholds",
      "affectedPersons",
      "damageDescription",
      "estimatedDamage",
      "immediateNeeds",
    ],
    evidenceReferences: evidenceReference ? [evidenceReference] : [],
  });
}

function dromicControl(
  id: string,
  actor: string,
  capturedAt: string,
  sourceReference: string,
) {
  return createInitialReportControl({
    recordId: id,
    actor,
    capturedAt,
    sourceReference,
    sourceType: "Evacuation Center Registration",
    fieldPaths: [
      "displacedFamilies",
      "displacedPersons",
      "disaggregatedPopulation",
      "householdEpisodes",
      "originPuroks",
      "needs",
    ],
    evidenceReferences: ["Household displacement episode registry"],
  });
}

export const disasterEventById = new Map(
  mockDisasterEvents.map((event) => [event.id, event]),
);
export const operationalPeriodById = new Map(
  mockOperationalPeriods.map((period) => [period.id, period]),
);

export function getDisasterEvent(eventId: string) {
  return disasterEventById.get(eventId);
}

export function getOperationalPeriod(operationalPeriodId: string) {
  return operationalPeriodById.get(operationalPeriodId);
}

export function getOperationalPeriodLabel(operationalPeriodId: string) {
  const period = getOperationalPeriod(operationalPeriodId);
  if (!period) return "Unknown operational period";
  return `${period.startsAt} to ${period.endsAt}`;
}

export const mockEarlyWarnings: EarlyWarning[] = [
  {
    ...context.emong1,
    id: "EW001",
    alertType: "Typhoon",
    severity: "High",
    affectedAreas: ["Purok 1 - Riverside", "Purok 3 - Seaside"],
    message:
      "Typhoon Emong expected to make landfall within 24 hours. Signal No. 2 in effect. Residents in low-lying and coastal areas to prepare for possible evacuation.",
    source: "PAGASA - Regional",
    issuedAt: "2024-06-10T06:00:00",
    actionsAdvised: [
      "Secure loose objects",
      "Prepare go-bags",
      "Identify evacuation routes",
      "Monitor PAGASA updates",
    ],
    issuedBy: "DRRM Focal Mangubat",
    status: "Active",
  },
  {
    ...context.emong1,
    id: "EW002",
    alertType: "Flooding",
    severity: "Moderate",
    affectedAreas: ["Purok 1 - Riverside"],
    message:
      "Water levels in Riverside Creek rising due to upstream rainfall. Low-lying areas in Purok 1 advised to be on alert.",
    source: "DRRM Office Observation",
    issuedAt: "2024-06-10T08:00:00",
    actionsAdvised: [
      "Move valuables to higher ground",
      "Stay away from creek banks",
    ],
    issuedBy: "DRRM Focal Mangubat",
    status: "Active",
  },
  {
    ...context.emong1,
    id: "EW003",
    alertType: "Landslide",
    severity: "Moderate",
    affectedAreas: ["Purok 2 - Mountainview"],
    message:
      "Sustained heavy rainfall has saturated slopes in the Mountainview area. Residents near steep slopes advised to be vigilant and ready for evacuation.",
    source: "MGB Geohazard Advisory",
    issuedAt: "2024-06-10T09:00:00",
    actionsAdvised: [
      "Monitor slope conditions",
      "Prepare for immediate evacuation if cracking sounds heard",
      "Identify safe routes",
    ],
    issuedBy: "DRRM Focal Mangubat",
    status: "Active",
  },
  {
    ...context.emong2,
    id: "EW004",
    alertType: "Typhoon",
    severity: "Low",
    affectedAreas: ["All Puroks"],
    message:
      "Typhoon Emong downgraded. Signal No. 1 advisory lifted. Residents may return to normal activities but remain vigilant for flooding.",
    source: "PAGASA - Regional",
    issuedAt: "2024-06-11T18:00:00",
    actionsAdvised: [
      "Clean surroundings",
      "Check for damage",
      "Report injured persons to barangay",
    ],
    issuedBy: "DRRM Focal Mangubat",
    status: "Lifted",
  },
  {
    ...context.fire1,
    id: "EW005",
    alertType: "Fire",
    severity: "Critical",
    affectedAreas: ["Purok 5 - Town Center"],
    message:
      "Fire incident at Town Center market area. BFP and residents actively controlling. Residents urged to keep clear of area.",
    source: "BFP Response",
    issuedAt: "2024-04-05T13:30:00",
    actionsAdvised: [
      "Evacuate immediate area",
      "Assist BFP in crowd control",
      "Account for all residents in affected zone",
    ],
    issuedBy: "DRRM Focal Mangubat",
    status: "Lifted",
  },
];

export const mockSitReps: SitRep[] = [
  {
    ...context.emong1,
    id: "SR001",
    sitRepNo: "SITREP-2024-001",
    affectedAreas: ["Purok 1 - Riverside", "Purok 3 - Seaside"],
    casualties: 0,
    injuries: 2,
    missingPersons: 0,
    affectedFamilies: 45,
    affectedPersons: 180,
    lifelinesStatus: [
      { lifeline: "Electricity", status: "Intermittent - restoration ongoing" },
      { lifeline: "Water Supply", status: "Operational" },
      {
        lifeline: "Roads",
        status: "Passable with caution - debris clearing underway",
      },
      { lifeline: "Communications", status: "Operational" },
    ],
    immediateNeeds: [
      "Food packs",
      "Water containers",
      "Sleeping mats",
      "First aid supplies",
    ],
    actionsTaken: [
      "Evacuation center opened at Barangay Elementary School",
      "45 families evacuated",
      "Coordination with MDRRMO completed",
      "Relief packs distributed to 30 families",
    ],
    preparedBy: "DRRM Focal Mangubat",
    submittedBy: "Hon. Reyes (Punong Barangay)",
    version: 2,
    reportControl: sitRepControl("SR001", 2, "DRRM Focal Mangubat", "2024-06-11T07:00:00"),
    status: "Submitted",
    createdAt: "2024-06-10T08:00:00",
    updatedAt: "2024-06-11T07:00:00",
  },
  {
    ...context.emong2,
    id: "SR002",
    sitRepNo: "SITREP-2024-002",
    affectedAreas: ["Purok 1 - Riverside", "Purok 3 - Seaside"],
    casualties: 0,
    injuries: 2,
    missingPersons: 0,
    affectedFamilies: 45,
    affectedPersons: 180,
    lifelinesStatus: [
      { lifeline: "Electricity", status: "Restored in most areas" },
      { lifeline: "Water Supply", status: "Operational" },
      { lifeline: "Roads", status: "Fully passable" },
      { lifeline: "Communications", status: "Operational" },
    ],
    immediateNeeds: ["Continued food support for 10 remaining families"],
    actionsTaken: [
      "35 families returned home",
      "10 families still at evacuation center",
      "Clean-up drive initiated",
      "Injuries treated at RHU",
    ],
    preparedBy: "DRRM Focal Mangubat",
    version: 1,
    reportControl: sitRepControl("SR002", 1, "DRRM Focal Mangubat", "2024-06-11T08:00:00"),
    status: "Approved",
    createdAt: "2024-06-11T08:00:00",
    updatedAt: "2024-06-11T15:00:00",
  },
  {
    ...context.fire1,
    id: "SR003",
    sitRepNo: "SITREP-2024-003",
    affectedAreas: ["Purok 5 - Town Center"],
    casualties: 0,
    injuries: 1,
    missingPersons: 0,
    affectedFamilies: 5,
    affectedPersons: 22,
    lifelinesStatus: [
      { lifeline: "Electricity", status: "Restored after temporary shutdown" },
      { lifeline: "Water Supply", status: "Operational" },
      {
        lifeline: "Roads",
        status: "Market area temporarily closed for investigation",
      },
    ],
    immediateNeeds: ["Temporary shelter for 5 families", "Food packs"],
    actionsTaken: [
      "BFP controlled fire within 2 hours",
      "Injured resident treated at hospital",
      "5 families temporarily hosted at neighbors",
      "Incident investigation underway with BFP",
    ],
    preparedBy: "DRRM Focal Mangubat",
    submittedBy: "Hon. Reyes",
    version: 1,
    reportControl: sitRepControl("SR003", 1, "DRRM Focal Mangubat", "2024-04-05T20:00:00"),
    status: "Archived",
    createdAt: "2024-04-05T20:00:00",
    updatedAt: "2024-04-10T09:00:00",
  },
  {
    ...context.emong3,
    id: "SR004",
    sitRepNo: "SITREP-2024-004",
    affectedAreas: ["Purok 1 - Riverside", "Purok 3 - Seaside"],
    casualties: 0,
    injuries: 2,
    missingPersons: 0,
    affectedFamilies: 45,
    affectedPersons: 180,
    lifelinesStatus: [
      { lifeline: "Electricity", status: "Fully restored" },
      { lifeline: "Water Supply", status: "Operational" },
      { lifeline: "Roads", status: "Fully passable" },
    ],
    immediateNeeds: [],
    actionsTaken: [
      "All evacuated families returned home",
      "Evacuation center closed",
      "Clean-up completed",
      "DANA assessment ongoing",
    ],
    preparedBy: "DRRM Focal Mangubat",
    version: 1,
    reportControl: sitRepControl("SR004", 1, "DRRM Focal Mangubat", "2024-06-13T08:00:00"),
    status: "Draft",
    createdAt: "2024-06-13T08:00:00",
    updatedAt: "2024-06-13T08:00:00",
  },
];

export const mockDANARecords: DANARecord[] = [
  {
    ...context.emong2,
    id: "DANA001",
    danaNo: "DANA-2024-001",
    assessmentDate: "2024-06-12",
    sector: "Housing",
    affectedHouseholds: 45,
    affectedPersons: 180,
    damageDescription:
      "Roof damage to 12 units; partial wall damage to 5 units; flooding damage to ground-floor belongings in 20 units.",
    estimatedDamage: 285000,
    immediateNeeds: [
      "Roofing materials",
      "Waterproofing sheets",
      "Structural repair assistance",
    ],
    validationStatus: "Validated",
    assessedBy: "DRRM Focal Mangubat",
    evidenceNotes: "Photos taken and filed. MDRRMO team co-assessed.",
    version: 1,
    reportControl: danaControl(
      "DANA001",
      "DRRM Focal Mangubat",
      "2024-06-12T09:00:00",
      "Photos filed; MDRRMO co-assessment",
    ),
    status: "Submitted",
    createdAt: "2024-06-12T09:00:00",
  },
  {
    ...context.emong2,
    id: "DANA002",
    danaNo: "DANA-2024-002",
    assessmentDate: "2024-06-12",
    sector: "Agriculture",
    affectedHouseholds: 15,
    affectedPersons: 60,
    damageDescription:
      "Standing crops (palay) damaged in Riverside and Grassland areas. Estimated loss of 3 hectares of near-harvest crops.",
    estimatedDamage: 180000,
    immediateNeeds: ["Seeds for replanting", "Agricultural assistance"],
    validationStatus: "Validated",
    assessedBy: "DRRM Focal Mangubat",
    evidenceNotes: "Agriculture damage assessment worksheet and field photos on file.",
    version: 1,
    reportControl: danaControl(
      "DANA002",
      "DRRM Focal Mangubat",
      "2024-06-12T10:00:00",
      "Agriculture damage assessment worksheet and field photos",
    ),
    status: "Approved",
    createdAt: "2024-06-12T10:00:00",
  },
  {
    ...context.fire1,
    id: "DANA003",
    danaNo: "DANA-2024-003",
    assessmentDate: "2024-04-06",
    sector: "Livelihood / Commerce",
    affectedHouseholds: 5,
    affectedPersons: 22,
    damageDescription:
      "Five market stalls completely destroyed. Two partially damaged. Personal belongings and business inventory lost.",
    estimatedDamage: 420000,
    immediateNeeds: ["Livelihood assistance", "Temporary business space"],
    validationStatus: "Validated",
    assessedBy: "DRRM Focal Mangubat",
    evidenceNotes: "BFP incident record and market-stall assessment sheets on file.",
    version: 1,
    reportControl: danaControl(
      "DANA003",
      "DRRM Focal Mangubat",
      "2024-04-06T09:00:00",
      "BFP incident record and market-stall assessment sheets",
    ),
    status: "Archived",
    createdAt: "2024-04-06T09:00:00",
  },
  {
    ...context.emong3,
    id: "DANA004",
    danaNo: "DANA-2024-004",
    assessmentDate: "2024-06-13",
    sector: "Infrastructure",
    affectedHouseholds: 0,
    affectedPersons: 0,
    damageDescription:
      "Damage to barangay road shoulder along Riverside stretch. Estimated 200 linear meters affected. Drainage blocked at two points.",
    estimatedDamage: 120000,
    immediateNeeds: ["Road clearing materials", "Drainage repair"],
    validationStatus: "Pending",
    assessedBy: "DRRM Focal Mangubat",
    version: 1,
    reportControl: danaControl("DANA004", "DRRM Focal Mangubat", "2024-06-13T11:00:00"),
    status: "Draft",
    createdAt: "2024-06-13T11:00:00",
  },
];

export const mockEvacuationRecords: EvacuationRecord[] = [
  {
    ...context.emong1,
    id: "EV001",
    evacuationCenterName: "Barangay Maligaya Elementary School",
    address: "Purok 5 - Town Center, Brgy. Maligaya",
    displacedFamilies: 30,
    displacedPersons: 120,
    disaggregatedPopulation: {
      ageSex: {
        infant0To6Months: { male: 2, female: 3, notReported: 0 },
        toddler7MonthsTo2Years: { male: 4, female: 5, notReported: 0 },
        preschool3To5Years: { male: 5, female: 6, notReported: 0 },
        schoolAge6To12Years: { male: 10, female: 12, notReported: 0 },
        teenage13To17Years: { male: 6, female: 7, notReported: 0 },
        adult18To59Years: { male: 24, female: 27, notReported: 0 },
        elderly60YearsAndAbove: { male: 4, female: 5, notReported: 0 },
      },
      sectoral: {
        pregnantWomen: 2,
        lactatingMothers: 3,
        childHeadedFamilies: { male: 0, female: 0, notReported: 0 },
        singleHeadedFamilies: { male: 1, female: 2, notReported: 0 },
        soloParents: { male: 1, female: 3, notReported: 0 },
        personsWithDisability: { male: 1, female: 2, notReported: 0 },
        indigenousPeoples: { male: 0, female: 0, notReported: 0 },
        fourPsBeneficiaries: { male: 8, female: 11, notReported: 0 },
      },
      dataQualityStatus: "Complete",
      source: "Evacuation center registration and household validation",
      collectedAt: "2024-06-10T18:00:00",
      validatedAt: "2024-06-10T20:00:00",
      validatedBy: "DRRM Focal Mangubat",
    },
    originPuroks: ["Purok 1 - Riverside", "Purok 3 - Seaside"],
    needs: [
      "Food packs",
      "Sleeping mats",
      "Blankets",
      "Diapers",
      "Infant formula",
    ],
    reportingDate: "2024-06-10",
    status: "Closed",
    reportStatus: "Submitted",
    version: 1,
    reportControl: dromicControl(
      "EV001",
      "DRRM Focal Mangubat",
      "2024-06-10T20:00:00",
      "Evacuation center registration and household validation",
    ),
    managedBy: "DRRM Focal Mangubat",
    locationType: "Inside Evacuation Center",
    householdEpisodes: [
      {
        id: "DEP001",
        householdId: "H001",
        householdName: "Dela Cruz Household",
        locationType: "Inside Evacuation Center",
        checkedInAt: "2024-06-10T07:00:00",
        checkedOutAt: "2024-06-12T10:00:00",
        persons: 5,
        personDetailsCaptured: false,
      },
    ],
  },
  {
    ...context.emong1,
    id: "EV002",
    evacuationCenterName: "Barangay Multi-Purpose Hall",
    address: "Purok 5 - Town Center, Brgy. Maligaya",
    displacedFamilies: 15,
    displacedPersons: 60,
    disaggregatedPopulation: {
      ageSex: {
        infant0To6Months: { male: 1, female: 1, notReported: 0 },
        toddler7MonthsTo2Years: { male: 2, female: 3, notReported: 0 },
        preschool3To5Years: { male: 3, female: 3, notReported: 0 },
        schoolAge6To12Years: { male: 5, female: 6, notReported: 0 },
        teenage13To17Years: { male: 3, female: 4, notReported: 0 },
        adult18To59Years: { male: 12, female: 12, notReported: 0 },
        elderly60YearsAndAbove: { male: 2, female: 3, notReported: 0 },
      },
      sectoral: {
        pregnantWomen: 1,
        lactatingMothers: 1,
        childHeadedFamilies: { male: 0, female: 0, notReported: 0 },
        singleHeadedFamilies: { male: 0, female: 1, notReported: 0 },
        soloParents: { male: 1, female: 1, notReported: 0 },
        personsWithDisability: { male: 1, female: 0, notReported: 0 },
        indigenousPeoples: { male: 0, female: 0, notReported: 0 },
        fourPsBeneficiaries: { male: 4, female: 5, notReported: 0 },
      },
      dataQualityStatus: "Complete",
      source: "Evacuation center registration and household validation",
      collectedAt: "2024-06-10T18:00:00",
      validatedAt: "2024-06-10T20:15:00",
      validatedBy: "DRRM Focal Mangubat",
    },
    originPuroks: ["Purok 1 - Riverside"],
    needs: ["Food packs", "Water", "Medicines"],
    reportingDate: "2024-06-10",
    status: "Closed",
    reportStatus: "Approved",
    version: 1,
    reportControl: dromicControl(
      "EV002",
      "DRRM Focal Mangubat",
      "2024-06-10T20:15:00",
      "Evacuation center registration and household validation",
    ),
    managedBy: "DRRM Focal Mangubat",
    locationType: "Inside Evacuation Center",
    householdEpisodes: [
      {
        id: "DEP002",
        householdId: "H002",
        householdName: "Mendoza Household",
        locationType: "Inside Evacuation Center",
        checkedInAt: "2024-06-10T08:15:00",
        checkedOutAt: "2024-06-11T16:00:00",
        persons: 4,
        personDetailsCaptured: false,
      },
    ],
  },
  {
    ...context.emong1,
    id: "EV003",
    evacuationCenterName: "Sitio Upper Riverside Community Center",
    address: "Purok 1 - Riverside, Brgy. Maligaya",
    displacedFamilies: 8,
    displacedPersons: 32,
    originPuroks: ["Purok 1 - Riverside"],
    needs: ["Food", "Hygiene kits"],
    reportingDate: "2024-06-10",
    status: "Closed",
    reportStatus: "Draft",
    version: 1,
    reportControl: dromicControl(
      "EV003",
      "DRRM Focal Mangubat",
      "2024-06-10T09:00:00",
      "Outside-EC household validation",
    ),
    managedBy: "DRRM Focal Mangubat",
    locationType: "Outside Evacuation Center",
    householdEpisodes: [
      {
        id: "DEP003",
        householdId: "H003",
        householdName: "Villanueva Household",
        locationType: "Outside Evacuation Center",
        checkedInAt: "2024-06-10T09:00:00",
        checkedOutAt: "2024-06-12T07:00:00",
        persons: 6,
        personDetailsCaptured: false,
      },
    ],
  },
  {
    ...context.fire1,
    id: "EV004",
    evacuationCenterName: "Host Families near Town Center",
    address: "Purok 5 - Town Center, Brgy. Maligaya",
    displacedFamilies: 5,
    displacedPersons: 22,
    originPuroks: ["Purok 5 - Town Center"],
    needs: ["Temporary shelter support", "Food packs", "Livelihood assistance"],
    reportingDate: "2024-04-05",
    status: "Closed",
    reportStatus: "Archived",
    version: 1,
    reportControl: dromicControl(
      "EV004",
      "DRRM Focal Mangubat",
      "2024-04-05T20:00:00",
      "Host-family displacement validation",
    ),
    managedBy: "DRRM Focal Mangubat",
    locationType: "Outside Evacuation Center",
    householdEpisodes: [
      {
        id: "DEP004",
        householdId: "H010",
        householdName: "Soriano Household",
        locationType: "Outside Evacuation Center",
        checkedInAt: "2024-04-05T17:30:00",
        checkedOutAt: "2024-04-10T09:00:00",
        persons: 5,
        personDetailsCaptured: false,
      },
    ],
  },
];

export const mockHazardRisks: HazardRisk[] = [
  {
    ...context.emong1,
    id: "HR001",
    hazardType: "Flooding",
    affectedPuroks: ["Purok 1 - Riverside", "Purok 3 - Seaside"],
    riskLevel: "High",
    vulnerableGroups: [
      "Senior Citizen",
      "Person with Disability (PWD)",
      "Infants",
    ],
    preparednessNotes:
      "Pre-identified evacuation routes established. Creek monitoring protocol in place. 2 evacuation centers designated.",
    mapReference: "Flood Hazard Map - DOST-PHIVOLCS 2023",
    lastUpdated: "2024-05-01",
    updatedBy: "DRRM Focal Mangubat",
  },
  {
    ...context.emong1,
    id: "HR002",
    hazardType: "Landslide",
    affectedPuroks: ["Purok 2 - Mountainview"],
    riskLevel: "Moderate",
    vulnerableGroups: ["All residents along steep slopes"],
    preparednessNotes:
      "MGB geohazard zones mapped. Residents briefed on warning signs. Early evacuation protocol established.",
    mapReference: "Landslide Susceptibility Map - MGB 2022",
    lastUpdated: "2024-05-01",
    updatedBy: "DRRM Focal Mangubat",
  },
  {
    ...context.emong1,
    id: "HR003",
    hazardType: "Typhoon",
    affectedPuroks: ["All Puroks"],
    riskLevel: "High",
    vulnerableGroups: [
      "Senior Citizen",
      "Person with Disability (PWD)",
      "Pregnant women",
      "Infants",
    ],
    preparednessNotes:
      "Annual typhoon preparedness drill conducted. Evacuation center capacity assessed. Signal protocol in place.",
    mapReference: "PAGASA Typhoon Track Historical Data",
    lastUpdated: "2024-05-01",
    updatedBy: "DRRM Focal Mangubat",
  },
  {
    ...context.fire1,
    id: "HR004",
    hazardType: "Fire",
    affectedPuroks: ["Purok 5 - Town Center", "Purok 1 - Riverside"],
    riskLevel: "Moderate",
    vulnerableGroups: ["Market vendors", "Dense residential areas"],
    preparednessNotes:
      "BFP partnership established. Fire extinguishers distributed to key establishments. Clear access routes maintained.",
    mapReference: "BFP Fire Risk Assessment 2023",
    lastUpdated: "2024-05-01",
    updatedBy: "DRRM Focal Mangubat",
  },
];

export const mockDRRMResources: DRRMResource[] = [
  {
    ...context.emong1,
    id: "RS001",
    resourceName: "Rubber Boat",
    category: "Equipment",
    quantity: 2,
    unit: "unit",
    condition: "Good",
    location: "Barangay Hall Storage",
    custodian: "DRRM Focal Mangubat",
    availability: "Available",
    lastInspected: "2024-05-15",
  },
  {
    ...context.emong1,
    id: "RS002",
    resourceName: "Life Jackets",
    category: "Equipment",
    quantity: 20,
    unit: "piece",
    condition: "Good",
    location: "Barangay Hall Storage",
    custodian: "DRRM Focal Mangubat",
    availability: "Available",
    lastInspected: "2024-05-15",
  },
  {
    ...context.emong1,
    id: "RS003",
    resourceName: "Food Packs (Family Pack)",
    category: "Supply",
    quantity: 100,
    unit: "pack",
    condition: "Good",
    location: "Barangay Multi-Purpose Hall Stockroom",
    custodian: "DRRM Focal Mangubat",
    availability: "Available",
    lastInspected: "2024-06-01",
    remarks: "Replenished June 2024",
  },
  {
    ...context.emong1,
    id: "RS004",
    resourceName: "First Aid Kit",
    category: "Medical",
    quantity: 5,
    unit: "kit",
    condition: "Good",
    location: "Barangay Hall",
    custodian: "DRRM Focal Mangubat",
    availability: "Available",
    lastInspected: "2024-05-20",
  },
  {
    ...context.emong1,
    id: "RS005",
    resourceName: "Portable Generator",
    category: "Equipment",
    quantity: 1,
    unit: "unit",
    condition: "Fair",
    location: "Barangay Hall",
    custodian: "DRRM Focal Mangubat",
    availability: "Available",
    lastInspected: "2024-05-10",
    remarks: "Requires servicing before next deployment",
  },
  {
    ...context.emong1,
    id: "RS006",
    resourceName: "Megaphone / Bullhorn",
    category: "Communication",
    quantity: 3,
    unit: "unit",
    condition: "Good",
    location: "Barangay Hall",
    custodian: "DRRM Focal Mangubat",
    availability: "Available",
    lastInspected: "2024-05-20",
  },
  {
    ...context.emong1,
    id: "RS007",
    resourceName: "Emergency Blankets",
    category: "Supply",
    quantity: 50,
    unit: "piece",
    condition: "Good",
    location: "Barangay Hall Storage",
    custodian: "DRRM Focal Mangubat",
    availability: "Available",
    lastInspected: "2024-05-20",
  },
  {
    ...context.emong1,
    id: "RS008",
    resourceName: "Chainsaw",
    category: "Equipment",
    quantity: 1,
    unit: "unit",
    condition: "For Repair",
    location: "Barangay Hall",
    custodian: "DRRM Focal Mangubat",
    availability: "In Maintenance",
    lastInspected: "2024-06-01",
    remarks: "Engine overhaul needed",
  },
];

export const mockReliefDistributions: ReliefDistribution[] = [
  {
    ...context.emong1,
    id: "RL001",
    recipientHouseholdId: "H001",
    recipientName: "Dela Cruz Household",
    assistanceType: "Food Pack (Family)",
    quantity: 2,
    unit: "pack",
    distributionDate: "2024-06-10",
    source: "MSWDO Relief Goods",
    issuedBy: "DRRM Focal Mangubat",
  },
  {
    ...context.emong1,
    id: "RL002",
    recipientHouseholdId: "H002",
    recipientName: "Mendoza Household",
    assistanceType: "Food Pack (Family)",
    quantity: 1,
    unit: "pack",
    distributionDate: "2024-06-10",
    source: "MSWDO Relief Goods",
    issuedBy: "DRRM Focal Mangubat",
    remarks: "Senior citizen household",
  },
  {
    ...context.emong1,
    id: "RL003",
    recipientHouseholdId: "H003",
    recipientName: "Villanueva Household",
    assistanceType: "Food Pack (Family)",
    quantity: 2,
    unit: "pack",
    distributionDate: "2024-06-10",
    source: "MSWDO Relief Goods",
    issuedBy: "DRRM Focal Mangubat",
  },
  {
    ...context.emong2,
    id: "RL004",
    recipientHouseholdId: "H008",
    recipientName: "Tolentino Household",
    assistanceType: "Emergency Shelter Kit",
    quantity: 1,
    unit: "kit",
    distributionDate: "2024-06-11",
    source: "OCD Regional Office",
    issuedBy: "DRRM Focal Mangubat",
    remarks: "Partial roof damage",
  },
  {
    ...context.fire1,
    id: "RL005",
    recipientHouseholdId: "H010",
    recipientName: "Soriano Household",
    assistanceType: "Livelihood Assistance Pack",
    quantity: 1,
    unit: "pack",
    distributionDate: "2024-04-10",
    source: "DOLE Quick Response",
    issuedBy: "DRRM Focal Mangubat",
    remarks: "Affected market vendor",
  },
];

export const mockBDRRMCActions: BDRRMCAction[] = [
  {
    ...context.emong1,
    id: "BA001",
    meetingDate: "2024-06-09",
    agenda: "Pre-Typhoon Emong Preparedness Meeting",
    attendees: [
      "Hon. Reyes (Punong Barangay)",
      "DRRM Focal Mangubat",
      "Secretary Santos",
      "Treas. Villanueva",
      "Kagawad Aquino",
      "BHW Rep. Flores",
    ],
    decisions: [
      "Activate Barangay Emergency Operations Center",
      "Pre-position evacuation centers",
      "Deploy monitoring teams to Riverside and Seaside puroks",
    ],
    actionItems: [
      {
        item: "Open Brgy. Elementary School as evacuation center",
        responsible: "DRRM Focal Mangubat",
        deadline: "2024-06-10",
        status: "Done",
      },
      {
        item: "Coordinate food pack request with MSWDO",
        responsible: "Treas. Villanueva",
        deadline: "2024-06-10",
        status: "Done",
      },
      {
        item: "Brief Purok Leaders on evacuation protocol",
        responsible: "Secretary Santos",
        deadline: "2024-06-09",
        status: "Done",
      },
    ],
    status: "Completed",
    minutes: "All actions completed. EOC activated at 5:00 AM June 10.",
  },
  {
    ...context.emong3,
    id: "BA002",
    meetingDate: "2024-06-14",
    agenda: "Post-Typhoon Emong Assessment and Recovery Planning",
    attendees: [
      "Hon. Reyes",
      "DRRM Focal Mangubat",
      "Secretary Santos",
      "Treas. Villanueva",
      "Kagawad Cruz",
    ],
    decisions: [
      "Initiate DANA assessment for all sectors",
      "Submit DANA and SitRep to MDRRMO",
      "Organize community clean-up",
    ],
    actionItems: [
      {
        item: "Complete DANA assessment",
        responsible: "DRRM Focal Mangubat",
        deadline: "2024-06-15",
        status: "Done",
      },
      {
        item: "Submit SitRep Final Report",
        responsible: "DRRM Focal Mangubat",
        deadline: "2024-06-16",
        status: "In Progress",
      },
      {
        item: "Community clean-up drive",
        responsible: "Secretary Santos",
        deadline: "2024-06-17",
        status: "Pending",
      },
    ],
    status: "Completed",
  },
];

type DRRMRecord = DRRMOperationalContext & { id: string };

export const DRRM_RECORD_TYPE_LABELS: Record<DRRMRecordType, string> = {
  "early-warning": "Early Warnings",
  sitrep: "Situation Reports",
  dana: "DANA Assessments",
  evacuation: "Evacuation & Displacement",
  "hazard-risk": "Hazard & Risk Records",
  resource: "Resources",
  relief: "Relief Distributions",
  "bdrrmc-action": "BDRRMC Actions",
};

export const drrmRecordsByType: Record<DRRMRecordType, DRRMRecord[]> = {
  "early-warning": mockEarlyWarnings,
  sitrep: mockSitReps,
  dana: mockDANARecords,
  evacuation: mockEvacuationRecords,
  "hazard-risk": mockHazardRisks,
  resource: mockDRRMResources,
  relief: mockReliefDistributions,
  "bdrrmc-action": mockBDRRMCActions,
};

export function getDRRMRecord(reference: DRRMRecordReference) {
  return drrmRecordsByType[reference.recordType].find(
    (record) => record.id === reference.recordId,
  );
}

export function getDRRMOperationalRecords(
  eventId: string,
  operationalPeriodId?: string,
) {
  return (Object.entries(drrmRecordsByType) as [DRRMRecordType, DRRMRecord[]][])
    .flatMap(([recordType, records]) =>
      records.map((record) => ({ recordType, record })),
    )
    .filter(
      ({ record }) =>
        record.eventId === eventId &&
        (!operationalPeriodId ||
          record.operationalPeriodId === operationalPeriodId),
    );
}

export const mockDRRMRecordLinks: DRRMRecordLink[] = [
  {
    ...context.emong1,
    id: "LINK001",
    source: { recordType: "hazard-risk", recordId: "HR001" },
    target: { recordType: "early-warning", recordId: "EW002" },
    relationType: "informs",
    note: "Riverside flood-risk assessment informs the creek-level warning.",
  },
  {
    ...context.emong1,
    id: "LINK002",
    source: { recordType: "bdrrmc-action", recordId: "BA001" },
    target: { recordType: "early-warning", recordId: "EW001" },
    relationType: "authorizes",
    note: "Preparedness decisions authorize warning and evacuation actions.",
  },
  {
    ...context.emong1,
    id: "LINK003",
    source: { recordType: "early-warning", recordId: "EW001" },
    target: { recordType: "evacuation", recordId: "EV001" },
    relationType: "triggers",
    note: "Typhoon warning triggered the priority evacuation operation.",
  },
  {
    ...context.emong1,
    id: "LINK004",
    source: { recordType: "resource", recordId: "RS003" },
    target: { recordType: "relief", recordId: "RL001" },
    relationType: "supports",
    note: "Pre-positioned family food packs supported this distribution.",
  },
  {
    ...context.emong1,
    id: "LINK005",
    source: { recordType: "evacuation", recordId: "EV001" },
    target: { recordType: "relief", recordId: "RL001" },
    relationType: "supports",
    note: "The displaced household episode established the assistance context.",
  },
  {
    ...context.emong1,
    id: "LINK006",
    source: { recordType: "relief", recordId: "RL001" },
    target: { recordType: "sitrep", recordId: "SR001" },
    relationType: "documents",
    note: "The SitRep records relief delivered during the operational period.",
  },
  {
    ...context.emong2,
    id: "LINK007",
    source: { recordType: "sitrep", recordId: "SR002" },
    target: { recordType: "dana", recordId: "DANA001" },
    relationType: "assesses",
    note: "The housing assessment validates damage reported during response.",
  },
  {
    ...context.emong3,
    id: "LINK008",
    source: { recordType: "dana", recordId: "DANA004" },
    target: { recordType: "bdrrmc-action", recordId: "BA002" },
    relationType: "informs",
    note: "Infrastructure findings inform recovery decisions and assignments.",
  },
  {
    ...context.fire1,
    id: "LINK009",
    source: { recordType: "early-warning", recordId: "EW005" },
    target: { recordType: "sitrep", recordId: "SR003" },
    relationType: "updates",
    note: "The fire alert and response status are consolidated in the SitRep.",
  },
];

export function getLinkedDRRMRecords(reference: DRRMRecordReference) {
  return mockDRRMRecordLinks
    .filter(
      (link) =>
        (link.source.recordType === reference.recordType &&
          link.source.recordId === reference.recordId) ||
        (link.target.recordType === reference.recordType &&
          link.target.recordId === reference.recordId),
    )
    .map((link) => {
      const isSource =
        link.source.recordType === reference.recordType &&
        link.source.recordId === reference.recordId;
      const relatedReference = isSource ? link.target : link.source;

      return {
        link,
        relatedReference,
        relatedRecord: getDRRMRecord(relatedReference),
      };
    });
}
