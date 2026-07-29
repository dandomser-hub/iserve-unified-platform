export type GADReportStatus = 'Draft' | 'For Review' | 'Endorsed' | 'Submitted' | 'Returned' | 'Accepted' | 'Archived';

export interface GADAnnexD1Item {
  id: string;
  genderIssue: string;
  cause: string;
  gadResultStatement: string;
  relevantOrgPAP: string;
  activity: string;
  performanceIndicator: string;
  budget: number;
  responsibleOffice: string;
  responsiblePerson: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Deferred';
  remarks?: string;
}

export interface GADAnnexE1Item {
  id: string;
  annexD1ItemId?: string;
  plannedActivity: string;
  actualActivity?: string;
  result?: string;
  plannedBudget: number;
  actualExpenditure?: number;
  variance?: number;
  movsEvidence?: string;
  responsiblePerson: string;
  remarks?: string;
  status: GADReportStatus;
}

export interface GADActivity {
  id: string;
  activityName: string;
  linkedAnnexD1Id?: string;
  scheduledDate: string;
  actualDate?: string;
  venue: string;
  budget: number;
  actualExpenditure?: number;
  milestones: { label: string; done: boolean }[];
  issues?: string;
  outputs?: string;
  status: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled';
}

export interface GADParticipant {
  id: string;
  activityId: string;
  activityName: string;
  date: string;
  malePax: number;
  femalePax: number;
  totalPax: number;
  sectorBreakdown: { sector: string; count: number }[];
  ageGroupBreakdown: { ageGroup: string; count: number }[];
}

export interface GADBudgetAttribution {
  id: string;
  budgetSource: string;
  referenceNo: string;
  amount: number;
  attributedTo: string;
  attributionNotes: string;
  year: number;
  quarter: number;
  createdAt: string;
}
