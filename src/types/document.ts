export type DocumentType =
  | 'Barangay Clearance'
  | 'Certificate of Residency'
  | 'Certificate of Indigency'
  | 'Certificate of Low Income / No Income'
  | 'Certificate of Good Moral Character'
  | 'Certificate of Unemployment'
  | 'First Time Jobseeker Certification'
  | 'Business Clearance'
  | 'Certificate of Appearance'
  | 'Blotter Certification'
  | 'KP Certification'
  | 'DRRM SitRep Export'
  | 'DANA Export'
  | 'GAD Annex D-1 Export'
  | 'GAD Annex E-1 Export';

export type DocumentStatus =
  | 'Draft'
  | 'For Validation'
  | 'For Approval'
  | 'Approved'
  | 'For Release'
  | 'Released'
  | 'Returned'
  | 'Cancelled';

export interface DocumentRequirement {
  label: string;
  required: boolean;
  submitted: boolean;
}

export interface DocumentRequest {
  id: string;
  requestNo: string;
  residentId: string;
  residentName: string;
  documentType: DocumentType;
  purpose: string;
  requirements: DocumentRequirement[];
  feeReference?: string;
  feeAmount?: number;
  hasBlotterFlag: boolean;
  hasKPFlag: boolean;
  status: DocumentStatus;
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  workflowHistory: WorkflowEvent[];
  remarks?: string;
  referenceNo?: string;
  verificationCode?: string;
  releasedAt?: string;
  releasedBy?: string;
}

export interface WorkflowEvent {
  id: string;
  fromStatus?: DocumentStatus;
  toStatus: DocumentStatus;
  action: string;
  performedBy: string;
  performedAt: string;
  remarks?: string;
}

export interface DocumentTemplate {
  id: string;
  documentType: DocumentType;
  version: string;
  isActive: boolean;
  variables: string[];
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface IssuedDocument {
  id: string;
  requestId: string;
  requestNo: string;
  residentId: string;
  residentName: string;
  documentType: DocumentType;
  referenceNo: string;
  verificationCode: string;
  issuedAt: string;
  issuedBy: string;
  validUntil?: string;
  isRevoked: boolean;
  revokedAt?: string;
  revokedReason?: string;
}
