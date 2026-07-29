import React, { useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { StatCard, Card } from '@/components/ui/Card';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { formatDate } from '@/utils/formatters';
import { Users, Users2 } from 'lucide-react';
import { mockGADParticipants } from '@/data/mockGAD';
import type { GADParticipant } from '@/types/gad';

export function ParticipantLogPage() {
  const stats = useMemo(() => {
    const totalMale = mockGADParticipants.reduce(
      (sum, p) => sum + (p.malePax || 0),
      0
    );
    const totalFemale = mockGADParticipants.reduce(
      (sum, p) => sum + (p.femalePax || 0),
      0
    );
    const totalParticipants = totalMale + totalFemale;

    return {
      totalMale,
      totalFemale,
      totalParticipants,
    };
  }, []);

  const columns: Column<GADParticipant>[] = [
    { key: 'activityName', header: 'Activity Name', render: (p) => p.activityName },
    { key: 'date', header: 'Date', render: (p) => formatDate(p.date) },
    { key: 'malePax', header: 'Male', render: (p) => p.malePax },
    { key: 'femalePax', header: 'Female', render: (p) => p.femalePax },
    {
      key: 'totalPax',
      header: 'Total',
      render: (p) => (p.malePax || 0) + (p.femalePax || 0),
    },
  ];

  return (
    <PageScaffold
      title="Participant Log"
      subtitle="Gender-Disaggregated Participation Tracking"
      moduleTag="GAD"
      priorityTag="P1"
    >
      <div className="space-y-8">
        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Male Participants"
            value={stats.totalMale.toString()}
            subtitle="Across all activities"
            icon={<Users size={20} />}
          />
          <StatCard
            title="Total Female Participants"
            value={stats.totalFemale.toString()}
            subtitle="Across all activities"
            icon={<Users2 size={20} />}
          />
          <StatCard
            title="Total Participants"
            value={stats.totalParticipants.toString()}
            subtitle={`${stats.totalMale}M + ${stats.totalFemale}F`}
          />
        </div>

        {/* Gender Distribution Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Gender Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Male Participants</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.totalMale} (
                  {stats.totalParticipants > 0
                    ? Math.round((stats.totalMale / stats.totalParticipants) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width:
                      stats.totalParticipants > 0
                        ? `${(stats.totalMale / stats.totalParticipants) * 100}%`
                        : '0%',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Female Participants</span>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.totalFemale} (
                  {stats.totalParticipants > 0
                    ? Math.round((stats.totalFemale / stats.totalParticipants) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-pink-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width:
                      stats.totalParticipants > 0
                        ? `${(stats.totalFemale / stats.totalParticipants) * 100}%`
                        : '0%',
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Activity-wise Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activity-wise Participation Breakdown
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {mockGADParticipants && mockGADParticipants.length > 0 ? (
              mockGADParticipants.map((record, idx) => {
                const total = (record.malePax || 0) + (record.femalePax || 0);
                const malePercent = total > 0 ? ((record.malePax || 0) / total) * 100 : 0;

                return (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {record.activityName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(record.date)} · {total} participants
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {record.malePax || 0}M / {record.femalePax || 0}F
                        </p>
                      </div>
                    </div>

                    <div className="flex h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 transition-all duration-300"
                        style={{ width: `${malePercent}%` }}
                        title={`Male: ${record.malePax || 0}`}
                      />
                      <div
                        className="bg-pink-600 transition-all duration-300"
                        style={{ width: `${100 - malePercent}%` }}
                        title={`Female: ${record.femalePax || 0}`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center py-8 text-gray-500">No participant records</p>
            )}
          </div>
        </Card>

        {/* Detailed Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detailed Participation Log
          </h3>
          <DataTable
            columns={columns}
            data={mockGADParticipants}
            rowKey={p => p.id}
            emptyMessage="No participant records found"
          />
        </Card>
      </div>
    </PageScaffold>
  );
}
