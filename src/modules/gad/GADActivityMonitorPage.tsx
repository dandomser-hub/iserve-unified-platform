import React, { useState, useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CheckCircle2, Circle, AlertCircle, MapPin, DollarSign, Target } from 'lucide-react';
import { mockGADActivities } from '@/data/mockGAD';

export function GADActivityMonitorPage() {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredActivities = useMemo(() => {
    return mockGADActivities.filter((activity) => {
      const matchesSearch = activity.activityName
        .toLowerCase()
        .includes(searchValue.toLowerCase());

      const matchesStatus = !statusFilter || activity.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchValue, statusFilter]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === 'all' ? null : value);
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Planning', label: 'Planning' },
    { value: 'Scheduled', label: 'Scheduled' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
  ];

  const renderMilestones = (milestones: any[] | undefined) => {
    if (!milestones || milestones.length === 0) {
      return <p className="text-sm text-gray-500">No milestones</p>;
    }

    return (
      <div className="space-y-2">
        {milestones.map((milestone, idx) => (
          <div key={idx} className="flex items-center text-sm">
            {milestone.done ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-gray-300 mr-2 flex-shrink-0" />
            )}
            <span
              className={
                milestone.done ? 'text-gray-600 line-through' : 'text-gray-700'
              }
            >
              {milestone.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <PageScaffold
      title="GAD Activity Monitor"
      subtitle="Real-time Activity Implementation Tracking"
      moduleTag="GAD"
      priorityTag="P1"
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <SearchFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          placeholder="Search activities by name..."
          filters={
            <select value={statusFilter || 'all'} onChange={(e) => handleStatusFilterChange(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          }
        />

        {/* Activities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <Card
                key={activity.id}
                className="p-6 border-l-4 border-l-green-600 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {activity.activityName}
                      </h3>
                      {activity.linkedAnnexD1Id && (
                        <p className="text-xs text-gray-500 mt-1">
                          Linked to Annex D-1: {activity.linkedAnnexD1Id}
                        </p>
                      )}
                    </div>
                    <StatusChip status={activity.status} />
                  </div>

                  {/* Date Information */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Scheduled Date
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(activity.scheduledDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Actual Date
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.actualDate
                          ? formatDate(activity.actualDate)
                          : 'Pending'}
                      </p>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Venue
                      </p>
                      <p className="text-sm text-gray-700">{activity.venue}</p>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Budgeted</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(activity.budget)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Actual Expenditure</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(activity.actualExpenditure || 0)}
                      </p>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-4 w-4 text-gray-500" />
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                        Milestones
                      </p>
                    </div>
                    <div className="ml-6">
                      {renderMilestones(activity.milestones)}
                    </div>
                  </div>

                  {/* Issues */}
                  {activity.issues && (
                    <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                        <p className="text-xs text-yellow-800 font-medium uppercase tracking-wider">
                          Issues
                        </p>
                      </div>
                      <p className="text-sm text-yellow-800">{activity.issues}</p>
                    </div>
                  )}

                  {/* Outputs */}
                  {activity.outputs && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wider font-medium mb-2">
                        Outputs
                      </p>
                      <p className="text-sm text-gray-700">{activity.outputs}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="col-span-full p-12 text-center">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No activities found</p>
            </Card>
          )}
        </div>
      </div>
    </PageScaffold>
  );
}
