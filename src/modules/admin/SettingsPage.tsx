import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Settings, MapPin, ToggleRight, AlertCircle } from 'lucide-react';
import { BARANGAY_INFO, PUROKS, FEATURE_FLAGS } from '@/data/mockReferenceData';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

  const toggleFeature = (key: string) => {
    setToggleStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'profile', label: 'Barangay Profile', icon: <Settings size={15} /> },
    { id: 'puroks', label: 'Puroks / Sitio', icon: <MapPin size={15} /> },
    { id: 'features', label: 'Feature Flags', icon: <ToggleRight size={15} /> },
  ];

  const profileRows: { label: string; value: string }[] = [
    { label: 'Barangay Name', value: BARANGAY_INFO.name },
    { label: 'Municipality', value: BARANGAY_INFO.municipality },
    { label: 'Province', value: BARANGAY_INFO.province },
    { label: 'Region', value: BARANGAY_INFO.region },
    { label: 'Punong Barangay', value: BARANGAY_INFO.punongBarangay },
    { label: 'Secretary', value: BARANGAY_INFO.secretary },
    { label: 'Treasurer', value: BARANGAY_INFO.treasurer },
    { label: 'Contact No.', value: BARANGAY_INFO.contactNo },
    { label: 'Email', value: BARANGAY_INFO.email },
  ];

  const featureDescriptions: Record<string, string> = {
    legislativeRecords: 'Complete legislative records system',
    assetsInventory: 'Assets and inventory tracking',
    healthWelfare: 'Health and welfare programs module',
    personnelSkTanodLupon: 'Personnel, SK, Tanod, and Lupon management',
    residentPortal: 'Self-service resident portal',
    onlinePayment: 'Online payment gateway integration',
    fullAccounting: 'Accounting-grade financial module',
    vawcBcpcRestricted: 'VAWC/BCPC restricted records module',
    nationalIntegrations: 'National agency API integrations',
    nativeMobileOffline: 'Native mobile app with offline sync',
    aiAnalytics: 'AI-powered analytics and predictions',
    blockchainAudit: 'Blockchain-based audit anchoring',
  };

  return (
    <PageScaffold
      title="Settings"
      subtitle="System configuration and reference data"
      breadcrumbs={[{ label: 'Admin' }, { label: 'Settings' }]}
      moduleTag="Admin"
      priorityTag="P1"
    >
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {/* Barangay Profile */}
        {activeTab === 'profile' && (
          <Card padding={false}>
            <div className="p-5 border-b border-slate-100 flex items-center gap-2">
              <Settings size={18} className="text-slate-500" />
              <h3 className="font-semibold text-slate-800">Barangay Profile Information</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {profileRows.map(row => (
                <div key={row.label} className="flex items-center px-5 py-3">
                  <dt className="text-sm text-slate-500 w-48 flex-shrink-0">{row.label}</dt>
                  <dd className="text-sm font-medium text-slate-800">{row.value}</dd>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Puroks */}
        {activeTab === 'puroks' && (
          <div className="space-y-4">
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
              <p className="text-sm text-sky-800"><span className="font-semibold">Note:</span> Purok data is reference-only in this prototype. Administrative updates will be managed through a dedicated interface in production.</p>
            </div>
            <Card padding={false}>
              <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                <MapPin size={18} className="text-slate-500" />
                <h3 className="font-semibold text-slate-800">Puroks and Sitios ({PUROKS.length})</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {PUROKS.map(p => (
                  <div key={p.id} className="flex items-center px-5 py-3 gap-4">
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{p.id}</span>
                    <span className="text-sm font-medium text-slate-800">{p.name}</span>
                    <span className="text-xs text-slate-500 ml-auto">{p.sitio}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Feature Flags */}
        {activeTab === 'features' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">P2/P3 Features Deferred</p>
                <p className="text-sm text-amber-800 mt-1">All Phase 2 and Phase 3 features are disabled in this prototype. They will be available in future releases following validation and feasibility assessment.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(FEATURE_FLAGS).map(([key, defaultValue]) => {
                const isEnabled = toggleStates[key] !== undefined ? toggleStates[key] : defaultValue;
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                return (
                  <Card key={key}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 text-sm">{label}</h4>
                      <button
                        onClick={() => toggleFeature(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${isEnabled ? 'bg-forest' : 'bg-slate-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">{featureDescriptions[key] ?? 'Feature flag'}</p>
                    <p className={`text-xs font-semibold uppercase tracking-wide mt-2 ${isEnabled ? 'text-forest' : 'text-slate-400'}`}>
                      {isEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageScaffold>
  );
}
