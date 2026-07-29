import { useState, useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, PrivacyBadge } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { useAudit } from '@/app/providers/AuditProvider';
import { formatDateTime } from '@/utils/formatters';
import { Activity, Shield, Clock, Database } from 'lucide-react';
import type { AuditEvent } from '@/types/audit';

export function AuditTrailViewerPage() {
  const { events } = useAudit();
  const [searchValue, setSearchValue] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const filtered = useMemo(() => {
    const q = searchValue.toLowerCase();
    return events
      .filter(e => {
        const matchSearch = !q ||
          e.userName.toLowerCase().includes(q) ||
          e.userRole.toLowerCase().includes(q) ||
          e.module.toLowerCase().includes(q) ||
          (e.recordLabel ?? '').toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q);
        const matchModule = !moduleFilter || e.module === moduleFilter;
        const matchAction = !actionFilter || e.action === actionFilter;
        return matchSearch && matchModule && matchAction;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [events, searchValue, moduleFilter, actionFilter]);

  const uniqueModules = useMemo(() => [...new Set(events.map(e => e.module))].sort(), [events]);
  const uniqueActions = useMemo(() => [...new Set(events.map(e => e.action))].sort(), [events]);

  const todayCount = events.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length;

  const columns: Column<AuditEvent>[] = [
    { key: 'timestamp', header: 'Timestamp', render: e => <span className="text-xs text-slate-600 whitespace-nowrap">{formatDateTime(e.timestamp)}</span> },
    { key: 'userName', header: 'User', render: e => <span className="text-sm font-medium">{e.userName}</span> },
    { key: 'userRole', header: 'Role', render: e => <span className="text-xs text-slate-600">{e.userRole}</span> },
    { key: 'action', header: 'Action', render: e => <Badge label={e.action} variant="info" /> },
    { key: 'module', header: 'Module', render: e => <Badge label={e.module} variant="default" /> },
    { key: 'recordLabel', header: 'Record', render: e => <span className="text-xs text-slate-600">{e.recordLabel ?? '—'}</span> },
    { key: 'description', header: 'Description', render: e => <span className="text-xs text-slate-700 block max-w-xs truncate" title={e.description}>{e.description}</span> },
    { key: 'privacyLevel', header: 'Privacy', render: e => <PrivacyBadge level={e.privacyLevel} /> },
  ];

  return (
    <PageScaffold
      title="Audit Trail Viewer"
      subtitle="System activity and change log"
      breadcrumbs={[{ label: 'Admin' }, { label: 'Audit Trail' }]}
      moduleTag="Admin"
      priorityTag="P1"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Events" value={events.length} subtitle="All recorded" icon={<Activity size={20} />} color="forest" />
        <StatCard title="Modules" value={uniqueModules.length} subtitle="Unique modules" icon={<Shield size={20} />} color="ocean" />
        <StatCard title="Event Types" value={uniqueActions.length} subtitle="Action types" icon={<Database size={20} />} color="grass" />
        <StatCard title="Today" value={todayCount} subtitle="Events this session" icon={<Clock size={20} />} color="sky" />
      </div>

      {/* Filters */}
      <SearchFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search by user, module, record, or description..."
        filters={
          <>
            <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none">
              <option value="">All Modules</option>
              {uniqueModules.map(m => <option key={m}>{m}</option>)}
            </select>
            <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none">
              <option value="">All Actions</option>
              {uniqueActions.map(a => <option key={a}>{a}</option>)}
            </select>
          </>
        }
      />

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mt-0">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
          <Activity size={16} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Audit Events ({filtered.length})</span>
        </div>
        <DataTable columns={columns} data={filtered} rowKey={e => e.id} emptyMessage="No audit events match your filters." />
      </div>

      {/* Info Note */}
      <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-xl">
        <p className="text-sm text-sky-800">
          <span className="font-semibold">Audit Trail Note:</span> All user actions and data modifications are automatically logged. Audit logs are immutable and cannot be edited after creation.
        </p>
      </div>
    </PageScaffold>
  );
}
