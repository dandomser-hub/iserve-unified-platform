import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip, Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { mockDocumentTemplates } from '@/data/mockDocuments';
import { BARANGAY_INFO } from '@/data/mockReferenceData';
import { formatDate } from '@/utils/formatters';
import { Eye, Code } from 'lucide-react';

export function DocumentTemplateManagerPage() {
  const [selected, setSelected] = useState(mockDocumentTemplates[0]);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <PageScaffold
      title="Document Template Manager"
      subtitle="Manage certificate and document templates"
      breadcrumbs={[{ label: 'Documents' }, { label: 'Templates' }]}
      moduleTag="Documents"
      priorityTag="P1"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template list */}
        <div>
          <Card padding={false}>
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Templates ({mockDocumentTemplates.length})</h3>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {mockDocumentTemplates.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => setSelected(tpl)}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selected?.id === tpl.id ? 'bg-forest/5 border-l-2 border-forest' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{tpl.documentType}</p>
                      <p className="text-xs text-slate-500 mt-0.5">v{tpl.version}</p>
                    </div>
                    <StatusChip status={tpl.isActive ? 'Active' : 'Inactive'} />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Template details */}
        <div className="lg:col-span-2">
          {selected && (
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{selected.documentType}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Version: {selected.version} · Last updated: {formatDate(selected.lastUpdatedAt)} by {selected.lastUpdatedBy}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusChip status={selected.isActive ? 'Active' : 'Inactive'} />
                  <Button size="sm" variant="secondary" onClick={() => setPreviewOpen(true)}>
                    <Eye size={14} /> Preview
                  </Button>
                </div>
              </div>

              {/* Variables */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Code size={14} className="text-slate-500" />
                  <h4 className="text-sm font-semibold text-slate-700">Template Variables / Placeholders</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.variables.map(v => (
                    <code key={v} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono border border-slate-200">{v}</code>
                  ))}
                </div>
              </div>

              {/* Template body preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
{`Republic of the Philippines
Province of ${BARANGAY_INFO.province}
Municipality of ${BARANGAY_INFO.municipality}
${BARANGAY_INFO.name.toUpperCase()}

${selected.documentType.toUpperCase()}

TO WHOM IT MAY CONCERN:

This is to certify that {{resident_name}}, of legal age,
{{civil_status}}, Filipino citizen, is a bona fide resident
of this barangay with address at {{address}}.

This certification is issued for the purpose of {{purpose}}.

Issued this {{date_issued}} at ${BARANGAY_INFO.name}.

Reference No.: {{reference_no}}

_______________________________
${BARANGAY_INFO.punongBarangay}
Punong Barangay`}
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary">Edit Template</Button>
                <Button size="sm" variant="secondary">Version History</Button>
                {!selected.isActive && <Button size="sm" variant="primary">Activate</Button>}
              </div>
              <p className="text-xs text-slate-400 mt-3 italic">Template editing and versioning are simulated in this prototype. Backend: integrate with document template engine in production.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Preview modal */}
      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title={`Preview: ${selected?.documentType}`} size="lg">
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-sm">
          <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
            <p className="text-xs text-slate-500">Republic of the Philippines</p>
            <p className="text-xs text-slate-500">{BARANGAY_INFO.municipality}, {BARANGAY_INFO.province}</p>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{BARANGAY_INFO.name.toUpperCase()}</h2>
          </div>
          <h3 className="text-center font-bold uppercase tracking-wide mb-6">{selected?.documentType}</h3>
          <p className="mb-3">TO WHOM IT MAY CONCERN:</p>
          <p className="mb-3 text-slate-700 leading-relaxed">This is to certify that <strong>[Resident Name]</strong>, of legal age, [Civil Status], Filipino citizen, is a bona fide resident of this barangay located at [Address], [Purok].</p>
          <p className="mb-3 text-slate-700">This certification is issued upon the request of the above-named individual for the purpose of <strong>[Purpose]</strong>.</p>
          <p className="mb-6 text-slate-700">Issued this <strong>[Date Issued]</strong> at {BARANGAY_INFO.name}, {BARANGAY_INFO.municipality}.</p>
          <div className="text-center mt-10">
            <div className="border-t border-slate-800 pt-2 w-48 mx-auto">
              <p className="font-bold text-sm">{BARANGAY_INFO.punongBarangay}</p>
              <p className="text-xs text-slate-500">Punong Barangay</p>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-slate-400">Reference No.: [REF-NO] · Verify at: /public/verify</div>
        </div>
      </Modal>
    </PageScaffold>
  );
}
