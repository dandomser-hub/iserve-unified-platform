import type { RoleId } from '@/types/auth';

export const ALL_ROLE_IDS: readonly RoleId[] = [
  'system_admin',
  'punong_barangay',
  'barangay_secretary',
  'barangay_treasurer',
  'drrm_focal',
  'gad_focal',
  'municipal_reviewer',
  'read_only_auditor',
];

const SA: RoleId = 'system_admin';
const PB: RoleId = 'punong_barangay';
const BS: RoleId = 'barangay_secretary';
const BT: RoleId = 'barangay_treasurer';
const DF: RoleId = 'drrm_focal';
const GF: RoleId = 'gad_focal';
const MR: RoleId = 'municipal_reviewer';
const AO: RoleId = 'read_only_auditor';

export const ROUTE_ACCESS = {
  dashboard: ALL_ROLE_IDS,

  residents: [PB, BS],
  residentDuplicates: [PB, BS],
  residentStatusManagement: [PB, BS],
  residentProfile: [PB, BS],
  households: [PB, BS],

  documentIntake: [BS],
  documentQueue: [PB, BS, BT],
  documentTemplates: [SA, BS],
  documentVerification: [PB, BS, BT],
  documentWorkspace: [PB, BS, BT],
  documentPreviewRelease: [PB, BS],

  collectionReferenceLog: [PB, BS, BT],
  collectionDailyCertification: [PB, BT],
  collectionFeesExemptions: [PB, BT],

  blotterRegistry: [PB, BS],
  blotterIntake: [PB, BS],
  kpCases: [PB, BS],
  kpNoticesSchedule: [PB, BS],
  kpMinutesSettlement: [PB, BS],

  drrmDashboard: [PB, BS, DF],
  drrmEarlyWarning: [PB, BS, DF],
  drrmSitrep: [PB, BS, DF],
  drrmDana: [PB, BS, DF],
  drrmEvacuationDromic: [PB, BS, DF],
  drrmHazardRisk: [PB, BS, DF],
  drrmResources: [PB, BS, DF],
  drrmReliefDistribution: [PB, BS, DF],
  drrmActions: [PB, BS, DF],

  gadDashboard: [PB, BS, GF],
  gadAnnexD1: [PB, BS, GF],
  gadAnnexE1: [PB, BS, GF],
  gadActivityMonitor: [PB, BS, GF],
  gadParticipants: [PB, BS, GF],
  gadBudgetAttribution: [PB, BS, BT, GF],

  reports: [PB, BS, BT, DF, GF, MR, AO],
  municipalReview: [PB, BS, MR],
  reviewComments: [PB, BS, MR],
  complianceSglgb: [PB, BS, MR, AO],
  dataQuality: [SA, PB, BS],

  adminUsersRoles: [SA],
  adminAudit: [SA, AO],
  adminBackupSync: [SA],
  adminSettings: [SA],

  roadmap: ALL_ROLE_IDS,
  attachments: [PB, BS],
} as const satisfies Record<string, readonly RoleId[]>;

export type RouteAccessId = keyof typeof ROUTE_ACCESS;

export interface ProtectedRoutePolicy {
  id: RouteAccessId;
  path: string;
}

export const PROTECTED_ROUTE_POLICIES: readonly ProtectedRoutePolicy[] = [
  { id: 'dashboard', path: '/dashboard' },

  { id: 'residents', path: '/residents' },
  { id: 'residentDuplicates', path: '/residents/duplicates' },
  { id: 'residentStatusManagement', path: '/residents/status-management' },
  { id: 'residentProfile', path: '/residents/:id' },
  { id: 'households', path: '/households' },

  { id: 'documentIntake', path: '/documents/intake' },
  { id: 'documentQueue', path: '/documents/queue' },
  { id: 'documentTemplates', path: '/documents/templates' },
  { id: 'documentVerification', path: '/documents/verification' },
  { id: 'documentWorkspace', path: '/documents/:id/workspace' },
  { id: 'documentPreviewRelease', path: '/documents/:id/preview-release' },

  { id: 'collectionReferenceLog', path: '/collections/reference-log' },
  { id: 'collectionDailyCertification', path: '/collections/daily-certification' },
  { id: 'collectionFeesExemptions', path: '/collections/fees-exemptions' },

  { id: 'blotterRegistry', path: '/blotter' },
  { id: 'blotterIntake', path: '/blotter/intake' },
  { id: 'kpCases', path: '/kp-cases' },
  { id: 'kpNoticesSchedule', path: '/kp/notices-schedule' },
  { id: 'kpMinutesSettlement', path: '/kp/minutes-settlement' },

  { id: 'drrmDashboard', path: '/drrm' },
  { id: 'drrmEarlyWarning', path: '/drrm/early-warning' },
  { id: 'drrmSitrep', path: '/drrm/sitrep' },
  { id: 'drrmDana', path: '/drrm/dana' },
  { id: 'drrmEvacuationDromic', path: '/drrm/evacuation-dromic' },
  { id: 'drrmHazardRisk', path: '/drrm/hazard-risk' },
  { id: 'drrmResources', path: '/drrm/resources' },
  { id: 'drrmReliefDistribution', path: '/drrm/relief-distribution' },
  { id: 'drrmActions', path: '/drrm/actions' },

  { id: 'gadDashboard', path: '/gad' },
  { id: 'gadAnnexD1', path: '/gad/annex-d1' },
  { id: 'gadAnnexE1', path: '/gad/annex-e1' },
  { id: 'gadActivityMonitor', path: '/gad/activity-monitor' },
  { id: 'gadParticipants', path: '/gad/participants' },
  { id: 'gadBudgetAttribution', path: '/gad/budget-attribution' },

  { id: 'reports', path: '/reports' },
  { id: 'municipalReview', path: '/review/municipal-city' },
  { id: 'reviewComments', path: '/review/comments' },
  { id: 'complianceSglgb', path: '/compliance/sglgb' },
  { id: 'dataQuality', path: '/data-quality' },

  { id: 'adminUsersRoles', path: '/admin/users-roles' },
  { id: 'adminAudit', path: '/admin/audit' },
  { id: 'adminBackupSync', path: '/admin/backup-sync' },
  { id: 'adminSettings', path: '/admin/settings' },

  { id: 'roadmap', path: '/roadmap' },
  { id: 'attachments', path: '/attachments' },
];

export function canAccessRoute(roleId: RoleId, routeId: RouteAccessId): boolean {
  return (ROUTE_ACCESS[routeId] as readonly RoleId[]).includes(roleId);
}

function matchesPolicyPath(policyPath: string, pathname: string): boolean {
  if (policyPath.includes(':')) {
    const pattern = policyPath
      .split('/')
      .map(segment => (segment.startsWith(':') ? '[^/]+' : segment))
      .join('/');
    return new RegExp(`^${pattern}$`).test(pathname);
  }
  return policyPath === pathname;
}

export function findRoutePolicy(pathname: string): ProtectedRoutePolicy | undefined {
  if (pathname === '/roadmap' || pathname.startsWith('/roadmap/')) {
    return { id: 'roadmap', path: '/roadmap/*' };
  }
  return PROTECTED_ROUTE_POLICIES.find(policy => matchesPolicyPath(policy.path, pathname));
}

export function canAccessPath(roleId: RoleId, pathname: string): boolean {
  const policy = findRoutePolicy(pathname);
  return policy ? canAccessRoute(roleId, policy.id) : false;
}
