import React from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Lock,
  Globe,
  TrendingUp,
  Users,
  HeartHandshake,
  FileText,
  Smartphone,
  Zap,
  Building2,
  Brain,
  Link2,
  Landmark,
  AlertCircle,
} from 'lucide-react';

const FUTURE_FEATURES = [
  {
    id: 1,
    name: 'Legislative Records & Full Disclosure',
    description:
      'Complete legislative tracking including resolutions, ordinances, budget bills, and full transparency disclosure records.',
    whyDeferred:
      'Requires validation of legislative workflow and integration with municipal records archival systems.',
    phase: 'P2',
    status: 'Deferred',
    icon: Landmark,
  },
  {
    id: 2,
    name: 'Assets & Inventory Management',
    description:
      'Track and manage barangay assets, equipment, and inventory with maintenance scheduling and depreciation tracking.',
    whyDeferred:
      'Needs detailed asset classification scheme and integration with procurement/audit processes.',
    phase: 'P2',
    status: 'Deferred',
    icon: Building2,
  },
  {
    id: 3,
    name: 'Personnel, SK, Tanod, Lupon',
    description:
      'Comprehensive personnel management including Sangguniang Kabataan, tanods, and Lupon members with roles and assignments.',
    whyDeferred: 'Requires organizational hierarchy definition and role matrix finalization.',
    phase: 'P2',
    status: 'Deferred',
    icon: Users,
  },
  {
    id: 4,
    name: 'Health & Welfare Programs',
    description:
      'Module for managing health programs, vaccinations, nutrition programs, and welfare assistance distribution.',
    whyDeferred:
      'Needs coordination with health worker workflows and integration with DOH reporting requirements.',
    phase: 'P2',
    status: 'Deferred',
    icon: HeartHandshake,
  },
  {
    id: 5,
    name: 'Resident Self-Service Portal',
    description:
      'Public-facing portal for residents to request documents, check status, and access barangay information.',
    whyDeferred:
      'Requires security architecture review and integration with document request workflow.',
    phase: 'P2',
    status: 'Deferred',
    icon: Users,
  },
  {
    id: 6,
    name: 'Online Payment Integration',
    description: 'Secure online payment gateway for document fees, permits, and fines.',
    whyDeferred:
      'Requires payment gateway provider selection and PCI compliance architecture.',
    phase: 'P3',
    status: 'Future',
    icon: TrendingUp,
  },
  {
    id: 7,
    name: 'Full Accounting & Finance Module',
    description:
      'Accounting-grade financial management with GL, AR/AP, general ledger, and compliance reporting.',
    whyDeferred:
      'Should be implemented as separate dedicated system per accounting standards. Requires specialized expertise.',
    phase: 'P3',
    status: 'Future',
    icon: FileText,
  },
  {
    id: 8,
    name: 'VAWC/BCPC Restricted Records',
    description:
      'Specialized restricted-access system for Violence Against Women and Children and Barangay Victim Centered Protection records.',
    whyDeferred:
      'Requires strict data governance, encryption, and role-based access control per DSWD guidelines.',
    phase: 'P3',
    status: 'Future',
    icon: Lock,
  },
  {
    id: 9,
    name: 'National Agency Integrations',
    description:
      'Integrations with PhilSys, COMELEC, DOH, DSWD, OCD for resident data validation and automated reporting.',
    whyDeferred: 'Requires national agency APIs and complex security/data sharing agreements.',
    phase: 'P3',
    status: 'Future',
    icon: Globe,
  },
  {
    id: 10,
    name: 'Native Mobile / Offline-First App',
    description:
      'Native mobile applications for iOS/Android with offline-first architecture for field workers.',
    whyDeferred: 'Requires cross-platform development resources and sync architecture design.',
    phase: 'P3',
    status: 'Future',
    icon: Smartphone,
  },
  {
    id: 11,
    name: 'AI Analytics & Predictive Reports',
    description:
      'Machine learning models for predictive analytics, anomaly detection, and advanced data visualization.',
    whyDeferred: 'Requires ML infrastructure and sufficient historical data for model training.',
    phase: 'P3',
    status: 'Future',
    icon: Brain,
  },
  {
    id: 12,
    name: 'Blockchain Audit Anchoring',
    description:
      'Blockchain-based immutable audit trail anchoring for enhanced data integrity verification.',
    whyDeferred:
      'Emerging technology with unproven ROI. Requires specialized infrastructure and cost-benefit analysis.',
    phase: 'P3',
    status: 'Future',
    icon: Link2,
  },
];

