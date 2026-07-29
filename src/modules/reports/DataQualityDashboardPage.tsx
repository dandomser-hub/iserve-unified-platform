import { useState, useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { StatCard, Card } from '@/components/ui/Card';
import { Badge, StatusChip } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { mockDataQualityIssues } from '@/data/mockReports';
import type { DataQualityIssue } from '@/types/report';

export function DataQualityDashboardPage() {
  const [searchValue, setSearchValue] = useState('');
  const [issueTypeFilter, setIssueTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const stats = useMemo(() => {
    const open = mockDataQualityIssues.filter(issue => issue.status === 'Open').length;
    const inProgress = mockDataQualityIssues.filter(issue => issue.status === 'In Progress').length;
    const resolved = mockDataQualityIssues.filter(issue => issue.status === 'Resolved').length;
    const high = mockDataQualityIssues.filter(issue => issue.severity === 'High').length;
    const medium = mockDataQualityIssues.filter(issue => issue.severity === 'Medium').length;
    const low = mockDataQualityIssues.filter(issue => issue.severity === 'Low').length;
    return { open, inProgress, resolved, high, medium, low };
  }, []);

  const filteredIssues = useMemo(() => {
    return mockDataQualityIssues.filter(issue => {
      const matchesSearch =
        issue.issueType.toLowerCase().includes(searchValue.toLowerCase()) ||
        issue.module.toLowerCase().includes(searchValue.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchValue.toLowerCase());
      const matchesIssueType = !issueTypeFilter || issue.issueType === issueTypeFilter;
      const matchesSeverity = !severityFilter || issue.severity === severityFilter;
      return matchesSearch && matchesIssueType && matchesSeverity;
    });
  }, [searchValue, issueTypeFilter, severityFilter]);

  const uniqueIssueTypes = useMemo(
    () => [...new Set(mockDataQualityIssues.map(i => i.issueType))].sort(),
    []
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: Column<DataQualityIssue>[] = [
    { key: 'issueType', header: 'Issue Type', render: issue => <Badge label={issue.issueType} variant="default" /> },
    { key: 'module', header: 'Module', render: issue => issue.module },
    { key: 'description', header: 'Description', render: issue => <span title={issue.description} className="truncate block">{issue.description}</span> },
    {
      key: 'severity', header: 'Severity', render: issue => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
          {issue.severity}
        </span>
      ),
    },
    { key: 'suggestedAction', header: 'Suggested Action', render: issue => issue.suggestedAction },
    { key: 'status', header: 'Status', render: issue => <StatusChip status={issue.status} /> },
  ];

  return (
    <PageScaffold
      title="Data Quality Dashboard"
      subtitle="Data Quality Issues and Resolution Tracking"
      moduleTag="Admin"
      priorityTag="P1"
    >
      <div className="space-y-8">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Open Issues"
            value={stats.open.toString()}
            subtitle="Awaiting action"
            icon={<AlertCircle size={20} />}
            color="red"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress.toString()}
            subtitle="Being resolved"
            color="amber"
          />
          <StatCard
            title="Resolved"
            value={stats.resolved.toString()}
            subtitle="Closed issues"
            icon={<CheckCircle2 size={20} />}
            color="grass"
          />
        </div>

        {/* Severity Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Severity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-red-700">{stats.high}</p>
              <p className="text-sm text-red-600 mt-1">High Severity</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-yellow-700">{stats.medium}</p>
              <p className="text-sm text-yellow-600 mt-1">Medium Severity</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <CheckCircle2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-blue-700">{stats.low}</p>
              <p className="text-sm text-blue-600 mt-1">Low Severity</p>
            </div>
          </div>
        </Card>

        {/* Search and Filters */}
        <SearchFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          placeholder="Search by issue type, module, or description..."
          filters={
            <>
              <select value={issueTypeFilter} onChange={e => setIssueTypeFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
                <option value="">All Issue Types</option>
                {uniqueIssueTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
                <option value="">All Severities</option>
                {['High', 'Medium', 'Low'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </>
          }
        />

        {/* Data Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredIssues}
            rowKey={issue => issue.id}
            emptyMessage="No issues found"
          />
        </div>
      </div>
    </PageScaffold>
  );
}
