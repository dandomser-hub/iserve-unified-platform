import { describe, expect, it } from 'vitest';
import type { RoleId } from '@/types/auth';
import {
  ALL_ROLE_IDS,
  PROTECTED_ROUTE_POLICIES,
  ROUTE_ACCESS,
  canAccessPath,
  canAccessRoute,
  findRoutePolicy,
  type RouteAccessId,
} from '@/utils/routeAccess';

const EXPECTED_ALLOWED_ROUTES: Record<RoleId, RouteAccessId[]> = {
  system_admin: [
    'dashboard', 'documentTemplates', 'dataQuality', 'adminUsersRoles',
    'adminAudit', 'adminBackupSync', 'adminSettings', 'roadmap',
  ],
  punong_barangay: [
    'dashboard', 'residents', 'residentDuplicates', 'residentStatusManagement',
    'residentProfile', 'households', 'documentQueue', 'documentVerification',
    'documentWorkspace', 'documentPreviewRelease', 'collectionReferenceLog',
    'collectionDailyCertification', 'collectionFeesExemptions', 'blotterRegistry',
    'blotterIntake', 'kpCases', 'kpNoticesSchedule', 'kpMinutesSettlement',
    'drrmDashboard', 'drrmEarlyWarning', 'drrmSitrep', 'drrmDana',
    'drrmEvacuationDromic', 'drrmHazardRisk', 'drrmResources',
    'drrmReliefDistribution', 'drrmActions', 'gadDashboard', 'gadAnnexD1',
    'gadAnnexE1', 'gadActivityMonitor', 'gadParticipants',
    'gadBudgetAttribution', 'reports', 'municipalReview', 'reviewComments',
    'complianceSglgb', 'dataQuality', 'roadmap', 'attachments',
  ],
  barangay_secretary: [
    'dashboard', 'residents', 'residentDuplicates', 'residentStatusManagement',
    'residentProfile', 'households', 'documentIntake', 'documentQueue',
    'documentTemplates', 'documentVerification', 'documentWorkspace',
    'documentPreviewRelease', 'collectionReferenceLog', 'blotterRegistry',
    'blotterIntake', 'kpCases', 'kpNoticesSchedule', 'kpMinutesSettlement',
    'drrmDashboard', 'drrmEarlyWarning', 'drrmSitrep', 'drrmDana',
    'drrmEvacuationDromic', 'drrmHazardRisk', 'drrmResources',
    'drrmReliefDistribution', 'drrmActions', 'gadDashboard', 'gadAnnexD1',
    'gadAnnexE1', 'gadActivityMonitor', 'gadParticipants',
    'gadBudgetAttribution', 'reports', 'municipalReview', 'reviewComments',
    'complianceSglgb', 'dataQuality', 'roadmap', 'attachments',
  ],
  barangay_treasurer: [
    'dashboard', 'documentQueue', 'documentVerification', 'documentWorkspace',
    'collectionReferenceLog', 'collectionDailyCertification',
    'collectionFeesExemptions', 'gadBudgetAttribution', 'reports', 'roadmap',
  ],
  drrm_focal: [
    'dashboard', 'drrmDashboard', 'drrmEarlyWarning', 'drrmSitrep', 'drrmDana',
    'drrmEvacuationDromic', 'drrmHazardRisk', 'drrmResources',
    'drrmReliefDistribution', 'drrmActions', 'reports', 'roadmap',
  ],
  gad_focal: [
    'dashboard', 'gadDashboard', 'gadAnnexD1', 'gadAnnexE1',
    'gadActivityMonitor', 'gadParticipants', 'gadBudgetAttribution', 'reports',
    'roadmap',
  ],
  municipal_reviewer: [
    'dashboard', 'reports', 'municipalReview', 'reviewComments',
    'complianceSglgb', 'roadmap',
  ],
  read_only_auditor: [
    'dashboard', 'reports', 'complianceSglgb', 'adminAudit', 'roadmap',
  ],
};

describe('route authorization matrix', () => {
  it('defines a policy for every route access identifier', () => {
    expect(Object.keys(ROUTE_ACCESS).sort()).toEqual(
      [...new Set(PROTECTED_ROUTE_POLICIES.map(policy => policy.id))].sort(),
    );
  });

  it.each(ALL_ROLE_IDS)('enforces the approved matrix for %s', roleId => {
    const expected = new Set(EXPECTED_ALLOWED_ROUTES[roleId]);

    for (const routeId of Object.keys(ROUTE_ACCESS) as RouteAccessId[]) {
      expect(canAccessRoute(roleId, routeId), `${roleId} -> ${routeId}`)
        .toBe(expected.has(routeId));
    }
  });

  it('matches dynamic record routes without granting neighboring paths', () => {
    expect(findRoutePolicy('/residents/R001')?.id).toBe('residentProfile');
    expect(findRoutePolicy('/documents/DOC001/workspace')?.id).toBe('documentWorkspace');
    expect(findRoutePolicy('/documents/DOC001/preview-release')?.id).toBe('documentPreviewRelease');
    expect(findRoutePolicy('/residents/R001/private')).toBeUndefined();
  });

  it('applies the roadmap policy to nested placeholders', () => {
    expect(canAccessPath('read_only_auditor', '/roadmap/future-module')).toBe(true);
    expect(canAccessPath('system_admin', '/residents')).toBe(false);
  });
});
