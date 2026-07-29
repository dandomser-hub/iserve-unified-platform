import type { WorkflowStatus } from '@/types/workflow';

export type StatusVariant = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple';

// Returns the visual variant for a given workflow status chip
export function getStatusVariant(status: string): StatusVariant {
  const map: Record<string, StatusVariant> = {
    // Document
    'Draft': 'neutral',
    'For Validation': 'info',
    'For Approval': 'warning',
    'Approved': 'success',
    'For Release': 'purple',
    'Released': 'success',
    'Returned': 'warning',
    'Cancelled': 'danger',
    // Blotter
    'New': 'info',
    'Recorded': 'neutral',
    'Action Taken': 'warning',
    'Referred': 'info',
    'Settled': 'success',
    'Closed': 'neutral',
    // KP
    'Filed': 'info',
    'Summons Prepared': 'warning',
    'Hearing Scheduled': 'warning',
    'In Conciliation': 'info',
    'CFA Issued': 'success',
    // DRRM/GAD report
    'For Review': 'warning',
    'Endorsed': 'info',
    'Submitted': 'info',
    'Exported': 'success',
    'Archived': 'neutral',
    // GAD
    'Accepted': 'success',
    // Resident
    'Active': 'success',
    'Inactive': 'neutral',
    'Transferred Out': 'neutral',
    'Deceased': 'danger',
    // Review
    'Under Review': 'warning',
    'Commented': 'info',
    'Returned for Revision': 'warning',
    // General
    'Compliant': 'success',
    'Needs Action': 'danger',
    'Not Started': 'neutral',
    'In Progress': 'info',
    'Completed': 'success',
    'Planned': 'neutral',
    'Deferred': 'neutral',
    // Alert severity
    'Critical': 'danger',
    'High': 'danger',
    'Moderate': 'warning',
    'Low': 'info',
    // DRRM Alert Status (Active already defined as success for residents, override not needed)
    'Lifted': 'success',
    'Escalated': 'danger',
    // Resources
    'Available': 'success',
    'Deployed': 'warning',
    'In Maintenance': 'warning',
    'Unavailable': 'danger',
    // Collection (Recorded already defined for blotter, value same)
    'Certified': 'success',
    'Voided': 'danger',
  };
  return map[status] ?? 'neutral';
}

export const STATUS_COLORS: Record<StatusVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  info: 'bg-sky-100 text-sky-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  neutral: 'bg-slate-100 text-slate-600',
  purple: 'bg-purple-100 text-purple-800',
};

export function getStatusColor(status: string): string {
  return STATUS_COLORS[getStatusVariant(status)];
}
