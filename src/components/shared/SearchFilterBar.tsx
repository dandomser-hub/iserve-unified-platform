import { Search, X } from 'lucide-react';
import type { ReactNode } from 'react';

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  placeholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
}

export function SearchFilterBar({ searchValue, onSearchChange, placeholder = 'Search...', filters, actions }: SearchFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-200 bg-slate-50/50">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
        <input
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest bg-white"
        />
        {searchValue && (
          <button onClick={() => onSearchChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X size={14} />
          </button>
        )}
      </div>
      {/* Filters slot */}
      {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
      {/* Actions slot (right side) */}
      {actions && <div className="flex items-center gap-2 ml-auto">{actions}</div>}
    </div>
  );
}
