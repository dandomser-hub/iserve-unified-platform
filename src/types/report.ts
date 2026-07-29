export type ReportStatus = 'Draft' | 'For Review' | 'Approved' | 'Submitted' | 'Returned' | 'Accepted' | 'Archived';
export type ReviewStatus = 'Submitted' | 'Under Review' | 'Commented' | 'Returned for Revision' | 'Accepted';
export type ExportFormat = 'PDF' | 'CSV' | 'Excel' | 'Print';

export interface ReportCard {
  id: string;
  title: string;
  module: string;
  description: string;
  availableFormats: ExportFormat[];
  lastGenerated?: string;
  lastGeneratedBy?: string;
  status?: ReportStatus;
  privacyLevel: 'Public' | 'Internal' | 'Confidential';
}

export interface MunicipalReviewItem {
  id: string;
  reportTitle: string;
  module: string;
  submittedBy: string;
  submittedAt: string;
  reviewStatus: ReviewStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  comments: ReviewComment[];
}

export interface ReviewComment {
  id: string;
  reviewItemId: string;
  commentText: string;
  commentedBy: string;
  commentedAt: string;
  assignedTo?: string;
  status: 'Open' | 'Resolved' | 'Noted';
  resolutionNotes?: string;
}

export interface ComplianceItem {
  id: string;
  category: string;
  item: string;
  evidenceReference?: string;
  status: 'Not Started' | 'In Progress' | 'For Review' | 'Compliant' | 'Needs Action';
  responsibleRole: string;
  remarks?: string;
  lastUpdated: string;
}

export interface DataQualityIssue {
  id: string;
  issueType: 'Missing Field' | 'Duplicate Candidate' | 'Stale Record' | 'Incomplete Report' | 'Attachment Gap';
  module: string;
  recordId?: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  suggestedAction: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Accepted';
}
