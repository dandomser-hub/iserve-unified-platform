import { Badge, StatusChip } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { mockFeeItems } from '@/data/mockCollections';
import { formatDate } from '@/utils/formatters';

type FeeItem = typeof mockFeeItems[0];

export function FeeTableExemptionPage() {
  const columns: Column<FeeItem>[] = [
    { key: 'name', header: 'Fee Name', render: f => f.name },
    { key: 'documentType', header: 'Document Type', render: f => f.documentType },
    { key: 'baseAmount', header: 'Base Amount', render: f => `PHP ${f.baseAmount}` },
    { key: 'isExemptible', header: 'Exemptible', render: f => <StatusChip status={f.isExemptible ? 'Approved' : 'Recorded'} /> },
    {
      key: 'exemptionReasons',
      header: 'Exemption Reasons',
      render: f => f.exemptionReasons.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {f.exemptionReasons.map((reason, idx) => (
            <Badge key={idx} label={reason} variant="default" className="text-xs" />
          ))}
        </div>
      ) : <span className="text-slate-400 text-sm">—</span>,
    },
    { key: 'effectiveDate', header: 'Effective Date', render: f => formatDate(f.effectiveDate) },
    { key: 'isActive', header: 'Active', render: f => <StatusChip status={f.isActive ? 'Active' : 'Inactive'} /> },
  ];

  return (
    <PageScaffold
      title="Fee Table & Exemptions"
      subtitle="Reference documentation of barangay fees and exemptions"
      breadcrumbs={[{ label: 'Collections' }, { label: 'Fee Table' }]}
      moduleTag="Collections"
      priorityTag="P1"
    >
      {/* Information Note */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <div className="p-4 flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <p className="font-semibold text-blue-900 text-sm">Fee Reference Data</p>
            <p className="text-sm text-blue-800 mt-1">
              This table displays fee references for documentation purposes only. All exemptions must be approved by the Punong Barangay or appropriate authority. Exemption codes must correspond to approved barangay policies and national guidelines.
            </p>
          </div>
        </div>
      </Card>

      {/* Fee Items Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={mockFeeItems} rowKey={f => f.id} />
      </div>

      {/* Footer Notes */}
      <div className="mt-6 space-y-3">
        <Card className="bg-slate-50 border-slate-200">
          <div className="p-4 text-sm text-slate-700">
            <p className="font-semibold mb-2">Exemption Reference Codes:</p>
            <ul className="space-y-1 text-xs ml-4 list-disc text-slate-600">
              <li><span className="font-medium">Senior Citizen:</span> Pursuant to RA 9994 (Expanded Senior Citizens Act)</li>
              <li><span className="font-medium">PWD:</span> Pursuant to RA 7277 (Magna Carta for Disabled Persons)</li>
              <li><span className="font-medium">Indigent:</span> With Barangay Captain approval and MSWDO certification</li>
              <li><span className="font-medium">School Enrollment:</span> For minors, with valid school enrollment documents</li>
              <li><span className="font-medium">RA 11261:</span> First Time Jobseeker — no fee per national law</li>
              <li><span className="font-medium">DOLE Program:</span> Applicants to DOLE assistance programs with valid documentation</li>
            </ul>
          </div>
        </Card>

        <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <span className="font-semibold">Disclaimer:</span> This page serves as a reference document for barangay staff.
          All financial decisions regarding fee collection and exemptions must comply with applicable national and local regulations.
          For questions about specific exemptions, consult the Barangay Treasurer or Punong Barangay.
        </p>
      </div>
    </PageScaffold>
  );
}
