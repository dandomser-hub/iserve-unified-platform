import React, { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useRole } from '@/app/providers/RoleProvider';
import { useAudit } from '@/app/providers/AuditProvider';
import { formatDateTime } from '@/utils/formatters';
import { MessageSquare, Lock, AlertCircle } from 'lucide-react';
import { mockMunicipalReviews } from '@/data/mockReports';

export function MunicipalReviewDashboardPage() {
  const { roleId } = useRole();
  const { logEvent } = useAudit();
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState('');

  const isReviewer = roleId === 'municipal_reviewer';

  const handleViewDetails = (review: any) => {
    setSelectedReview(review);
    setShowDetailPanel(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    logEvent({
      action: 'Created',
      module: 'Reports',
      recordLabel: selectedReview?.reportTitle,
      description: `Added comment to review: ${newComment.substring(0, 50)}...`,
    });

    alert('Comment added successfully');
    setNewComment('');
    setShowCommentModal(false);
  };

  return (
    <PageScaffold
      title="Municipal Review Dashboard"
      subtitle="Review Status and Comments"
      moduleTag="Review"
      priorityTag="P1"
    >
      <div className="space-y-6">
        {/* Role-based Notice */}
        {!isReviewer && (
          <Card className="p-4 bg-blue-50 border-l-4 border-l-blue-600 flex items-start gap-3">
            <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Read-Only View
              </p>
              <p className="text-sm text-blue-800 mt-1">
                You are viewing reviews in read-only mode. Municipal reviewers can add
                comments and manage review status.
              </p>
            </div>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {mockMunicipalReviews && mockMunicipalReviews.length > 0 ? (
            mockMunicipalReviews.map((review) => (
              <div key={review.id} onClick={() => handleViewDetails(review)} className="cursor-pointer">
              <Card
                className="p-6 hover:shadow-md transition-shadow border-l-4 border-l-indigo-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {review.reportTitle}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Module:</span> {review.module}
                      </p>
                      <p>
                        <span className="font-medium">Submitted by:</span>{' '}
                        {review.submittedBy}
                      </p>
                      <p>
                        <span className="font-medium">Submitted:</span>{' '}
                        {formatDateTime(review.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col items-end gap-3">
                    <StatusChip status={review.reviewStatus} />
                    <p className="text-xs text-gray-500">
                      {review.comments?.length || 0} comments
                    </p>
                  </div>
                </div>
              </Card>
              </div>
            ))
          ) : (
            <Card className="p-12 text-center">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No reviews available</p>
            </Card>
          )}
        </div>

        {/* Detail Panel Modal */}
        <Modal
          isOpen={showDetailPanel}
          onClose={() => setShowDetailPanel(false)}
          title={selectedReview?.reportTitle}
          size="lg"
        >
          {selectedReview && (
            <div className="space-y-6">
              {/* Review Information */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Module
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedReview.module}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Status
                  </p>
                  <div className="mt-1">
                    <StatusChip status={selectedReview.reviewStatus} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Submitted By
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {selectedReview.submittedBy}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">
                    Submitted At
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDateTime(selectedReview.submittedAt)}
                  </p>
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Comments ({selectedReview.comments?.length || 0})
                  </h4>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {selectedReview.comments && selectedReview.comments.length > 0 ? (
                    selectedReview.comments.map((comment: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 rounded border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900">
                            {comment.authorName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(comment.createdAt)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No comments yet
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <Button variant="ghost" onClick={() => setShowDetailPanel(false)}>
                  Close
                </Button>

                {isReviewer && (
                  <Button
                    variant="primary"
                    onClick={() => setShowCommentModal(true)}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Add Comment
                  </Button>
                )}

                {!isReviewer && (
                  <Button variant="secondary" disabled className="opacity-50">
                    <Lock className="h-4 w-4 mr-2" />
                    Reviewer Only
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>

        {/* Comment Modal */}
        <Modal
          isOpen={showCommentModal}
          onClose={() => {
            setShowCommentModal(false);
            setNewComment('');
          }}
          title="Add Comment"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Comment
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment or feedback..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCommentModal(false);
                  setNewComment('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageScaffold>
  );
}
