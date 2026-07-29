export type AuditAction =
  | 'Created'
  | 'Updated'
  | 'Approved'
  | 'Released'
  | 'Returned'
  | 'Cancelled'
  | 'Deleted'
  | 'Exported'
  | 'Submitted'
  | 'Validated'
  | 'Logged In'
  | 'Switched Role'
  | 'Viewed'
  | 'Merged'
  | 'Deactivated'
  | 'Certified'
  | 'Endorsed';

export type AuditModule =
  | 'Residents'
  | 'Households'
  | 'Documents'
  | 'Collections'
  | 'Blotter'
  | 'KP Cases'
  | 'DRRM'
  | 'GAD'
  | 'Reports'
  | 'Admin'
  | 'Auth'
  | 'Settings';

export type AuditPrivacyLevel = 'Public' | 'Internal' | 'Confidential' | 'Restricted' | 'System';

export interface AuditEvent {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  module: AuditModule;
  recordId?: string;
  recordLabel?: string;
  description: string;
  timestamp: string;
  ipDevice?: string;
  privacyLevel: AuditPrivacyLevel;
}
