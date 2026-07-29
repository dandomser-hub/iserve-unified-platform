import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FormField, Input, Select, Textarea } from '@/components/ui/FormField';
import { Badge } from '@/components/ui/Badge';
import { useMockData } from '@/app/providers/MockDataProvider';
import { useAudit } from '@/app/providers/AuditProvider';
import { DOCUMENT_TYPES, PUROKS } from '@/data/mockReferenceData';
import type { DocumentRequest, DocumentType, DocumentRequirement } from '@/types/document';

const DOCUMENT_REQUIREMENTS: Partial<Record<DocumentType, DocumentRequirement[]>> = {
  'Barangay Clearance': [
    { label: 'Valid Government-Issued ID', required: true, submitted: false },
    { label: 'Proof of Residency', required: true, submitted: false },
    { label: 'Community Tax Certificate (CTC)', required: false, submitted: false },
  ],
  'Certificate of Indigency': [
    { label: 'Valid ID', required: true, submitted: false },
    { label: 'Proof of Indigency (if available)', required: false, submitted: false },
  ],
  'First Time Jobseeker Certification': [
    { label: 'Valid ID or School ID', required: true, submitted: false },
    { label: 'Affidavit of First Time Jobseeker', required: true, submitted: false },
    { label: 'Barangay Residency Proof', required: true, submitted: false },
  ],
  'Business Clearance': [
    { label: 'Business Registration (DTI/SEC)', required: true, submitted: false },
    { label: 'Valid ID of Owner', required: true, submitted: false },
    { label: 'Barangay Clearance (previous year)', required: false, submitted: false },
  ],
};

const DEFAULT_REQUIREMENTS: DocumentRequirement[] = [
  { label: 'Valid Government-Issued ID', required: true, submitted: false },
];

const DOCUMENT_FEES: Partial<Record<string, number>> = {
  'Barangay Clearance': 50,
  'Certificate of Residency': 30,
  'Certificate of Indigency': 0,
  'Certificate of Good Moral Character': 50,
  'First Time Jobseeker Certification': 0,
  'Business Clearance': 200,
  'Certificate of Appearance': 30,
  'Certificate of Unemployment': 30,
  'Blotter Certification': 75,
  'KP Certification': 75,
};

