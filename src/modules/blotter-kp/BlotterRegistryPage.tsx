import { Plus, Eye, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { Button } from '@/components/ui/Button';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusChip, Badge, PrivacyBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { mockBlotterIncidents } from '@/data/mockBlotterKP';
import type { BlotterIncident } from '@/types/blotter';
import { INCIDENT_TYPES } from '@/data/mockReferenceData';
import { formatDateTime } from '@/utils/formatters';

export function BlotterRegistryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [incidentTypeFilter, setIncidentTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<BlotterIncident | null>(null);

  const filtered = mockBlotterIncidents.filter(incident => {
    const matchesSearch =
      !searchTerm ||
      incident.incidentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.parties.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = !incidentTypeFilter || incident.incidentType === incidentTypeFilter;
    const matchesStatus = !statusFilter || incident.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const statuses = ['New', 'Recorded', 'Action Taken', 'Referred', 'Settled', 'Closed'];

  const columns: Column<BlotterIncident>[] = [
    { key: 'incidentNo', header: 'Incident No.', render: i => <span className="font-mono text-sm font-semibold">{i.incidentNo}</span> },
    { key: 'dateTime', header: 'Date/Time', render: i => formatDateTime(i.dateTime) },
    { key: 'location', header: 'Location', render: i => <span className="text-sm">{i.location}</span> },
    { key: 'incidentType', header: 'Type', render: i => i.incidentType },
    {
      key: 'parties',
      header: 'Parties',
      render: i => {
        const complainant = i.parties.find(p => p.role === 'Complainant')?.name || 'Unknown';
        const respondent = i.parties.find(p => p.role === 'Respondent')?.name || 'Unknown';
        return (
          <div className="text-xs">
            <div className="font-semibold text-forest">{complainant}</div>
            <div className="text-slate-600">vs. {respondent}</div>
          </div>
        );
      },
    },
    { key: 'status', header: 'Status', render: i => <StatusChip status={i.status} /> },
    { key: 'isConfidential', header: 'Confidential', render: i => i.isConfidential ? <PrivacyBadge level="Confidential" /> : null },
    {
      key: 'actions',
      header: 'Actions',
      render: i => (
        <Button onClick={() => setSelectedIncident(i)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1">
          <Eye size={14} />
          View
        </Button>
      ),
    },
  ];

  return (
    <PageScaffold
      title="Blotter Registry"
      subtitle="Manage and track all reported incidents"
      breadcrumbs={[{ label: 'Blotter & KP' }, { label: 'Registry' }]}
      moduleTag="Blotter"
      priorityTag="P0"
    >
      {/* Confidentiality Notice */}
      <Card className="mb-6 bg-amber-50 border-amber-200">
        <div className="p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">Confidentiality Notice</p>
            <p className="text-sm text-amber-800 mt-1">
              Cases involving VAWC (Violence Against Women and Children) or BCPC (Barangay Council for the Protection of Children) are handled through a separate protocol and are not recorded in this general blotter registry.
            </p>
          </div>
        </div>
      </Card>

      {/* New Incident Button */}
      <div className="mb-6 flex justify-end">
        <Button className="bg-forest hover:bg-forest-dark text-white flex items-center gap-2">
          <Plus size={18} />
          New Incident
        </Button>
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by incident no., location, or party names..."
        filters={
          <>
            <select value={incidentTypeFilter} onChange={e => setIncidentTypeFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
              <option value="">All Incident Types</option>
              {INCIDENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
              <option value="">All Statuses</option>
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </>
        }
      />

      {/* Status Flow Reference */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-600 font-semibold mb-2 uppercase">Status Flow:</p>
        <div className="flex flex-wrap gap-2">
          {['New', 'Recorded', 'Action Taken', 'Referred/Settled/Closed'].map((status, idx) => (
            <div key={status} className="flex items-center gap-2">
              <span className="inline-block px-2 py-1 bg-white border border-blue-200 rounded text-xs font-medium text-blue-700">
                {status}
              </span>
              {idx < 3 && <span className="text-blue-400">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={filtered} rowKey={i => i.id} emptyMessage="No incidents match your filters." />
      </div>

      {/* Detail Panel Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                {selectedIncident.incidentNo}
              </h2>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Type</p>
                  <p className="font-semibold text-slate-800">{selectedIncident.incidentType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Status</p>
                  <StatusChip status={selectedIncident.status} />
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Date & Time</p>
                <p className="font-semibold text-slate-800">{formatDateTime(selectedIncident.dateTime)}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Location</p>
                <p className="font-semibold text-slate-800">{selectedIncident.location}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Parties</p>
                <div className="space-y-2 mt-2">
                  {selectedIncident.parties.map((party, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200">
                      <p className="text-xs text-slate-500 font-semibold uppercase">{party.role}</p>
                      <p className="font-semibold text-slate-800">{party.name}</p>
                      <p className="text-sm text-slate-600">{party.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Narrative Summary</p>
                <p className="text-slate-700">{selectedIncident.narrativeSummary}</p>
              </div>

              {selectedIncident.actionTaken && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Action Taken</p>
                  <p className="text-slate-700">{selectedIncident.actionTaken}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Encoded By</p>
                <p className="font-semibold text-slate-800">{selectedIncident.encodedBy}</p>
              </div>

              {selectedIncident.isConfidential && (
                <div className="p-3 bg-slate-100 border border-slate-300 rounded">
                  <p className="text-sm text-slate-700 font-semibold flex items-center gap-2">
                    <PrivacyBadge level="Confidential" />
                    This incident is marked as confidential
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </PageScaffold>
  );
}
