import { formatDateTime } from '@/utils/formatters';
import { StatusChip } from './Badge';

export interface TimelineEvent {
  id: string;
  label: string;
  description?: string;
  status?: string;
  timestamp: string;
  actor?: string;
  remarks?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={event.id} className="flex gap-3">
          {/* Connector */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? 'bg-forest' : 'bg-slate-300'}`} />
            {i < events.length - 1 && <div className="w-px flex-1 bg-slate-200 my-1" />}
          </div>
          {/* Content */}
          <div className="pb-4 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-800">{event.label}</span>
              {event.status && <StatusChip status={event.status} />}
            </div>
            {event.description && <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>}
            {event.remarks && <p className="text-xs text-slate-600 italic mt-0.5">"{event.remarks}"</p>}
            <p className="text-xs text-slate-400 mt-1">
              {formatDateTime(event.timestamp)}{event.actor ? ` · ${event.actor}` : ''}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
