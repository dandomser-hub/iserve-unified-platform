import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { PrintPreview } from '@/components/ui/PrintPreview';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/Badge';
import { useMockData } from '@/app/providers/MockDataProvider';
import { useAudit } from '@/app/providers/AuditProvider';
import { formatDate } from '@/utils/formatters';
import { BARANGAY_INFO } from '@/data/mockReferenceData';
import type { DocumentStatus } from '@/types/document';

export function DocumentPreviewReleasePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documentRequests, setDocumentRequests, showToast } = useMockData();
  const { logEvent } = useAudit();
  const [released, setReleased] = useState(false);

  const doc = documentRequests.find(d => d.id === id);
  if (!doc) {
    return (
      <PageScaffold title="Document Not Found" breadcrumbs={[{ label: 'Queue', href: '/documents/queue' }]}>
        <Button variant="secondary" onClick={() => navigate('/documents/queue')}><ArrowLeft size={15} /> Back</Button>
      </PageScaffold>
    );
  }

  const refNo = doc.referenceNo || `${doc.documentType.slice(0, 2).toUpperCase()}-2024-${doc.id.replace('DOC', '').padStart(4, '0')}`;
  const verCode = doc.verificationCode || `VRF-${doc.id}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  function handleRelease() {
    const now = new Date().toISOString();
    setDocumentRequests(prev => prev.map(d => d.id === doc!.id ? {
      ...d,
      status: 'Released' as DocumentStatus,
      referenceNo: refNo,
      verificationCode: verCode,
      releasedAt: now,
      releasedBy: 'Secretary Santos',
      updatedAt: now,
      workflowHistory: [...d.workflowHistory, { id: `WF${Date.now()}`, fromStatus: 'Approved', toStatus: 'Released' as DocumentStatus, action: 'Released to requester', performedBy: 'Secretary Santos', performedAt: now }],
    } : d));
    logEvent({ action: 'Released', module: 'Documents', recordId: doc!.id, recordLabel: `${doc!.requestNo} - ${doc!.documentType}`, description: `Document released to ${doc!.residentName}. Reference: ${refNo}` });
    showToast(`Document released successfully. Reference: ${refNo}`);
    setReleased(true);
  }

  return (
    <PageScaffold
      title="Document Preview & Release"
      subtitle={`${doc.requestNo} · ${doc.documentType}`}
      breadcrumbs={[{ label: 'Queue', href: '/documents/queue' }, { label: doc.requestNo }, { label: 'Preview & Release' }]}
      moduleTag="Documents"
      priorityTag="P0"
      actions={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => navigate(`/documents/${id}/workspace`)}><ArrowLeft size={14} /> Workspace</Button>
          {doc.status === 'Approved' && !released && (
            <Button size="sm" variant="primary" onClick={handleRelease}>
              <CheckCircle size={14} /> Confirm Release
            </Button>
          )}
        </div>
      }
    >
      {(doc.status === 'Released' || released) && (
        <div className="mb-4 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-semibold text-green-800">Document Released</p>
            <p className="text-xs text-green-600">Reference: {refNo} · Verification: {verCode}</p>
          </div>
          <StatusChip status="Released" className="ml-auto" />
        </div>
      )}

      <PrintPreview
        documentTitle={doc.documentType.toUpperCase()}
        referenceNo={refNo}
        onClose={() => navigate(`/documents/${id}/workspace`)}
      >
        <p className="mb-4">
          TO WHOM IT MAY CONCERN:
        </p>
        <p className="mb-4">
          This is to certify that <strong>{doc.residentName}</strong> is a bona fide resident of {BARANGAY_INFO.name}, {BARANGAY_INFO.municipality}, {BARANGAY_INFO.province}, and is known to be of good standing in this community.
        </p>
        <p className="mb-4">
          This certification is issued upon the request of the above-named individual for the purpose of <strong>{doc.purpose}</strong>.
        </p>
        <p className="mb-4">
          Issued this <strong>{formatDate(new Date().toISOString())}</strong> at {BARANGAY_INFO.name}, {BARANGAY_INFO.municipality}, {BARANGAY_INFO.province}.
        </p>
      </PrintPreview>
    </PageScaffold>
  );
}
