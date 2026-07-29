import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { StatusChip, Badge } from '@/components/ui/Badge';
import { getDisasterEvent, getOperationalPeriod, mockEarlyWarnings } from '@/data/mockDRRM';
import { formatDateTime } from '@/utils/formatters';

export function EarlyWarningPreparednessPage() {
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = mockEarlyWarnings.filter(alert => {
    const matchesSeverity = !severityFilter || alert.severity === severityFilter;
    const matchesStatus = !statusFilter || alert.status === statusFilter;
    return matchesSeverity && matchesStatus;
  });

  const severities = ['Critical', 'High', 'Moderate', 'Low'];
  const statuses = ['Active', 'Lifted', 'Escalated'];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'High':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <PageScaffold
      title="Early Warning Preparedness"
      subtitle="Monitor weather and natural hazard alerts"
      breadcrumbs={[{ label: 'DRRM' }, { label: 'Early Warnings' }]}
      moduleTag="DRRM"
      priorityTag="P0"
    >
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Filter by Severity:</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <option value="">All Severities</option>
            {severities.map(sev => (
              <option key={sev} value={sev}>{sev}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Alert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(alert => (
          <Card key={alert.id} className={getSeverityColor(alert.severity)}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-base">{alert.alertType}</h3>
                    <Badge
                      label={alert.severity}
                      variant="default"
                      className={`text-xs mt-1 ${getSeverityColor(alert.severity)}`}
                    />
                  </div>
                </div>
                <StatusChip status={alert.status} />
              </div>

              {/* Message */}
              <p className="text-sm leading-relaxed mb-4 font-semibold opacity-90">{alert.message}</p>

              {/* Affected Areas */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase mb-2 opacity-75">Affected Areas</p>
                <div className="flex flex-wrap gap-1">
                  {alert.affectedAreas.map((area, idx) => (
                    <Badge key={idx} label={area} variant="default" className="text-xs opacity-75" />
                  ))}
                </div>
              </div>

              {/* Actions Advised */}
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase mb-2 opacity-75">Actions Advised</p>
                <ul className="text-xs space-y-1 ml-3 list-disc opacity-90">
                  {alert.actionsAdvised.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              </div>

              {/* Source & Issued By */}
              <div className="border-t border-current border-opacity-20 pt-3 space-y-1 text-xs opacity-75">
                <p><span className="font-semibold">Event:</span> {getDisasterEvent(alert.eventId)?.name ?? 'Unknown event'}</p>
                <p><span className="font-semibold">Operational period:</span> {getOperationalPeriod(alert.operationalPeriodId)?.periodNo ?? '—'}</p>
                <p><span className="font-semibold">Source:</span> {alert.source}</p>
                <p><span className="font-semibold">Issued by:</span> {alert.issuedBy}</p>
                <p><span className="font-semibold">Date:</span> {formatDateTime(alert.issuedAt)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <Card className="text-center py-12 bg-slate-50 border-slate-200">
          <AlertTriangle size={40} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600 font-medium">No alerts match your filters</p>
        </Card>
      )}
    </PageScaffold>
  );
}
