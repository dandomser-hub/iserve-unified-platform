import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockHazardRisks } from '@/data/mockDRRM';
import { formatDate } from '@/utils/formatters';

export function HazardRiskRegisterPage() {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'High':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Very High':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <PageScaffold
      title="Hazard & Risk Register"
      subtitle="Community risk assessment and preparedness tracking"
      breadcrumbs={[{ label: 'DRRM' }, { label: 'Hazard Register' }]}
      moduleTag="DRRM"
      priorityTag="P1"
    >
      {/* Hazard Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockHazardRisks.map(hazard => (
          <Card key={hazard.id}>
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">{hazard.hazardType}</h3>
                <Badge
                  label={hazard.riskLevel}
                  variant="default"
                  className={`text-xs font-semibold ${getRiskLevelColor(hazard.riskLevel)}`}
                />
              </div>

              {/* Affected Puroks */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Affected Puroks</p>
                <div className="flex flex-wrap gap-2">
                  {hazard.affectedPuroks.map((purok, idx) => (
                    <Badge key={idx} label={purok} variant="default" className="text-xs" />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Vulnerable Groups */}
              {hazard.vulnerableGroups.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Vulnerable Groups</p>
                  <div className="flex flex-wrap gap-2">
                    {hazard.vulnerableGroups.map((group, idx) => (
                      <Badge key={idx} label={group} variant="danger" className="text-xs" />
                    ))}
                  </div>
                </div>
              )}

              {/* Preparedness Notes */}
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Preparedness Notes</p>
                <p className="text-sm text-slate-700 leading-relaxed p-3 bg-slate-50 border border-slate-200 rounded">
                  {hazard.preparednessNotes}
                </p>
              </div>

              {/* Map Reference */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Map Reference</p>
                <p className="text-sm text-blue-900">{hazard.mapReference}</p>
              </div>

              {/* Last Updated */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Last Updated</span>
                  <span className="font-semibold text-slate-800">{formatDate(hazard.lastUpdated)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Updated By</span>
                  <span className="font-semibold text-slate-800">{hazard.updatedBy}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockHazardRisks.length === 0 && (
        <Card className="text-center py-12 bg-slate-50 border-slate-200">
          <p className="text-slate-600 font-medium">No hazards registered</p>
        </Card>
      )}
    </PageScaffold>
  );
}
