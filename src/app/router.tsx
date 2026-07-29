import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, type ComponentType, type ReactNode } from 'react';
import { AppShell } from '@/layouts/AppShell';
import { useRole } from '@/app/providers/RoleProvider';
import { ROLE_HOME } from '@/utils/constants';
import { RouteGuard } from '@/components/shared/RouteGuard';
import { PrototypeDisclosure } from '@/components/shared/PrototypeDisclosure';
import type { RouteAccessId } from '@/utils/routeAccess';

function RoleLandingRedirect() {
  const { roleId } = useRole();
  if (!roleId) return <Navigate to="/login-demo" replace />;
  return <Navigate to={ROLE_HOME[roleId]} replace />;
}

function guard(routeId: RouteAccessId, element: ReactNode) {
  return <RouteGuard routeId={routeId}>{element}</RouteGuard>;
}

function publicPrototypePage(element: ReactNode) {
  return (
    <>
      <PrototypeDisclosure />
      {element}
    </>
  );
}

function lazyNamed(
  loader: () => Promise<unknown>,
  exportName: string,
) {
  return lazy(async () => {
    const loadedModule = await loader() as Record<string, unknown>;
    return { default: loadedModule[exportName] as ComponentType };
  });
}

// Each screen is loaded only when its route is visited. AppShell and access
// controls remain in the entry bundle so authorization runs before page render.
const RoleSelectorPage = lazyNamed(() => import('@/modules/auth/RoleSelectorPage'), 'RoleSelectorPage');
const AccessDeniedPage = lazyNamed(() => import('@/modules/auth/AccessDeniedPage'), 'AccessDeniedPage');
const ExecutiveDashboardPage = lazyNamed(() => import('@/modules/dashboard/ExecutiveDashboardPage'), 'ExecutiveDashboardPage');
const ResidentRegistryPage = lazyNamed(() => import('@/modules/residents/ResidentRegistryPage'), 'ResidentRegistryPage');
const ResidentProfilePage = lazyNamed(() => import('@/modules/residents/ResidentProfilePage'), 'ResidentProfilePage');
const HouseholdRegistryPage = lazyNamed(() => import('@/modules/residents/HouseholdRegistryPage'), 'HouseholdRegistryPage');
const ResidentDuplicateReviewPage = lazyNamed(() => import('@/modules/residents/ResidentDuplicateReviewPage'), 'ResidentDuplicateReviewPage');
const ResidentStatusManagementPage = lazyNamed(() => import('@/modules/residents/ResidentStatusManagementPage'), 'ResidentStatusManagementPage');
const DocumentRequestIntakePage = lazyNamed(() => import('@/modules/documents/DocumentRequestIntakePage'), 'DocumentRequestIntakePage');
const DocumentQueuePage = lazyNamed(() => import('@/modules/documents/DocumentQueuePage'), 'DocumentQueuePage');
const DocumentWorkspacePage = lazyNamed(() => import('@/modules/documents/DocumentWorkspacePage'), 'DocumentWorkspacePage');
const DocumentPreviewReleasePage = lazyNamed(() => import('@/modules/documents/DocumentPreviewReleasePage'), 'DocumentPreviewReleasePage');
const DocumentTemplateManagerPage = lazyNamed(() => import('@/modules/documents/DocumentTemplateManagerPage'), 'DocumentTemplateManagerPage');
const DocumentVerificationPage = lazyNamed(() => import('@/modules/documents/DocumentVerificationPage'), 'DocumentVerificationPage');
const CollectionReferenceLogPage = lazyNamed(() => import('@/modules/collections/CollectionReferenceLogPage'), 'CollectionReferenceLogPage');
const DailyCollectionCertificationPage = lazyNamed(() => import('@/modules/collections/DailyCollectionCertificationPage'), 'DailyCollectionCertificationPage');
const FeeTableExemptionPage = lazyNamed(() => import('@/modules/collections/FeeTableExemptionPage'), 'FeeTableExemptionPage');
const BlotterRegistryPage = lazyNamed(() => import('@/modules/blotter-kp/BlotterRegistryPage'), 'BlotterRegistryPage');
const BlotterIntakePage = lazyNamed(() => import('@/modules/blotter-kp/BlotterIntakePage'), 'BlotterIntakePage');
const KPCaseTrackerPage = lazyNamed(() => import('@/modules/blotter-kp/KPCaseTrackerPage'), 'KPCaseTrackerPage');
const KPNoticesSchedulePage = lazyNamed(() => import('@/modules/blotter-kp/KPNoticesSchedulePage'), 'KPNoticesSchedulePage');
const KPMinutesSettlementPage = lazyNamed(() => import('@/modules/blotter-kp/KPMinutesSettlementPage'), 'KPMinutesSettlementPage');
const DRRMDashboardPage = lazyNamed(() => import('@/modules/drrm/DRRMDashboardPage'), 'DRRMDashboardPage');
const EarlyWarningPreparednessPage = lazyNamed(() => import('@/modules/drrm/EarlyWarningPreparednessPage'), 'EarlyWarningPreparednessPage');
const SitRepBuilderPage = lazyNamed(() => import('@/modules/drrm/SitRepBuilderPage'), 'SitRepBuilderPage');
const DANAFormPage = lazyNamed(() => import('@/modules/drrm/DANAFormPage'), 'DANAFormPage');
const EvacuationDromicPage = lazyNamed(() => import('@/modules/drrm/EvacuationDromicPage'), 'EvacuationDromicPage');
const HazardRiskRegisterPage = lazyNamed(() => import('@/modules/drrm/HazardRiskRegisterPage'), 'HazardRiskRegisterPage');
const DRRMResourcesPage = lazyNamed(() => import('@/modules/drrm/DRRMResourcesPage'), 'DRRMResourcesPage');
const ReliefDistributionPage = lazyNamed(() => import('@/modules/drrm/ReliefDistributionPage'), 'ReliefDistributionPage');
const BDRRMCActionTrackerPage = lazyNamed(() => import('@/modules/drrm/BDRRMCActionTrackerPage'), 'BDRRMCActionTrackerPage');
const GADDashboardPage = lazyNamed(() => import('@/modules/gad/GADDashboardPage'), 'GADDashboardPage');
const AnnexD1WorkspacePage = lazyNamed(() => import('@/modules/gad/AnnexD1WorkspacePage'), 'AnnexD1WorkspacePage');
const AnnexE1WorkspacePage = lazyNamed(() => import('@/modules/gad/AnnexE1WorkspacePage'), 'AnnexE1WorkspacePage');
const GADActivityMonitorPage = lazyNamed(() => import('@/modules/gad/GADActivityMonitorPage'), 'GADActivityMonitorPage');
const ParticipantLogPage = lazyNamed(() => import('@/modules/gad/ParticipantLogPage'), 'ParticipantLogPage');
const GADBudgetAttributionPage = lazyNamed(() => import('@/modules/gad/GADBudgetAttributionPage'), 'GADBudgetAttributionPage');
const ReportsExportCenterPage = lazyNamed(() => import('@/modules/reports/ReportsExportCenterPage'), 'ReportsExportCenterPage');
const MunicipalReviewDashboardPage = lazyNamed(() => import('@/modules/reports/MunicipalReviewDashboardPage'), 'MunicipalReviewDashboardPage');
const ReviewerCommentLoopPage = lazyNamed(() => import('@/modules/reports/ReviewerCommentLoopPage'), 'ReviewerCommentLoopPage');
const ComplianceChecklistPage = lazyNamed(() => import('@/modules/reports/ComplianceChecklistPage'), 'ComplianceChecklistPage');
const DataQualityDashboardPage = lazyNamed(() => import('@/modules/reports/DataQualityDashboardPage'), 'DataQualityDashboardPage');
const UserRoleAdminPage = lazyNamed(() => import('@/modules/admin/UserRoleAdminPage'), 'UserRoleAdminPage');
const AuditTrailViewerPage = lazyNamed(() => import('@/modules/admin/AuditTrailViewerPage'), 'AuditTrailViewerPage');
const BackupSyncMonitorPage = lazyNamed(() => import('@/modules/admin/BackupSyncMonitorPage'), 'BackupSyncMonitorPage');
const SettingsPage = lazyNamed(() => import('@/modules/admin/SettingsPage'), 'SettingsPage');
const FutureModulesPage = lazyNamed(() => import('@/modules/roadmap/FutureModulesPage'), 'FutureModulesPage');

