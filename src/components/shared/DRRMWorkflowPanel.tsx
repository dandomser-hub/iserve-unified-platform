import { useState } from 'react';
import { CheckCircle, RotateCcw, Send, ShieldCheck } from 'lucide-react';
import { useRole } from '@/app/providers/RoleProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/FormField';
import { StatusChip } from '@/components/ui/Badge';
import { Timeline, type TimelineEvent } from '@/components/ui/Timeline';
import type {
  DRRMReportStatus,
  DRRMWorkflowAction,
  DRRMWorkflowHistoryEntry,
} from '@/types/drrm';
import { getDRRMWorkflowActions } from '@/utils/drrmWorkflow';

interface DRRMWorkflowPanelProps {
  status: DRRMReportStatus;
  history?: DRRMWorkflowHistoryEntry[];
  validationIssues: string[];
  onTransition: (action: DRRMWorkflowAction, remarks?: string) => void;
}

const ACTION_ICONS: Record<DRRMWorkflowAction, typeof Send> = {
  'submit-for-review': ShieldCheck,
  approve: CheckCircle,
  return: RotateCcw,
  submit: Send,
};

export function DRRMWorkflowPanel({
  status,
  history = [],
  validationIssues,
  onTransition,
}: DRRMWorkflowPanelProps) {
  const { roleId } = useRole();
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const actions = getDRRMWorkflowActions(status, roleId);

  const timelineEvents: TimelineEvent[] = [...history].reverse().map(entry => ({
    id: entry.id,
    label: entry.actionLabel,
    status: entry.toStatus,
    timestamp: entry.performedAt,
    actor: entry.performedBy,
    remarks: entry.remarks,
  }));

  function runAction(action: DRRMWorkflowAction) {
    if (action === 'return') {
      setReturnModalOpen(true);
      return;
    }
    onTransition(action);
  }

  function confirmReturn() {
    onTransition('return', remarks);
    setRemarks('');
    setReturnModalOpen(false);
  }

  return (
    <>
      <Card>
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold text-slate-800">Report Workflow</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Role-controlled validation, approval, return, and submission
            </p>
          </div>
          <StatusChip status={status} />
        </div>

        <div className="p-4 space-y-4">
          {actions.some(action => action.action === 'submit-for-review') &&
            validationIssues.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                <p className="font-semibold">Resolve before review</p>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  {validationIssues.map(issue => <li key={issue}>{issue}</li>)}
                </ul>
              </div>
            )}

          {actions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {actions.map(action => {
                const Icon = ACTION_ICONS[action.action];
                const blocked =
                  action.action === 'submit-for-review' && validationIssues.length > 0;
                return (
                  <Button
                    key={action.action}
                    variant={action.action === 'return' ? 'secondary' : 'primary'}
                    onClick={() => runAction(action.action)}
                    disabled={blocked}
                  >
                    <Icon size={15} />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              {['Submitted', 'Archived', 'Exported'].includes(status)
                ? 'This report has no further prototype workflow action.'
                : 'No workflow action is available for your current role and this status.'}
            </p>
          )}

          <div className="pt-3 border-t border-slate-200">
            <h5 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Workflow History
            </h5>
            {timelineEvents.length > 0 ? (
              <Timeline events={timelineEvents} />
            ) : (
              <p className="text-xs text-slate-500">
                No transition recorded yet. This record is at its initial prototype status.
              </p>
            )}
          </div>
        </div>
      </Card>

      <Modal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        title="Return DRRM Report"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setReturnModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmReturn} disabled={!remarks.trim()}>
              Confirm Return
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600 mb-3">
          State the correction required. The reason will be retained in workflow history and the
          audit trail.
        </p>
        <Textarea
          value={remarks}
          onChange={event => setRemarks(event.target.value)}
          placeholder="Enter the specific reason for return..."
          rows={4}
        />
      </Modal>
    </>
  );
}
