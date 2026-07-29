import { useState } from 'react';
import { Home, Users, AlertTriangle } from 'lucide-react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusChip, Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useMockData } from '@/app/providers/MockDataProvider';
import { PUROKS } from '@/data/mockReferenceData';
import type { Household } from '@/types/household';

export function HouseholdRegistryPage() {
  const { households } = useMockData();
  const [search, setSearch] = useState('');
  const [purokFilter, setPurokFilter] = useState('');
  const [selected, setSelected] = useState<Household | null>(null);

  const filtered = households.filter(h => {
    const q = search.toLowerCase();
    const match = !q || h.householdNo.toLowerCase().includes(q) || h.headName.toLowerCase().includes(q) || h.address.toLowerCase().includes(q);
    const matchPurok = !purokFilter || h.purok === purokFilter;
    return match && matchPurok;
  });

  const columns: Column<Household>[] = [
    { key: 'householdNo', header: 'HH No.', render: h => <span className="font-mono text-xs text-slate-600">{h.householdNo}</span> },
    { key: 'headName', header: 'Household Head', render: h => <span className="font-medium text-slate-900">{h.headName}</span> },
    { key: 'address', header: 'Address', render: h => <span className="text-slate-600 text-xs">{h.address}</span> },
    { key: 'purok', header: 'Purok', render: h => <span className="text-slate-600 text-xs">{h.purok}</span> },
    { key: 'members', header: 'Members', render: h => <span className="text-slate-700">{h.memberCount}</span> },
    { key: 'riskFlags', header: 'Risk Flags', render: h => (
      <div className="flex flex-wrap gap-1">
        {h.riskFlags.length === 0 ? <span className="text-slate-400 text-xs">None</span> : h.riskFlags.slice(0, 2).map(f => <Badge key={f} label={f} variant="warning" />)}
      </div>
    )},
    { key: 'incomeCategory', header: 'Income', render: h => <Badge label={h.incomeCategory} variant={h.incomeCategory === 'Indigent' ? 'warning' : 'neutral'} /> },
    { key: 'status', header: 'Status', render: h => <StatusChip status={h.status} /> },
  ];

  return (
    <PageScaffold
      title="Household Registry"
      subtitle={`${households.length} registered households`}
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Households' }]}
      moduleTag="Households"
      priorityTag="P0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <SearchFilterBar
              searchValue={search}
              onSearchChange={setSearch}
              placeholder="Search by HH no., head, or address..."
              filters={
                <select value={purokFilter} onChange={e => setPurokFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none">
                  <option value="">All Puroks</option>
                  {PUROKS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              }
            />
            <DataTable
              columns={columns}
              data={filtered}
              rowKey={h => h.id}
              onRowClick={setSelected}
              emptyMessage="No households found."
            />
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-1">
          {selected ? (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-forest/10 rounded-lg flex items-center justify-center">
                  <Home size={18} className="text-forest" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{selected.householdNo}</p>
                  <p className="text-xs text-slate-500">{selected.purok}</p>
                </div>
              </div>
              <dl className="space-y-2 mb-4">
                {[
                  ['Head', selected.headName],
                  ['Address', selected.address],
                  ['Income', selected.incomeCategory],
                  ['Livelihood', selected.livelihood || '—'],
                  ['Status', selected.status],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="text-xs text-slate-500 w-20 flex-shrink-0 pt-0.5">{k}</dt>
                    <dd className="text-sm font-medium text-slate-800">{v}</dd>
                  </div>
                ))}
              </dl>

              {selected.riskFlags.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertTriangle size={13} className="text-amber-600" />
                    <p className="text-xs font-semibold text-amber-700">Risk Flags</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.riskFlags.map(f => <Badge key={f} label={f} variant="warning" />)}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Users size={13} className="text-forest" />
                  <p className="text-xs font-semibold text-slate-700">Members ({selected.members.length})</p>
                </div>
                <div className="space-y-1.5">
                  {selected.members.map(m => (
                    <div key={m.residentId || m.name} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <div className="w-7 h-7 bg-forest/10 rounded-full flex items-center justify-center text-forest text-xs font-bold flex-shrink-0">{m.name[0]}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-800 truncate">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.relationship} · {m.sex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center py-12 text-center">
              <Home size={28} className="text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-500">Select a household</p>
              <p className="text-xs text-slate-400 mt-1">Click any row to view household details</p>
            </Card>
          )}
        </div>
      </div>
    </PageScaffold>
  );
}
