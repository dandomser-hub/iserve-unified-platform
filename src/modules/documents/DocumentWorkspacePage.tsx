import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Eye, AlertTriangle } from 'lucide-react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip, Badge, PrivacyBadge } from '@/components/ui/Badge';
import { Timeline, type TimelineEvent } from '@/components/ui/Timeline';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/FormField';
import { RoleGate } from '@/components/shared/RoleGate';
import { useMockData } from '@/app/providers/MockDataProvider';
import { useAudit } from '@/app/providers/AuditProvider';
import { useRole } from '@/app/providers/RoleProvider';
import { formatDateTime, formatCurrency } from '@/utils/formatters';
import type { DocumentStatus } from '@/types/document';

const ROLE_ACTIONS: Record<string, { validate?: boolean; approve?: boolean; release?: boolean; returnDoc?: boolean }> = {
  barangay_secretary: { validate: true, returnDoc: true },
  punong_barangay: { approve: true, returnDoc: true },
  barangay_treasurer: {},
  system_admin: { validate: true, approve: true, release: true, returnDoc: true },
};

export function DocumentWorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { documentRequests, setDocumentRequests, showToast } = useMockData();
  const { logEvent } = useAudit();
  const { roleId } = useRole();
  const [remarksModal, setRemarksModal] = useState<'return' | null>(null);
  const [remarks, setRemarks] = useState('');

  const doc = documentRequests.find(d => d.id === id);
  if (!doc) {
    return (
      <PageScaffold title="Document Not Found" breadcrumbs={[{ label: 'Queue', href: '/documents/queue' }, { label: 'Workspace' }]}>
        <Button variant="secondary" onClick={() => navigate('/documents/queue')}><ArrowLeft size={15} /> Back to Queue</Button>
      </PageScaffold>
    );
  }

  const canActions = ROLE_ACTIONS[roleId || ''] || {};

  function transition(toStatus: DocumentStatus, action: string, actionRemarks?: string) {
    const now = new Date().toISOString();
    setDocumentRequests(prev => prev.map(d => d.id === doc!.id ? {
      ...d,
      status: toStatus,
      updatedAt: now,
      workflowHistory: [...d.workflowHistory, { id: `WF${Date.now()}`, fromStatus: d.status, toStatus, action, performedBy: roleId || 'System', performedAt: now, remarks: actionRemarks }],
    } : d));
    logEvent({ action: toStatus === 'Released' ? 'Released' : toStatus === 'Approved' ? 'Approved' : toStatus === 'Returned' ? 'Returned' : 'Updated', module: 'Documents', recordId: doc!.id, recordLabel: `${doc!.requestNo} - ${doc!.documentType}`, description: `${action}: ${doc!.documentType} for ${doc!.residentName}` });
    showToast(`Document ${action.toLowerCase()} successfully.`);
    setRemarksModal(null);
  }

  const timelineEvents: TimelineEvent[] = doc.workflowHistory.map(e => ({
    id: e.id, label: e.action, status: e.toStatus, timestamp: e.performedAt, actor: e.performedBy, remarks: e.remarks,
  }));

  return (
    <PageScaffold
      title={`${doc.documentType}`}
      subtitle={`${doc.requestNo} · ${doc.residentName}`}
      breadcrumbs={[{ label: 'Queue', href: '/documents/queue' }, { label: doc.requestNo }]}
      moduleTag="Documents"
      priorityTag="P0"
      actions={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => navigate('/documents/queue')}><ArrowLeft size={14} /> Queue</Button>
          {doc.status === 'Approved' && (
            <Button size="sm" variant="primary" onClick={() => navigate(`/documents/${id}/preview-release`)}>
              <Eye size={14} /> Preview & Release
            </Button>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Summary card */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusChip status={doc.status} />
                  <PrivacyBadge level="Internal" />
                  {doc.hasBlotterFlag && <Badge label="Blotter Flag" variant="warning" />}
                  {doc.hasKPFlag && <Badge label="KP Flag" variant="warning" />}
                </div>
                <h3 className="font-semibold text-slate-800 mt-2">{doc.documentType}</h3>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Request No.', doc.requestNo],
                ['Resident', doc.residentName],
                ['Purpose', doc.purpose],
                ['Fee Reference', doc.feeAmount !== undefined ? (doc.feeAmount === 0 ? 'No fee / Exempt' : formatCurrency(doc.feeAmount)) : '—'],
                ['Created', formatDateTime(doc.createdAt)],
                ['Last Updated', formatDateTime(doc.updatedAt)],
                ['Assigned To', doc.assignedTo || '—'],
                ['Released By', doc.releasedBy || '—'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-slate-500">{k}</dt>
                  <dd className="font-medium text-slate-800">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 p-2 bg-slate-50 rounded-lg text-xs text-slate-500 italic">Fee reference only. Not an accounting ledger entry.</div>
          </Card>

          {/* Requirements */}
          <Card>
            <h3 className="font-semibold text-slate-800 mb-3">Requirements Checklist</h3>
            <div className="space-y-2">
              {doc.requirements.map((req, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg ${req.submitted ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200'}`}>
                  {req.submitted ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" /> : <XCircle size={16} className="text-slate-300 flex-shrink-0" />}
                  <span className="text-sm text-slate-700">{req.label}</span>
                  {req.required && <Badge label="Required" variant="danger" />}
                  {!req.required && <Badge label="Optional" variant="neutral" />}
                </div>
              ))}
            </div>
          </Card>

          {/* Flags */}
          {(doc.hasBlotterFlag || doc.hasKPFlag) && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-semibold text-amber-800">Active Case Flags</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  This resident has {doc.hasBlotterFlag ? 'an active blotter record' : ''}{doc.hasKPFlag ? ', an open KP case' : ''}. Punong Barangay review may be required.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Workflow panel */}
        <div className="space-y-4">
          {/* Actions */}
          <Card>
            <h3 className="font-semibold text-slate-800 mb-4">Workflow Actions</h3>

            <RoleGate permission="documents.validate" showLocked lockedMessage="Validation requires Secretary role.">
              {doc.status === 'For Validation' && canActions.validate && (
                <div className="space-y-2">
                  <Button variant="primary" className="w-full" onClick={() => transition('For Approval', 'Validated by Secretary')}>
                    <CheckCircle size={15} /> Validate &amp; Forward to PB
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => setRemarksModal('return')}>
                    <RotateCcw size={15} /> Return for Correction
                  </Button>
                </div>
              )}
            </RoleGate>

            <RoleGate permission="documents.approve" showLocked lockedMessage="Approval requires Punong Barangay role.">
              {doc.status === 'For Approval' && canActions.approve && (
                <div className="space-y-2">
                  <Button variant="primary" className="w-full" onClick={() => transition('Approved', 'Approved by Punong Barangay')}>
                    <CheckCircle size={15} /> Approve Document
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => setRemarksModal('return')}>
                    <RotateCcw size={15} /> Return for Revision
                  </Button>
                </div>
              )}
            </RoleGate>

            {doc.status === 'Approved' && (
              <Button variant="primary" className="w-full" onClick={() => navigate(`/documents/${id}/preview-release`)}>
                <Eye size={15} /> Preview &amp; Release
              </Button>
            )}

            {['Released', 'Cancelled'].includes(doc.status) && (
              <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-500 text-center">
                This document has been {doc.status.toLowerCase()}. No further workflow actions.
              </div>
            )}

            {doc.status === 'Draft' && (
              <Button variant="primary" className="w-full" onClick={() => transition('For Validation', 'Submitted for validation')}>
                Submit for Validation
              </Button>
            )}
          </Card>

          {/* Timeline */}
          <Card>
            <h3 className="font-semibold text-slate-800 mb-4">Workflow Timeline</h3>
            <Timeline events={timelineEvents} />
          </Card>
        </div>
      </div>

      {/* Return modal */}
      <Modal
        isOpen={remarksModal === 'return'}
        onClose={() => setRemarksModal(null)}
        title="Return Document"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRemarksModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => transition('Returned', 'Returned', remarks)} disabled={!remarks}>Confirm Return</Button>
          </div>
        }
      >
        <div>
          <p className="text-sm text-slate-600 mb-3">Provide a reason for returning this document request.</p>
          <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Enter reason for return..." rows={3} />
        </div>
      </Modal>
    </PageScaffold>
  );
}
