import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Home, FileText, Tag, Paperclip, Activity } from 'lucide-react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Button } from '@/components/ui/Button';
import { StatusChip, Badge, PrivacyBadge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Card } from '@/components/ui/Card';
import { Timeline, type TimelineEvent } from '@/components/ui/Timeline';
import { useMockData } from '@/app/providers/MockDataProvider';
import { useAudit } from '@/app/providers/AuditProvider';
import { formatDate } from '@/utils/formatters';
import { mockHouseholds } from '@/data/mockHouseholds';
import { useState } from 'react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <User size={14} /> },
  { id: 'household', label: 'Household', icon: <Home size={14} /> },
  { id: 'documents', label: 'Documents', icon: <FileText size={14} /> },
  { id: 'tags', label: 'Tags', icon: <Tag size={14} /> },
  { id: 'attachments', label: 'Attachments', icon: <Paperclip size={14} /> },
  { id: 'activity', label: 'Activity', icon: <Activity size={14} /> },
];

export function ResidentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { residents, documentRequests } = useMockData();
  const { events } = useAudit();
  const [activeTab, setActiveTab] = useState('overview');

  const resident = residents.find(r => r.id === id);
  if (!resident) {
    return (
      <PageScaffold title="Resident Not Found" breadcrumbs={[{ label: 'Residents', href: '/residents' }, { label: 'Not Found' }]}>
        <p className="text-slate-500">The resident record could not be found.</p>
        <Button variant="secondary" onClick={() => navigate('/residents')} className="mt-4"><ArrowLeft size={15} /> Back to Registry</Button>
      </PageScaffold>
    );
  }

  const household = resident.householdId ? mockHouseholds.find(h => h.id === resident.householdId) : null;
  const residentDocs = documentRequests.filter(d => d.residentId === resident.id);
  const residentAudit = events.filter(e => e.recordId === resident.id);

  const timelineEvents: TimelineEvent[] = residentAudit.map(e => ({
    id: e.id, label: e.action, description: e.description, timestamp: e.timestamp, actor: e.userName,
  }));

  return (
    <PageScaffold
      title={`${resident.lastName}, ${resident.firstName} ${resident.middleName}`}
      subtitle={`${resident.residentNo} · ${resident.purok}`}
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Residents', href: '/residents' }, { label: resident.lastName }]}
      moduleTag="Residents"
      priorityTag="P0"
      actions={
        <Button variant="secondary" size="sm" onClick={() => navigate('/residents')}>
          <ArrowLeft size={14} /> Back
        </Button>
      }
    >
      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-xl border border-slate-200">
        <StatusChip status={resident.status} />
        <PrivacyBadge level={resident.privacyLevel} />
        {resident.isVoter && <Badge label="Registered Voter" variant="success" />}
        <span className="text-sm text-slate-500">Registered: {formatDate(resident.registeredAt)}</span>
        <span className="text-sm text-slate-500">Updated: {formatDate(resident.updatedAt)}</span>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-5">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <h3 className="font-semibold text-slate-800 mb-4">Personal Information</h3>
              <dl className="space-y-3">
                {[
                  ['Full Name', `${resident.lastName}, ${resident.firstName} ${resident.middleName}`],
                  ['Sex', resident.sex],
                  ['Birth Date', formatDate(resident.birthDate)],
                  ['Age / Age Group', `${resident.age} yrs · ${resident.ageGroup}`],
                  ['Civil Status', resident.civilStatus],
                  ['Contact No.', resident.contactNumber || '—'],
                  ['Email', resident.emailAddress || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-3">
                    <dt className="text-xs text-slate-500 w-32 flex-shrink-0 pt-0.5">{label}</dt>
                    <dd className="text-sm text-slate-800 font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
            <Card>
              <h3 className="font-semibold text-slate-800 mb-4">Address & Location</h3>
              <dl className="space-y-3">
                {[
                  ['Address', resident.address],
                  ['Purok / Sitio', resident.purok],
                  ['Household ID', resident.householdId || 'Not assigned'],
                  ['Relationship to Head', resident.relationshipToHead || '—'],
                  ['Voter Status', resident.isVoter ? 'Registered Voter' : 'Not registered'],
                  ['Precinct', resident.precinct || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-3">
                    <dt className="text-xs text-slate-500 w-36 flex-shrink-0 pt-0.5">{label}</dt>
                    <dd className="text-sm text-slate-800 font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              {resident.remarks && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-medium text-amber-700">Remarks</p>
                  <p className="text-sm text-amber-800 mt-0.5">{resident.remarks}</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'household' && (
          <Card>
            <h3 className="font-semibold text-slate-800 mb-4">Household Information</h3>
            {household ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    ['Household No.', household.householdNo],
                    ['Household Head', household.headName],
                    ['Address', household.address],
                    ['Purok', household.purok],
                    ['Income Category', household.incomeCategory],
                    ['Livelihood', household.livelihood || '—'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="text-sm font-medium text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Members ({household.members.length})</p>
                  <div className="space-y-2">
                    {household.members.map(m => (
                      <div key={m.residentId} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-forest/10 rounded-full flex items-center justify-center text-forest text-xs font-bold">{m.name[0]}</div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{m.name}</p>
                          <p className="text-xs text-slate-500">{m.relationship} · {m.age} yrs · {m.sex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {household.riskFlags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {household.riskFlags.map(f => <Badge key={f} label={f} variant="warning" />)}
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-400 text-sm">No household assignment found.</p>
            )}
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <h3 className="font-semibold text-slate-800 mb-4">Document Requests ({residentDocs.length})</h3>
            {residentDocs.length === 0 ? (
              <p className="text-slate-400 text-sm">No document requests found for this resident.</p>
            ) : (
              <div className="space-y-3">
                {residentDocs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{doc.documentType}</p>
                      <p className="text-xs text-slate-500">{doc.requestNo} · {doc.purpose}</p>
                    </div>
                    <StatusChip status={doc.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'tags' && (
          <Card>
            <h3 className="font-semibold text-slate-800 mb-4">Sector Tags</h3>
            {resident.sectorTags.length === 0 ? (
              <p className="text-slate-400 text-sm">No sector tags assigned.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {resident.sectorTags.map(t => <Badge key={t} label={t} variant="info" />)}
              </div>
            )}
          </Card>
        )}

        {activeTab === 'attachments' && (
          <Card>
            <h3 className="font-semibold text-slate-800 mb-4">Attachments</h3>
            <div className="text-center py-8 text-slate-400">
              <Paperclip size={28} className="mx-auto mb-2" />
              <p className="text-sm">Attachment upload is a placeholder in this prototype.</p>
              <p className="text-xs mt-1">Backend: integrate with file storage module in production.</p>
            </div>
          </Card>
        )}

        {activeTab === 'activity' && (
          <Card>
            <h3 className="font-semibold text-slate-800 mb-4">Activity / Audit Trail</h3>
            {timelineEvents.length === 0 ? (
              <p className="text-slate-400 text-sm">No activity recorded for this resident yet.</p>
            ) : (
              <Timeline events={timelineEvents} />
            )}
          </Card>
        )}
      </div>
    </PageScaffold>
  );
}