export function DocumentRequestIntakePage() {
  const { residents, documentRequests, setDocumentRequests, showToast } = useMockData();
  const { logEvent } = useAudit();
  const navigate = useNavigate();

  const [residentSearch, setResidentSearch] = useState('');
  const [selectedResident, setSelectedResident] = useState<string>('');
  const [docType, setDocType] = useState<DocumentType | ''>('');
  const [purpose, setPurpose] = useState('');
  const [requirements, setRequirements] = useState<DocumentRequirement[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const filteredResidents = residents.filter(r => {
    const q = residentSearch.toLowerCase();
    return !q || `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) || r.residentNo.toLowerCase().includes(q);
  }).slice(0, 6);

  const selectedRes = residents.find(r => r.id === selectedResident);
  const feeAmount = docType ? (DOCUMENT_FEES[docType] ?? 0) : null;
  const hasBlotterFlag = selectedRes ? false : false; // Simplified for prototype

  function handleDocTypeChange(type: DocumentType) {
    setDocType(type);
    setRequirements(DOCUMENT_REQUIREMENTS[type] || DEFAULT_REQUIREMENTS);
  }

  function toggleRequirement(idx: number) {
    setRequirements(prev => prev.map((req, i) => i === idx ? { ...req, submitted: !req.submitted } : req));
  }

  function handleSubmit() {
    if (!selectedResident || !docType || !purpose) return;
    const newReq: DocumentRequest = {
      id: `DOC${Date.now()}`,
      requestNo: `REQ-2024-${String(documentRequests.length + 1).padStart(3, '0')}`,
      residentId: selectedResident,
      residentName: selectedRes ? `${selectedRes.lastName}, ${selectedRes.firstName}` : '—',
      documentType: docType as DocumentType,
      purpose,
      requirements,
      feeAmount: feeAmount ?? 0,
      hasBlotterFlag: false,
      hasKPFlag: false,
      status: 'For Validation',
      createdBy: 'Secretary Santos',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workflowHistory: [
        { id: `WF${Date.now()}`, toStatus: 'Draft', action: 'Created', performedBy: 'Secretary Santos', performedAt: new Date().toISOString() },
        { id: `WF${Date.now() + 1}`, fromStatus: 'Draft', toStatus: 'For Validation', action: 'Submitted for validation', performedBy: 'Secretary Santos', performedAt: new Date().toISOString() },
      ],
    };
    setDocumentRequests(prev => [...prev, newReq]);
    logEvent({ action: 'Created', module: 'Documents', recordId: newReq.id, recordLabel: `${newReq.requestNo} - ${docType}`, description: `Document request created for ${newReq.residentName}: ${docType}` });
    showToast(`Document request ${newReq.requestNo} created and submitted for validation.`);
    setSubmitted(true);
    setTimeout(() => { navigate('/documents/queue'); }, 1500);
  }

  if (submitted) {
    return (
      <PageScaffold title="Request Submitted" breadcrumbs={[{ label: 'Documents' }, { label: 'Intake' }]}>
        <div className="flex flex-col items-center py-16 text-center">
          <CheckCircle size={48} className="text-green-500 mb-4" />
          <h2 className="text-lg font-semibold text-slate-800">Request Successfully Created</h2>
          <p className="text-sm text-slate-500 mt-1">Redirecting to document queue...</p>
        </div>
      </PageScaffold>
    );
  }

  return (
    <PageScaffold
      title="Document Request Intake"
      subtitle="Create a new document request for a resident"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Documents' }, { label: 'Intake' }]}
      moduleTag="Documents"
      priorityTag="P0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Step 1: Select resident */}
          <Card>
            <h3 className="font-semibold text-slate-800 mb-4">1. Select Resident</h3>
            <FormField label="Search Resident">
              <Input
                value={residentSearch}
                onChange={e => { setResidentSearch(e.target.value); if (selectedResident) setSelectedResident(''); }}
                placeholder="Type name or resident no..."
              />
            </FormField>
            {residentSearch && !selectedResident && (
              <div className="mt-2 border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white shadow-sm max-h-52 overflow-y-auto">
                {filteredResidents.length === 0 ? (
                  <p className="text-sm text-slate-400 p-3">No residents found.</p>
                ) : filteredResidents.map(r => (
                  <button key={r.id} onClick={() => { setSelectedResident(r.id); setResidentSearch(`${r.lastName}, ${r.firstName} (${r.residentNo})`); }} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors">
                    <p className="text-sm font-medium text-slate-800">{r.lastName}, {r.firstName} {r.middleName}</p>
                    <p className="text-xs text-slate-500">{r.residentNo} · {r.purok}</p>
                  </button>
                ))}
              </div>
            )}
            {selectedRes && (
              <div className="mt-3 p-3 bg-forest/5 border border-forest/20 rounded-lg">
                <p className="text-sm font-semibold text-slate-800">{selectedRes.lastName}, {selectedRes.firstName} {selectedRes.middleName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{selectedRes.residentNo} · {selectedRes.purok} · Age {selectedRes.age}</p>
              </div>
            )}
          </Card>

          {/* Step 2: Document type */}
          <Card>
            <h3 className="font-semibold text-slate-800 mb-4">2. Select Document Type</h3>
            <FormField label="Document Type" required>
              <Select value={docType} onChange={e => handleDocTypeChange(e.target.value as DocumentType)}>
                <option value="">— Select document type —</option>
                {DOCUMENT_TYPES.slice(0, 11).map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </FormField>
            <div className="mt-4"><FormField label="Purpose / Reason" required>
              <Textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="State the purpose of the document request" rows={3} />
            </FormField></div>
          </Card>

          {/* Step 3: Requirements */}
          {docType && (
            <Card>
              <h3 className="font-semibold text-slate-800 mb-4">3. Requirements Checklist</h3>
              <div className="space-y-2">
                {requirements.map((req, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="checkbox" checked={req.submitted} onChange={() => toggleRequirement(idx)} className="rounded text-forest focus:ring-forest" />
                    <div className="flex-1">
                      <span className="text-sm text-slate-800">{req.label}</span>
                      {req.required ? <Badge label="Required" variant="danger" className="ml-2" /> : <Badge label="Optional" variant="neutral" className="ml-2" />}
                    </div>
                    {req.submitted && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
                  </label>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Summary sidebar */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-slate-800 mb-3">Request Summary</h3>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-xs text-slate-500">Resident</dt><dd className="font-medium text-slate-800">{selectedRes ? `${selectedRes.lastName}, ${selectedRes.firstName}` : '—'}</dd></div>
              <div><dt className="text-xs text-slate-500">Document Type</dt><dd className="font-medium text-slate-800">{docType || '—'}</dd></div>
              <div><dt className="text-xs text-slate-500">Purpose</dt><dd className="text-slate-700">{purpose || '—'}</dd></div>
              <div><dt className="text-xs text-slate-500">Fee Reference</dt>
                <dd className="font-medium text-slate-800">
                  {docType ? (feeAmount === 0 ? 'No fee / Exempt' : `PHP ${feeAmount}.00`) : '—'}
                </dd>
              </div>
            </dl>
            {hasBlotterFlag && (
              <div className="mt-3 flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-700">Blotter/KP record flag detected for this resident.</p>
              </div>
            )}
            <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xs text-slate-500 italic">Fee reference only. Not an accounting transaction.</p>
            </div>
          </Card>

          <Button
            variant="primary"
            className="w-full"
            disabled={!selectedResident || !docType || !purpose}
            onClick={handleSubmit}
          >
            <Plus size={15} /> Create Request &amp; Submit to Queue
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => navigate('/documents/queue')}>Cancel</Button>
        </div>
      </div>
    </PageScaffold>
  );
}
