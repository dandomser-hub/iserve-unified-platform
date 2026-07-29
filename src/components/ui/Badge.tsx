import { getStatusColor } from '@/utils/statusRules';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

const VARIANTS: Record<string, string> = {
  default: 'bg-slate-100 text-slate-700',
  info: 'bg-sky-100 text-sky-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  neutral: 'bg-slate-100 text-slate-600',
};

export function Badge({ label, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${VARIANTS[variant]} ${className}`}>
      {label}
    </span>
  );
}

interface StatusChipProps {
  status: string;
  className?: string;
}

export function StatusChip({ status, className = '' }: StatusChipProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
}

interface PrivacyBadgeProps {
  level: 'Public' | 'Internal' | 'Confidential' | 'Restricted' | 'System';
}

const PRIVACY_COLORS: Record<string, string> = {
  Public: 'bg-green-50 text-green-700 border border-green-200',
  Internal: 'bg-blue-50 text-blue-700 border border-blue-200',
  Confidential: 'bg-amber-50 text-amber-700 border border-amber-200',
  Restricted: 'bg-red-50 text-red-700 border border-red-200',
  System: 'bg-slate-50 text-slate-600 border border-slate-200',
};

export function PrivacyBadge({ level }: PrivacyBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PRIVACY_COLORS[level]}`}>
      {level}
    </span>
  );
}