export function FutureModulesPage() {
  const phaseColors = {
    P2: 'bg-blue-100 text-blue-800',
    P3: 'bg-purple-100 text-purple-800',
  };

  const statusIcons = {
    Deferred: AlertCircle,
    Future: Zap,
  };

  return (
    <PageScaffold
      title="Future Modules & Roadmap"
      subtitle="Deferred and Future Features for Barangay iSERVE"
      moduleTag="Roadmap"
      priorityTag="P2"
    >
      <div className="space-y-6">
        {/* Roadmap Overview */}
        <Card className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-l-4 border-l-blue-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Implementation Roadmap
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Phase 1 (Current)
              </p>
              <p className="text-sm text-gray-700">
                Core residents, households, documents, blotter, collections, DRRM, GAD
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Phase 2
              </p>
              <p className="text-sm text-gray-700">
                Personnel management, health programs, portal, legislative, assets
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Phase 3
              </p>
              <p className="text-sm text-gray-700">
                Payments, accounting, integrations, mobile, AI, blockchain
              </p>
            </div>
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-4 bg-amber-50 border-l-4 border-l-amber-600">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-medium mb-1">All features shown below are deferred / future</p>
              <p>
                These modules are not included in the current release. They require
                additional planning, resources, or external dependencies.
              </p>
            </div>
          </div>
        </Card>

        {/* Future Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {FUTURE_FEATURES.map((feature) => {
            const IconComponent = feature.icon;
            const StatusIcon = statusIcons[feature.status as keyof typeof statusIcons];

            return (
              <Card
                key={feature.id}
                className="p-6 border-t-4 border-t-gray-400 opacity-90 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {feature.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {feature.description}
                </p>

                <div className="p-3 bg-gray-50 rounded mb-4">
                  <p className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                    Why Deferred
                  </p>
                  <p className="text-xs text-gray-700">{feature.whyDeferred}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        phaseColors[feature.phase as keyof typeof phaseColors]
                      }`}
                    >
                      {feature.phase}
                    </span>
                    <Badge label={feature.status} variant="default" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Implementation Notes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Implementation Considerations
          </h3>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-medium text-gray-900 mb-1">
                Phase 2 Features (Deferred)
              </p>
              <p>
                These modules represent important functionality that will be prioritized
                after Phase 1 validation. Implementation can begin after core system
                stabilization and user feedback collection.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900 mb-1">
                Phase 3 Features (Future)
              </p>
              <p>
                These are strategic long-term enhancements that require significant
                infrastructure investment, external partnerships, or specialized expertise.
                Feasibility assessments will be conducted before planning commencement.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900 mb-1">
                Integration with Separate Systems
              </p>
              <p>
                The Full Accounting module is intentionally excluded from iSERVE. Financial
                management should be implemented as a dedicated accounting system per
                accounting standards. iSERVE will integrate with (not replace) such systems
                for operational reporting.
              </p>
            </div>

            <div>
              <p className="font-medium text-gray-900 mb-1">
                Feedback & Prioritization
              </p>
              <p>
                Feature prioritization will be driven by user feedback from Phase 1
                deployment, technical feasibility assessments, and resource availability.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact & Feedback */}
        <Card className="p-6 bg-blue-50 border-l-4 border-l-blue-600">
          <h3 className="text-base font-semibold text-blue-900 mb-2">
            Feature Requests & Feedback
          </h3>
          <p className="text-sm text-blue-800">
            User feedback is valuable for prioritizing features. If you have requirements or
            feedback about any of these deferred features, please contact the development
            team through official channels.
          </p>
        </Card>
      </div>
    </PageScaffold>
  );
}
