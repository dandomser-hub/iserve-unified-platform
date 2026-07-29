import React, { useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { StatCard, Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { mockAnnexD1Items, mockAnnexE1Items, mockGADActivities, mockGADParticipants, mockGADBudget } from '@/data/mockGAD';

export function GADDashboardPage() {
  const stats = useMemo(() => {
    const totalD1 = mockAnnexD1Items.length;
    const completedD1 = mockAnnexD1Items.filter(
      (item) => item.status === 'Completed'
    ).length;
    const totalE1 = mockAnnexE1Items.length;
    const submittedE1 = mockAnnexE1Items.filter(
      (item) => item.status === 'Submitted'
    ).length;

    const totalFemale = mockGADParticipants.reduce(
      (sum, p) => sum + (p.femalePax || 0),
      0
    );
    const totalMale = mockGADParticipants.reduce(
      (sum, p) => sum + (p.malePax || 0),
      0
    );

    const totalBudget = mockGADBudget.reduce((sum, b) => sum + (b.amount || 0), 0);

    return {
      totalD1,
      completedD1,
      d1Percentage: totalD1 > 0 ? Math.round((completedD1 / totalD1) * 100) : 0,
      totalE1,
      submittedE1,
      e1Percentage: totalE1 > 0 ? Math.round((submittedE1 / totalE1) * 100) : 0,
      totalFemale,
      totalMale,
      totalBudget,
    };
  }, [mockAnnexD1Items, mockAnnexE1Items, mockGADParticipants, mockGADBudget]);

  const inProgressActivities = useMemo(
    () => mockGADActivities?.filter((a) => a.status === 'Ongoing') || [],
    [mockGADActivities]
  );

  return (
    <PageScaffold
      title="GAD Dashboard"
      subtitle="Gender and Development Operational Overview"
      moduleTag="GAD"
      priorityTag="P1"
    >
      <div className="space-y-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Annex D-1 Items"
            value={stats.totalD1.toString()}
            subtitle={`${stats.completedD1} completed`}
            icon={<TrendingUp size={20} />}
          />
          <StatCard
            title="D-1 Activities Completed"
            value={`${stats.d1Percentage}%`}
            subtitle={`${stats.completedD1} of ${stats.totalD1}`}
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            title="Annex E-1 Submitted"
            value={stats.submittedE1.toString()}
            subtitle={`${stats.e1Percentage}% submitted`}
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            title="Female Participants"
            value={stats.totalFemale.toString()}
            subtitle="Across all activities"
          />
          <StatCard
            title="Male Participants"
            value={stats.totalMale.toString()}
            subtitle="Across all activities"
          />
          <StatCard
            title="Total Budget Attributed"
            value={formatCurrency(stats.totalBudget)}
            subtitle="Tracking purposes"
          />
        </div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Annex D-1 Progress */}
          <Card className="p-6 border-l-4 border-l-green-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Annex D-1 Implementation Progress
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">In Progress vs Total</span>
                <span className="font-medium text-green-700">
                  {stats.completedD1} / {stats.totalD1}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${stats.d1Percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {stats.d1Percentage}% completion rate
              </p>
            </div>
          </Card>

          {/* Annex E-1 Progress */}
          <Card className="p-6 border-l-4 border-l-teal-600">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Annex E-1 Submission Progress
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Submitted vs Total</span>
                <span className="font-medium text-teal-700">
                  {stats.submittedE1} / {stats.totalE1}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-teal-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${stats.e1Percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {stats.e1Percentage}% submission rate
              </p>
            </div>
          </Card>
        </div>

        {/* Activity Implementation Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activity Implementation Status
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {inProgressActivities.length > 0 ? (
              inProgressActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {activity.activityName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Venue: {activity.venue || 'TBD'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Scheduled: {formatDate(activity.scheduledDate)}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <StatusChip status={activity.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="mx-auto mb-2 h-5 w-5" />
                <p>No activities in progress</p>
              </div>
            )}
          </div>
        </Card>

        {/* Budget Summary */}
        <Card className="p-6 border-l-4 border-l-amber-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Budget Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Total Attributed Budget</span>
              <span className="font-bold text-amber-700">
                {formatCurrency(stats.totalBudget)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Budget attribution is for reference tracking only. Not an accounting
              ledger.
            </p>
          </div>
        </Card>
      </div>
    </PageScaffold>
  );
}
