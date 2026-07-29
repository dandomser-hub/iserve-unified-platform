import React, { useState, useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAudit } from '@/app/providers/AuditProvider';
import { FileText, Download } from 'lucide-react';

const AVAILABLE_REPORTS = [
  {
    id: 'resident-master',
    title: 'Resident Master List',
    module: 'Residents',
    description: 'Complete list of all registered residents with demographic information',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'household-master',
    title: 'Household Master List',
    module: 'Households',
    description: 'Household registry with composition and contact details',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'docreq-registry',
    title: 'Document Request Registry',
    module: 'Documents',
    description: 'All document requests with status and tracking information',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'released-docs',
    title: 'Released Documents Log',
    module: 'Documents',
    description: 'Log of documents released to residents with dates and purposes',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'collection-summary',
    title: 'Collection Reference Summary',
    module: 'Collections',
    description: 'Summary of collections and remittances',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'blotter-summary',
    title: 'Blotter Incident Summary',
    module: 'Blotter',
    description: 'Summary of incidents recorded in the blotter',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'kp-cases',
    title: 'KP Case Summary',
    module: 'KP Cases',
    description: 'Katarungang Pambarangay cases and resolutions',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'drrm-early-warning',
    title: 'DRRM Early Warning / Preparedness Log',
    module: 'DRRM',
    description: 'Disaster risk reduction and management early warning system logs',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'drrm-sitrep',
    title: 'DRRM SitRep Export',
    module: 'DRRM',
    description: 'Situation reports for disaster and emergency events',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'dana-export',
    title: 'DANA Export',
    module: 'DRRM',
    description: 'Damage Assessment and Needs Analysis data export',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'dromic-evacuation',
    title: 'DROMIC-Ready Evacuation / Displacement Summary',
    module: 'DRRM',
    description: 'Evacuation and displacement information in DROMIC format',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'gad-annex-d1',
    title: 'GAD Annex D-1 Report',
    module: 'GAD',
    description: 'Gender Issues and GAD Result Statements report',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'gad-annex-e1',
    title: 'GAD Annex E-1 Report',
    module: 'GAD',
    description: 'Accomplishment Report on GAD Plan Implementation',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'exec-dashboard',
    title: 'Executive Dashboard Summary',
    module: 'Dashboard',
    description: 'Summary dashboard snapshot for executive review',
    formats: ['PDF'],
  },
  {
    id: 'sglgb-compliance',
    title: 'SGLGB / Compliance Checklist',
    module: 'Compliance',
    description: 'Sangguniang Barangay Gender and Development Compliance Checklist',
    formats: ['PDF', 'Excel'],
  },
  {
    id: 'data-quality',
    title: 'Data Quality Report',
    module: 'Admin',
    description: 'Data quality issues and resolution tracking',
    formats: ['PDF', 'CSV', 'Excel'],
  },
  {
    id: 'audit-trail',
    title: 'Audit Trail Report',
    module: 'Admin',
    description: 'Complete audit log of system activities and changes',
    formats: ['PDF', 'CSV', 'Excel'],
  },
];

export function ReportsExportCenterPage() {
  const { logEvent } = useAudit();
  const [searchValue, setSearchValue] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);

  const filteredReports = useMemo(() => {
    return AVAILABLE_REPORTS.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        report.description.toLowerCase().includes(searchValue.toLowerCase());

      const matchesModule = !moduleFilter || report.module === moduleFilter;

      return matchesSearch && matchesModule;
    });
  }, [searchValue, moduleFilter]);

  const uniqueModules = useMemo(
    () => [...new Set(AVAILABLE_REPORTS.map((r) => r.module))].sort(),
    []
  );

  const handleExport = (reportTitle: string, format: string) => {
    logEvent({
      action: 'Exported',
      module: 'Reports',
      recordLabel: reportTitle,
      description: `Exported ${reportTitle} as ${format}`,
    });

    alert(`Export simulated: ${reportTitle} (${format})`);
  };

  const handleModuleFilterChange = (value: string) => {
    setModuleFilter(value === 'all' ? null : value);
  };

  const moduleOptions = [
    { value: 'all', label: 'All Modules' },
    ...uniqueModules.map((m) => ({ value: m, label: m })),
  ];

  return (
    <PageScaffold
      title="Reports Export Center"
      subtitle="Generate and Download Barangay iSERVE Reports"
      moduleTag="Reports"
      priorityTag="P1"
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <SearchFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          placeholder="Search reports by title or description..."
          filters={
            <select value={moduleFilter || 'all'} onChange={(e) => handleModuleFilterChange(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
              <option value="all">All Modules</option>
              {uniqueModules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          }
        />

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <Card key={report.id} className="p-6 border-t-4 border-t-blue-600 flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {report.title}
                    </h3>
                    <Badge
                      label={report.module}
                      variant="default"
                      className="ml-3 flex-shrink-0"
                    />
                  </div>

                  <p className="text-sm text-gray-600 mb-5 line-clamp-2">
                    {report.description}
                  </p>

                  {/* Format Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    {report.formats.map((format) => (
                      <Button
                        key={format}
                        variant="ghost"
                        onClick={() => handleExport(report.title, format)}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        {format}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="p-12 text-center">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No reports match your search</p>
              </Card>
            </div>
          )}
        </div>

        {/* Info Box */}
        <Card className="p-4 bg-blue-50 border-l-4 border-l-blue-600">
          <p className="text-sm text-blue-900">
            <span className="font-medium">Note:</span> Reports are generated on-demand
            and exported in your selected format. Large datasets may take a few moments
            to process. All exports are logged for audit purposes.
          </p>
        </Card>
      </div>
    </PageScaffold>
  );
}
