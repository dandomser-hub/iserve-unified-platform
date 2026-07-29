import { Users, Home, FileText, CheckCircle, Wallet, Scale, AlertTriangle, Heart, BarChart2, Shield, Activity, Star } from 'lucide-react';
import { StatCard } from '@/components/ui/Card';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { StatusChip } from '@/components/ui/Badge';
import { useAudit } from '@/app/providers/AuditProvider';
import { useMockData } from '@/app/providers/MockDataProvider';
import { useCurrentRole } from '@/app/providers/RoleProvider';
import { mockIssuedDocuments } from '@/data/mockDocuments';
import { mockCollectionRecords } from '@/data/mockCollections';
import { mockBlotterIncidents, mockKPCases } from '@/data/mockBlotterKP';
import { mockEarlyWarnings, mockSitReps } from '@/data/mockDRRM';
import { mockAnnexD1Items, mockAnnexE1Items } from '@/data/mockGAD';
import { mockComplianceItems, mockDataQualityIssues } from '@/data/mockReports';
import { formatDateTime, formatCurrency } from '@/utils/formatters';
import { BARANGAY_INFO } from '@/data/mockReferenceData';
import { canAccessRoute, type RouteAccessId } from '@/utils/routeAccess';

export function ExecutiveDashboardPage() {
  const { residents, households, documentRequests } = useMockData();
  const { events: auditEvents } = useAudit();
  const currentRole = useCurrentRole();
  const mayAccess = (routeId: RouteAccessId) =>
    currentRole ? canAccessRoute(currentRole.id, routeId) : false;

  // Derived metrics
  const pendingDocs = documentRequests.filter(d => !['Released', 'Cancelled'].includes(d.status)).length;
  const releasedDocs = mockIssuedDocuments.length;
  const todayCollections = mockCollectionRecords.filter(c => c.transactionDate === '2024-06-15').length;
  const collectionTotal = mockCollectionRecords.reduce((sum, c) => sum + c.amount, 0);
  const openBlotter = mockBlotterIncidents.filter(b => !['Settled', 'Closed'].includes(b.status)).length;
  const openKP = mockKPCases.filter(k => !['Settled', 'Closed'].includes(k.status)).length;
  const activeAlerts = mockEarlyWarnings.filter(e => e.status === 'Active').length;
  const activeSitreps = mockSitReps.filter(s => ['Draft', 'For Review', 'Approved'].includes(s.status)).length;
  const d1InProgress = mockAnnexD1Items.filter(i => i.status === 'In Progress' || i.status === 'Completed').length;
  const d1Total = mockAnnexD1Items.length;
  const e1Submitted = mockAnnexE1Items.filter(i => ['Submitted', 'Accepted'].includes(i.status)).length;
  const e1Total = mockAnnexE1Items.length;
  const compliantItems = mockComplianceItems.filter(c => c.status === 'Compliant').length;
  const totalCompliance = mockComplianceItems.length;
  const openIssues = mockDataQualityIssues.filter(d => d.status === 'Open').length;
  const activeResidents = residents.filter(r => r.status === 'Active').length;

  const recentAudit = auditEvents.slice(0, 6);

  return (
    <PageScaffold
      title="Dashboard"
      subtitle={`${BARANGAY_INFO.name} · ${BARANGAY_INFO.municipality} · ${BARANGAY_INFO.province}`}
      breadcrumbs={[{ label: 'Dashboard' }]}
      moduleTag="Dashboard"
      priorityTag="P0"
    >
      {/* Role greeting */}
      {currentRole && (
        <div className="mb-6 p-4 bg-gradient-to-r from-forest/5 to-ocean/5 border border-forest/10 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Star size={18} className="text-forest" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Active Role: {currentRole.label}</p>
            <p className="text-xs text-slate-500">Viewing your authorized dashboard for {BARANGAY_INFO.name}</p>
          </div>
          <div className="ml-auto hidden sm:block text-right">
            <p className="text-xs text-slate-400">Last updated</p>
            <p className="text-xs font-medium text-slate-600">{formatDateTime(new Date().toISOString())}</p>
          </div>
        </div>
      )}

      {/* Metric grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {mayAccess('residents') && (
          <StatCard title="Active Residents" value={activeResidents} subtitle={`${residents.length} total registered`} icon={<Users size={20} />} color="forest" />
        )}
        {mayAccess('households') && (
          <StatCard title="Households" value={households.length} subtitle="Registered households" icon={<Home size={20} />} color="grass" />
        )}
        {mayAccess('documentQueue') && (
          <>
            <StatCard title="Pending Documents" value={pendingDocs} subtitle="Awaiting action" icon={<FileText size={20} />} color="amber" />
            <StatCard title="Released Documents" value={releasedDocs} subtitle="Total issued" icon={<CheckCircle size={20} />} color="ocean" />
          </>
        )}
        {mayAccess('collectionReferenceLog') && (
          <StatCard title="Collection Ref. Total" value={formatCurrency(collectionTotal)} subtitle={`${mockCollectionRecords.length} entries`} icon={<Wallet size={20} />} color="slate" />
        )}
        {mayAccess('blotterRegistry') && (
          <StatCard title="Open Blotter / KP" value={`${openBlotter} / ${openKP}`} subtitle="Active cases" icon={<Scale size={20} />} color="amber" />
        )}
        {mayAccess('drrmDashboard') && (
          <>
            <StatCard title="Active DRRM Alerts" value={activeAlerts} subtitle={`${activeSitreps} active SitRep(s)`} icon={<AlertTriangle size={20} />} color={activeAlerts > 0 ? 'red' : 'slate'} />
            <StatCard title="SitRep / DANA" value={`${activeSitreps} Active`} subtitle="In workflow" icon={<AlertTriangle size={20} />} color="sky" />
          </>
        )}
        {mayAccess('gadDashboard') && (
          <>
            <StatCard title="GAD Annex D-1" value={`${d1InProgress}/${d1Total}`} subtitle="Activities in progress" icon={<Heart size={20} />} color="grass" />
            <StatCard title="GAD Annex E-1" value={`${e1Submitted}/${e1Total}`} subtitle="Accomplishments submitted" icon={<BarChart2 size={20} />} color="ocean" />
          </>
        )}
        {mayAccess('complianceSglgb') && (
          <StatCard title="SGLGB Compliance" value={`${compliantItems}/${totalCompliance}`} subtitle="Items compliant" icon={<Shield size={20} />} color={compliantItems >= totalCompliance * 0.8 ? 'grass' : 'amber'} />
        )}
        {mayAccess('dataQuality') && (
          <StatCard title="Data Quality Issues" value={openIssues} subtitle="Open issues" icon={<Activity size={20} />} color={openIssues > 3 ? 'red' : 'slate'} />
        )}
      </div>

      {/* Bottom row: compliance summary + activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SGLGB Quick Summary */}
        {mayAccess('complianceSglgb') && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm">SGLGB Compliance Summary</h3>
              <span className="text-xs text-slate-400">Quick view</span>
            </div>
            <div className="p-5 space-y-2">
              {mockComplianceItems.slice(0, 8).map(item => (
                <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-700 truncate flex-1 mr-3">{item.item}</span>
                  <StatusChip status={item.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Audit Activity */}
        {mayAccess('adminAudit') && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 text-sm">Recent Audit Activity</h3>
              <span className="text-xs text-slate-400">Latest events</span>
            </div>
            <div className="p-5 space-y-3">
              {recentAudit.map(event => (
                <div key={event.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-forest/40 flex-shrink-0 mt-1.5" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{event.description}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{event.userName} · {formatDateTime(event.timestamp)}</p>
                  </div>
                </div>
              ))}
              {recentAudit.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No recent activity.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DRRM active alerts banner */}
      {mayAccess('drrmDashboard') && activeAlerts > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-semibold text-red-800">{activeAlerts} Active DRRM Alert(s)</p>
            <p className="text-xs text-red-600">Check the DRRM module for early warning details and required actions.</p>
          </div>
        </div>
      )}
    </PageScaffold>
  );
}
