import React, { useState, useMemo } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { SearchFilterBar } from '@/components/shared/SearchFilterBar';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui/Badge';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { formatDateTime } from '@/utils/formatters';
import { MessageCircle } from 'lucide-react';
import { mockMunicipalReviews } from '@/data/mockReports';

export function ReviewerCommentLoopPage() {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Flatten comments from all reviews
  const allComments = useMemo(() => {
    const comments: any[] = [];

    mockMunicipalReviews.forEach((review) => {
      review.comments.forEach((comment) => {
        comments.push({
          id: `${review.id}-${comment.id}`,
          reportTitle: review.reportTitle,
          commentText: comment.commentText,
          commentedBy: comment.commentedBy,
          commentedAt: comment.commentedAt,
          assignedTo: comment.assignedTo || 'Unassigned',
          status: comment.status || 'Open',
        });
      });
    });

    return comments;
  }, []);

  // Filter comments
  const filteredComments = useMemo(() => {
    return allComments.filter((comment) => {
      const matchesSearch =
        comment.reportTitle
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        comment.commentText
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        comment.commentedBy
          ?.toLowerCase()
          .includes(searchValue.toLowerCase());

      const matchesStatus = !statusFilter || comment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allComments, searchValue, statusFilter]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === 'all' ? null : value);
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Open', label: 'Open' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Noted', label: 'Noted' },
  ];

  const columns: Column<any>[] = [
    { key: 'reportTitle', header: 'Report', render: (c) => c.reportTitle },
    { key: 'commentText', header: 'Comment', render: (c) => <span title={c.commentText} className="truncate block">{c.commentText}</span> },
    { key: 'commentedBy', header: 'Commented By', render: (c) => c.commentedBy },
    { key: 'commentedAt', header: 'Date', render: (c) => formatDateTime(c.commentedAt) },
    { key: 'assignedTo', header: 'Assigned To', render: (c) => c.assignedTo },
    { key: 'status', header: 'Status', render: (c) => <StatusChip status={c.status} /> },
  ];

  return (
    <PageScaffold
      title="Reviewer Comment Loop"
      subtitle="All Review Comments Across Reports"
      moduleTag="Review"
      priorityTag="P1"
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <SearchFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          placeholder="Search comments by report, text, or reviewer..."
          filters={
            <select value={statusFilter || 'all'} onChange={(e) => handleStatusFilterChange(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest">
              <option value="all">All Statuses</option>
              {statusOptions.slice(1).map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          }
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
              Total Comments
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredComments.length}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
              Open
            </p>
            <p className="text-2xl font-bold text-yellow-600">
              {filteredComments.filter((c) => c.status === 'Open').length}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
              Resolved
            </p>
            <p className="text-2xl font-bold text-green-600">
              {filteredComments.filter((c) => c.status === 'Resolved').length}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
              Noted
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {filteredComments.filter((c) => c.status === 'Noted').length}
            </p>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <DataTable
            columns={columns}
            data={filteredComments}
            rowKey={c => c.id}
            emptyMessage="No comments found"
          />
        </Card>
      </div>
    </PageScaffold>
  );
}
