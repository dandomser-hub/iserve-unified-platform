import type { DocumentStatus } from './document';
import type { BlotterStatus, KPStatus } from './blotter';
import type { DRRMReportStatus } from './drrm';
import type { GADReportStatus } from './gad';
import type { ReviewStatus } from './report';

// Document workflow transitions
export const DOCUMENT_TRANSITIONS: Record<DocumentStatus, DocumentStatus[]> = {
  'Draft': ['For Validation', 'Cancelled'],
  'For Validation': ['For Approval', 'Returned', 'Cancelled'],
  'For Approval': ['Approved', 'Returned', 'Cancelled'],
  'Approved': ['For Release'],
  'For Release': ['Released', 'Returned'],
  'Released': [],
  'Returned': ['Draft', 'Cancelled'],
  'Cancelled': [],
};

// Blotter workflow transitions
export const BLOTTER_TRANSITIONS: Record<BlotterStatus, BlotterStatus[]> = {
  'New': ['Recorded'],
  'Recorded': ['Action Taken'],
  'Action Taken': ['Referred', 'Settled', 'Closed'],
  'Referred': ['Closed'],
  'Settled': ['Closed'],
  'Closed': [],
};

// KP Case workflow transitions
export const KP_TRANSITIONS: Record<KPStatus, KPStatus[]> = {
  'Filed': ['Summons Prepared'],
  'Summons Prepared': ['Hearing Scheduled'],
  'Hearing Scheduled': ['In Conciliation'],
  'In Conciliation': ['Settled', 'Referred', 'CFA Issued'],
  'Settled': ['Closed'],
  'Referred': ['Closed'],
  'CFA Issued': ['Closed'],
  'Closed': [],
};

// DRRM report transitions
export const DRRM_REPORT_TRANSITIONS: Record<DRRMReportStatus, DRRMReportStatus[]> = {
  'Draft': ['For Review'],
  'For Review': ['Approved', 'Returned'],
  'Returned': ['For Review'],
  'Approved': ['Exported', 'Submitted'],
  'Exported': ['Submitted', 'Archived'],
  'Submitted': ['Archived'],
  'Archived': [],
};

// GAD report transitions
export const GAD_REPORT_TRANSITIONS: Record<GADReportStatus, GADReportStatus[]> = {
  'Draft': ['For Review'],
  'For Review': ['Endorsed', 'Draft'],
  'Endorsed': ['Submitted'],
  'Submitted': ['Returned', 'Accepted'],
  'Returned': ['Draft'],
  'Accepted': ['Archived'],
  'Archived': [],
};

// Review cycle transitions
export const REVIEW_TRANSITIONS: Record<ReviewStatus, ReviewStatus[]> = {
  'Submitted': ['Under Review'],
  'Under Review': ['Commented', 'Returned for Revision', 'Accepted'],
  'Commented': ['Returned for Revision', 'Accepted'],
  'Returned for Revision': ['Submitted'],
  'Accepted': [],
};

export type WorkflowStatus =
  | DocumentStatus
  | BlotterStatus
  | KPStatus
  | DRRMReportStatus
  | GADReportStatus
  | ReviewStatus
  | 'Active'
  | 'Inactive'
  | 'Pending Review'
  | 'Recorded'
  | 'Certified'
  | 'Compliant'
  | 'Needs Action'
  | 'Not Started'
  | 'In Progress'
  | 'Completed'
  | 'Deferred';
