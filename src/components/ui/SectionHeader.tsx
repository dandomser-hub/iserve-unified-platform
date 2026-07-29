import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  moduleTag?: string;
  priorityTag?: 'P0' | 'P1' | 'P2' | 'P3';
  actions?: ReactNode;
}

const PRIORITY_COLORS = {
  P0: 'bg-green-100 text-green-700',
  P1: 'bg-sky-100 text-sky-700',
  P2: 'bg-amber-100 text-amber-700',
  P3: 'bg-slate-100 text-slate-600',
};

export function SectionHeader({ title, subtitle, breadcrumbs, moduleTag, priorityTag, actions }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={12} />}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-slate-600 transition-colors">{crumb.label}</a>
              ) : (
                <span className={i === breadcrumbs.length - 1 ? 'text-slate-600 font-medium' : ''}>{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
      {/* Tags row */}
      {(moduleTag || priorityTag) && (
        <div className="flex items-center gap-2 mb-2">
          {moduleTag && (
            <span className="px-2 py-0.5 bg-forest/10 text-forest rounded text-xs font-semibold">{moduleTag}</span>
          )}
          {priorityTag && (
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${PRIORITY_COLORS[priorityTag]}`}>{priorityTag} — {priorityTag === 'P0' ? 'Core' : priorityTag === 'P1' ? 'Full MVP' : priorityTag === 'P2' ? 'Phase 2' : 'Deferred'}</span>
          )}
        </div>
      )}
      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