export const router = createBrowserRouter([
  // Public routes (no AppShell)
  { path: '/login-demo', element: publicPrototypePage(<RoleSelectorPage />) },
  { path: '/public/verify', element: publicPrototypePage(<DocumentVerificationPage />) },

  // Protected routes (with AppShell)
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <RoleLandingRedirect /> },
      { path: 'access-denied', element: <AccessDeniedPage /> },
      { path: 'dashboard', element: guard('dashboard', <ExecutiveDashboardPage />) },

      // Residents
      { path: 'residents', element: guard('residents', <ResidentRegistryPage />) },
      { path: 'residents/duplicates', element: guard('residentDuplicates', <ResidentDuplicateReviewPage />) },
      { path: 'residents/status-management', element: guard('residentStatusManagement', <ResidentStatusManagementPage />) },
      { path: 'residents/:id', element: guard('residentProfile', <ResidentProfilePage />) },
      { path: 'households', element: guard('households', <HouseholdRegistryPage />) },

      // Documents
      { path: 'documents/intake', element: guard('documentIntake', <DocumentRequestIntakePage />) },
      { path: 'documents/queue', element: guard('documentQueue', <DocumentQueuePage />) },
      { path: 'documents/templates', element: guard('documentTemplates', <DocumentTemplateManagerPage />) },
      { path: 'documents/verification', element: guard('documentVerification', <DocumentVerificationPage />) },
      { path: 'documents/:id/workspace', element: guard('documentWorkspace', <DocumentWorkspacePage />) },
      { path: 'documents/:id/preview-release', element: guard('documentPreviewRelease', <DocumentPreviewReleasePage />) },

      // Collections
      { path: 'collections/reference-log', element: guard('collectionReferenceLog', <CollectionReferenceLogPage />) },
      { path: 'collections/daily-certification', element: guard('collectionDailyCertification', <DailyCollectionCertificationPage />) },
      { path: 'collections/fees-exemptions', element: guard('collectionFeesExemptions', <FeeTableExemptionPage />) },

      // Blotter & KP
      { path: 'blotter', element: guard('blotterRegistry', <BlotterRegistryPage />) },
      { path: 'blotter/intake', element: guard('blotterIntake', <BlotterIntakePage />) },
      { path: 'kp-cases', element: guard('kpCases', <KPCaseTrackerPage />) },
      { path: 'kp/notices-schedule', element: guard('kpNoticesSchedule', <KPNoticesSchedulePage />) },
      { path: 'kp/minutes-settlement', element: guard('kpMinutesSettlement', <KPMinutesSettlementPage />) },

      // DRRM
      { path: 'drrm', element: guard('drrmDashboard', <DRRMDashboardPage />) },
      { path: 'drrm/early-warning', element: guard('drrmEarlyWarning', <EarlyWarningPreparednessPage />) },
      { path: 'drrm/sitrep', element: guard('drrmSitrep', <SitRepBuilderPage />) },
      { path: 'drrm/dana', element: guard('drrmDana', <DANAFormPage />) },
      { path: 'drrm/evacuation-dromic', element: guard('drrmEvacuationDromic', <EvacuationDromicPage />) },
      { path: 'drrm/hazard-risk', element: guard('drrmHazardRisk', <HazardRiskRegisterPage />) },
      { path: 'drrm/resources', element: guard('drrmResources', <DRRMResourcesPage />) },
      { path: 'drrm/relief-distribution', element: guard('drrmReliefDistribution', <ReliefDistributionPage />) },
      { path: 'drrm/actions', element: guard('drrmActions', <BDRRMCActionTrackerPage />) },

      // GAD
      { path: 'gad', element: guard('gadDashboard', <GADDashboardPage />) },
      { path: 'gad/annex-d1', element: guard('gadAnnexD1', <AnnexD1WorkspacePage />) },
      { path: 'gad/annex-e1', element: guard('gadAnnexE1', <AnnexE1WorkspacePage />) },
      { path: 'gad/activity-monitor', element: guard('gadActivityMonitor', <GADActivityMonitorPage />) },
      { path: 'gad/participants', element: guard('gadParticipants', <ParticipantLogPage />) },
      { path: 'gad/budget-attribution', element: guard('gadBudgetAttribution', <GADBudgetAttributionPage />) },

      // Reports & Review
      { path: 'reports', element: guard('reports', <ReportsExportCenterPage />) },
      { path: 'review/municipal-city', element: guard('municipalReview', <MunicipalReviewDashboardPage />) },
      { path: 'review/comments', element: guard('reviewComments', <ReviewerCommentLoopPage />) },
      { path: 'compliance/sglgb', element: guard('complianceSglgb', <ComplianceChecklistPage />) },
      { path: 'data-quality', element: guard('dataQuality', <DataQualityDashboardPage />) },

      // Admin
      { path: 'admin/users-roles', element: guard('adminUsersRoles', <UserRoleAdminPage />) },
      { path: 'admin/audit', element: guard('adminAudit', <AuditTrailViewerPage />) },
      { path: 'admin/backup-sync', element: guard('adminBackupSync', <BackupSyncMonitorPage />) },
      { path: 'admin/settings', element: guard('adminSettings', <SettingsPage />) },

      // Roadmap
      { path: 'roadmap', element: guard('roadmap', <FutureModulesPage />) },
      // Individual roadmap placeholders redirect to main roadmap
      { path: 'roadmap/*', element: guard('roadmap', <FutureModulesPage />) },

      // Attachments (placeholder)
      { path: 'attachments', element: guard('attachments', <Navigate to="/residents" replace />) },
    ],
  },

  // Catch-all redirect
  { path: '*', element: <Navigate to="/login-demo" replace /> },
]);
