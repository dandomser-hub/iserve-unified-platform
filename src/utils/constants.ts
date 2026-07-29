import type { Role, RoleId } from '@/types/auth';

export const ROLES: Role[] = [
  { id: 'system_admin', label: 'System Administrator', shortLabel: 'Sys Admin', description: 'Technical platform administration, user/role management, audit, backup and sync monitoring.', color: 'bg-slate-700', icon: 'Shield' },
  { id: 'punong_barangay', label: 'Punong Barangay', shortLabel: 'Punong Barangay', description: 'Executive dashboard, approvals, DRRM/GAD review, document signing simulation.', color: 'bg-forest', icon: 'Star' },
  { id: 'barangay_secretary', label: 'Barangay Secretary', shortLabel: 'Secretary', description: 'Residents, households, documents, blotter, KP, reports, and routine operations.', color: 'bg-ocean', icon: 'FileText' },
  { id: 'barangay_treasurer', label: 'Barangay Treasurer', shortLabel: 'Treasurer', description: 'Collection reference log, fee table, daily certification, and related document view.', color: 'bg-mountain', icon: 'Wallet' },
  { id: 'drrm_focal', label: 'DRRM Focal / BDRRMC User', shortLabel: 'DRRM Focal', description: 'DRRM dashboard, early warning, SitRep, DANA, evacuation, hazard/risk, resources, relief, BDRRMC actions.', color: 'bg-sky', icon: 'AlertTriangle' },
  { id: 'gad_focal', label: 'GAD Focal', shortLabel: 'GAD Focal', description: 'GAD dashboard, Annex D-1, Annex E-1, activities, participant logs, budget attribution.', color: 'bg-grass', icon: 'Users' },
  { id: 'municipal_reviewer', label: 'Municipal/City Reviewer', shortLabel: 'Reviewer', description: 'Read-only access to submitted reports and exports. Can post review comments.', color: 'bg-amber-600', icon: 'Eye' },
  { id: 'read_only_auditor', label: 'Read-Only Observer / Auditor', shortLabel: 'Auditor', description: 'Read-only access to selected dashboards, reports, and audit trail.', color: 'bg-slate-500', icon: 'Search' },
];

export const DOCUMENT_STATUS_FLOW = [
  'Draft',
  'For Validation',
  'For Approval',
  'Approved',
  'For Release',
  'Released',
] as const;

export const APP_NAME = 'Barangay iSERVE';
export const APP_TAGLINE = 'Integrated System for Efficient, Resilient, Verified, and Empowered Barangay Governance';

export const ROLE_HOME: Record<RoleId, string> = {
  system_admin: '/admin/users-roles',
  punong_barangay: '/dashboard',
  barangay_secretary: '/documents/queue',
  barangay_treasurer: '/collections/reference-log',
  drrm_focal: '/drrm',
  gad_focal: '/gad',
  municipal_reviewer: '/review/municipal-city',
  read_only_auditor: '/reports',
};

export const USERNAME_TO_ROLE: Record<string, RoleId> = {
  admin: 'system_admin',
  captain: 'punong_barangay',
  secretary: 'barangay_secretary',
  treasurer: 'barangay_treasurer',
  drrm: 'drrm_focal',
  gad: 'gad_focal',
  reviewer: 'municipal_reviewer',
  auditor: 'read_only_auditor',
};
