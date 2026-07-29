export type BlotterStatus = 'New' | 'Recorded' | 'Action Taken' | 'Referred' | 'Settled' | 'Closed';
export type IncidentType =
  | 'Physical Altercation'
  | 'Property Dispute'
  | 'Noise Complaint'
  | 'Theft/Robbery'
  | 'Trespassing'
  | 'Verbal Abuse'
  | 'Public Disturbance'
  | 'Domestic Dispute'
  | 'Animal Bite Incident'
  | 'Traffic Incident'
  | 'Other';

export type KPStatus =
  | 'Filed'
  | 'Summons Prepared'
  | 'Hearing Scheduled'
  | 'In Conciliation'
  | 'Settled'
  | 'Referred'
  | 'CFA Issued'
  | 'Closed';

export type DisputeCategory =
  | 'Property / Land Boundary'
  | 'Money / Debt'
  | 'Family / Domestic'
  | 'Noise / Nuisance'
  | 'Physical Harm'
  | 'Business Dispute'
  | 'Other';

export interface BlotterParty {
  residentId?: string;
  name: string;
  address: string;
  contactNo?: string;
  role: 'Complainant' | 'Respondent' | 'Witness';
}

export interface BlotterIncident {
  id: string;
  incidentNo: string;
  dateTime: string;
  location: string;
  incidentType: IncidentType;
  parties: BlotterParty[];
  narrativeSummary: string;
  actionTaken?: string;
  status: BlotterStatus;
  isConfidential: boolean;
  linkedKPCaseId?: string;
  encodedBy: string;
  createdAt: string;
  updatedAt: string;
  workflowHistory: { status: BlotterStatus; action: string; performedBy: string; performedAt: string }[];
}

export interface KPCase {
  id: string;
  caseNo: string;
  linkedBlotterId?: string;
  linkedBlotterNo?: string;
  disputeCategory: DisputeCategory;
  complainant: string;
  respondent: string;
  filedDate: string;
  status: KPStatus;
  hearingSchedule?: string;
  venue?: string;
  summonsIssuedAt?: string;
  settlementSummary?: string;
  cfaIssuedAt?: string;
  closedAt?: string;
  lupon?: string;
  workflowHistory: { status: KPStatus; action: string; performedBy: string; performedAt: string }[];
}

export interface KPNotice {
  id: string;
  kpCaseId: string;
  caseNo: string;
  noticeType: 'Summons' | 'Hearing Notice' | 'Conciliation Notice' | 'Settlement Notice';
  recipient: string;
  issuedDate: string;
  serviceStatus: 'Pending' | 'Served' | 'Returned' | 'Unserved';
  scheduleDate?: string;
  venue?: string;
  servedAt?: string;
}

export interface KPMinutes {
  id: string;
  kpCaseId: string;
  caseNo: string;
  sessionDate: string;
  minutesSummary: string;
  settlementTerms?: string;
  complianceStatus?: 'Complied' | 'Pending' | 'Non-Compliant';
  nextSteps?: string;
  preparedBy: string;
  attendees: string[];
}
