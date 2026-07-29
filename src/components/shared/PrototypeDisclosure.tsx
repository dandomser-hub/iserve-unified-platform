import { FlaskConical } from 'lucide-react';
import { PROTOTYPE_DISCLOSURE } from '@/config/prototype';

export function PrototypeDisclosure() {
  return (
    <aside
      className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-amber-950"
      aria-label="Prototype limitations"
      data-prototype-disclosure
    >
      <div className="mx-auto flex max-w-7xl items-start gap-2 text-xs sm:items-center">
        <FlaskConical size={15} className="mt-0.5 flex-shrink-0 text-amber-700 sm:mt-0" />
        <p>
          <strong>{PROTOTYPE_DISCLOSURE.label}:</strong>{' '}
          {PROTOTYPE_DISCLOSURE.summary}{' '}
          <span className="text-amber-800">
            {PROTOTYPE_DISCLOSURE.limitations.join(' · ')}
          </span>
        </p>
      </div>
    </aside>
  );
}
