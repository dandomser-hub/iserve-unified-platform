import type { ReactNode } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface PageScaffoldProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  moduleTag?: string;
  priorityTag?: 'P0' | 'P1' | 'P2' | 'P3';
  actions?: ReactNode;
  children: ReactNode;
}

export function PageScaffold({ title, subtitle, breadcrumbs, moduleTag, priorityTag, actions, children }: PageScaffoldProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        moduleTag={moduleTag}
        priorityTag={priorityTag}
        actions={actions}
      />
      {children}
    </div>
  );
}
