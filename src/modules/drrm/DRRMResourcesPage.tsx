import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { Card, StatCard } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusChip, Badge } from '@/components/ui/Badge';
import { mockDRRMResources } from '@/data/mockDRRM';
import type { DRRMResource } from '@/types/drrm';
import { formatDate } from '@/utils/formatters';
import { Package, Zap, AlertCircle } from 'lucide-react';

export function DRRMResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = mockDRRMResources.filter(resource => {
    const matchesSearch =
      !searchTerm ||
      resource.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.custodian.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAvailability = !availabilityFilter || resource.availability === availabilityFilter;
    const matchesCategory = !categoryFilter || resource.category === categoryFilter;

    return matchesSearch && matchesAvailability && matchesCategory;
  });

  // Calculate summary
  const available = mockDRRMResources.filter(r => r.availability === 'Available').length;
  const deployed = mockDRRMResources.filter(r => r.availability === 'Deployed').length;
  const maintenance = mockDRRMResources.filter(r => r.availability === 'In Maintenance').length;

  const categories = ['Equipment', 'Supply', 'Medical', 'Communication'];
  const availabilities = ['Available', 'Deployed', 'In Maintenance'];

  const columns: Column<DRRMResource>[] = [
    { key: 'resourceName', header: 'Resource Name', render: r => r.resourceName },
    { key: 'category', header: 'Category', render: r => <Badge label={r.category} variant="default" className="text-xs" /> },
    { key: 'quantity', header: 'Quantity', render: r => `${r.quantity} ${r.unit}` },
    { key: 'condition', header: 'Condition', render: r => <StatusChip status={r.condition} /> },
    { key: 'location', header: 'Location', render: r => <span className="text-sm">{r.location}</span> },
    { key: 'custodian', header: 'Custodian', render: r => r.custodian },
    { key: 'availability', header: 'Availability', render: r => <StatusChip status={r.availability} /> },
    { key: 'lastInspected', header: 'Last Inspected', render: r => formatDate(r.lastInspected) },
  ];

  return (
    <PageScaffold
      title="DRRM Resources Inventory"
      subtitle="Track emergency equipment and relief supplies"
      breadcrumbs={[{ label: 'DRRM' }, { label: 'Resources' }]}
      moduleTag="DRRM"
      priorityTag="P1"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Available"
          value={available}
          subtitle="Ready for deployment"
          icon={<Package size={20} />}
          color="grass"
        />
        <StatCard
          title="Deployed"
          value={deployed}
          subtitle="In active use"
          icon={<Zap size={20} />}
          color="ocean"
        />
        <StatCard
          title="In Maintenance"
          value={maintenance}
          subtitle="Under repair/service"
          icon={<AlertCircle size={20} />}
          color="amber"
        />
      </div>

      {/* Search and Filters */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by resource name, location, or custodian..."
        filters={
          <>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="">All Availabilities</option>
              {availabilities.map(avail => (
                <option key={avail} value={avail}>{avail}</option>
              ))}
            </select>
          </>
        }
      />

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={filtered} rowKey={r => r.id} emptyMessage="No resources match your filters." />
      </div>

      {/* Resources with Remarks */}
      {mockDRRMResources.filter(r => r.remarks).length > 0 && (
        <Card className="mt-6">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Resource Notes</h3>
          </div>
          <div className="p-5 space-y-3">
            {mockDRRMResources
              .filter(r => r.remarks)
              .map(resource => (
                <div key={resource.id} className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <p className="font-semibold text-slate-800 text-sm">{resource.resourceName}</p>
                  <p className="text-xs text-slate-600 mt-1">{resource.remarks}</p>
                </div>
              ))}
          </div>
        </Card>
      )}
    </PageScaffold>
  );
}
