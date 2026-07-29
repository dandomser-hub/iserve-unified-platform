import { useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, Database, Cpu, HardDrive, Clock, CheckCircle2 } from 'lucide-react';

export function BackupSyncMonitorPage() {
  // Simulated backup/sync data
  const backupData = useMemo(() => {
    return {
      lastBackup: new Date('2024-06-15T02:00:00'),
      backupStatus: 'Success',
      syncStatus: 'Synchronized',
      lastSync: new Date('2024-06-15T02:15:00'),
      restorePoints: [
        {
          id: 1,
          timestamp: new Date('2024-06-15T02:00:00'),
          size: '2.4 GB',
          status: 'Ready',
        },
        {
          id: 2,
          timestamp: new Date('2024-06-14T02:00:00'),
          size: '2.3 GB',
          status: 'Ready',
        },
        {
          id: 3,
          timestamp: new Date('2024-06-13T02:00:00'),
          size: '2.2 GB',
          status: 'Ready',
        },
      ],
      environmentHealth: {
        database: 'Connected',
        api: 'Online',
        storage: 'Available',
      },
    };
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <PageScaffold
      title="Backup & Sync Monitor"
      subtitle="System Backup and Data Synchronization Status"
      moduleTag="Admin"
      priorityTag="P1"
    >
      <div className="space-y-8">
        {/* Prototype Disclaimer */}
        <Card className="p-4 bg-yellow-50 border-l-4 border-l-yellow-600 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">
              Prototype Monitor Only
            </p>
            <p className="text-sm text-yellow-800 mt-1">
              This is a demonstration interface only. No actual backup operations are
              performed in this demo environment. Backup/sync status is simulated for UI
              demonstration purposes. In production, this would connect to real backup
              infrastructure.
            </p>
          </div>
        </Card>

        {/* Last Backup Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-t-4 border-t-green-600">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Last Backup
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDateTime(backupData.lastBackup)}
                </p>
              </div>
              <Badge
                label={backupData.backupStatus}
                variant={backupData.backupStatus === 'Success' ? 'success' : 'danger'}
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Backup Duration</span>
                <span className="text-sm font-medium text-gray-900">
                  15 minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Size</span>
                <span className="text-sm font-medium text-gray-900">
                  2.4 GB
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Backup Method</span>
                <span className="text-sm font-medium text-gray-900">
                  Incremental
                </span>
              </div>
            </div>
          </Card>

          {/* Sync Status */}
          <Card className="p-6 border-t-4 border-t-blue-600">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Sync Status
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Last synced: {formatDateTime(backupData.lastSync)}
                </p>
              </div>
              <Badge
                label={backupData.syncStatus}
                variant="success"
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sync Interval</span>
                <span className="text-sm font-medium text-gray-900">
                  Every 15 minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Records Synced</span>
                <span className="text-sm font-medium text-gray-900">
                  12,547
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Syncs</span>
                <span className="text-sm font-medium text-gray-900">0</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Environment Health */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-gray-600" />
            Environment Health
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Database Status */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-5 w-5 text-green-600" />
                <p className="font-medium text-gray-900">Database</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <Badge
                  label={backupData.environmentHealth.database}
                  variant="success"
                />
              </div>
            </div>

            {/* API Status */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="h-5 w-5 text-blue-600" />
                <p className="font-medium text-gray-900">API Server</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <Badge
                  label={backupData.environmentHealth.api}
                  variant="success"
                />
              </div>
            </div>

            {/* Storage Status */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 mb-3">
                <HardDrive className="h-5 w-5 text-indigo-600" />
                <p className="font-medium text-gray-900">Storage</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                <Badge
                  label={backupData.environmentHealth.storage}
                  variant="success"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Restore Points */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            Available Restore Points
          </h3>

          <div className="space-y-3">
            {backupData.restorePoints.map((point) => (
              <div
                key={point.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {formatDateTime(point.timestamp)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Size: {point.size}
                  </p>
                </div>
                <Badge label={point.status} variant="success" />
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-4 p-3 bg-gray-100 rounded">
            Restore points are retained for 30 days. Automatic daily backups are
            performed at 02:00 UTC.
          </p>
        </Card>

        {/* Storage Capacity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Storage Capacity
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Used Storage</span>
                <span className="text-sm text-gray-600">7.2 GB of 10 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: '72%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Database</span>
                <span className="text-sm text-gray-600">4.8 GB (67%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: '67%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  File Storage
                </span>
                <span className="text-sm text-gray-600">2.4 GB (33%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: '33%' }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageScaffold>
  );
}
