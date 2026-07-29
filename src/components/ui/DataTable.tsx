import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  compact?: boolean;
}

export function DataTable<T>({ columns, data, rowKey, onRowClick, emptyMessage = 'No records found.', compact }: DataTableProps<T>) {
  const cellPad = compact ? 'px-3 py-2' : 'px-4 py-3';

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {columns.map(col => (
              <th key={col.key} className={`${cellPad} text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 ${col.headerClassName || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map(row => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''} transition-colors`}
            >
              {columns.map(col => (
                <td key={col.key} className={`${cellPad} text-slate-800 ${col.className || ''}`}>
                  {col.render ? col.render(row) : (row as Record<string, ReactNode>)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPage: (page: number) => void;
  totalItems: number;
  pageSize: number;
}

export function Pagination({ currentPage, totalPages, onPage, totalItems, pageSize }: PaginationProps) {
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-sm text-slate-600">
      <span>Showing {from}–{to} of {totalItems} records</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(currentPage - 1)} disabled={currentPage <= 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="px-2 text-xs font-medium">{currentPage} / {totalPages}</span>
        <button onClick={() => onPage(currentPage + 1)} disabled={currentPage >= totalPages} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
