import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: 'forest' | 'ocean' | 'grass' | 'sky' | 'amber' | 'red' | 'slate';
  trend?: { direction: 'up' | 'down'; label: string };
}

const STAT_COLORS = {
  forest: 'bg-forest/10 text-forest',
  ocean: 'bg-ocean/10 text-ocean',
  grass: 'bg-grass/10 text-grass',
  sky: 'bg-sky/10 text-sky',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  slate: 'bg-slate-100 text-slate-600',
};

export function StatCard({ title, value, subtitle, icon, color = 'forest', trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
      {icon && (
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${STAT_COLORS[color]}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide leading-snug">{title}</p>
        <p className="text-xl font-bold text-slate-900 mt-0.5 break-words">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        {trend && (
          <p className={`text-xs mt-1 font-medium ${trend.direction === 'up' ? 'text-green-600' : 'text-red-500'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
