import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useMockData, type Toast } from '@/app/providers/MockDataProvider';

const TOAST_STYLES: Record<Toast['type'], string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-sky-600 text-white',
  warning: 'bg-amber-500 text-white',
};

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export function ToastContainer() {
  const { toasts } = useMockData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl pointer-events-auto animate-in slide-in-from-right-4 ${TOAST_STYLES[toast.type]}`}
          >
            <Icon size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
          </div>
        );
      })}
    </div>
  );
}
