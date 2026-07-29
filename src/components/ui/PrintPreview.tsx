import type { ReactNode } from 'react';
import { Printer } from 'lucide-react';
import { BARANGAY_INFO } from '@/data/mockReferenceData';
import { Button } from './Button';

interface PrintPreviewProps {
  documentTitle: string;
  referenceNo: string;
  children: ReactNode;
  onClose?: () => void;
}

export function PrintPreview({ documentTitle, referenceNo, children, onClose }: PrintPreviewProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Printer size={16} />
          <span className="font-medium">Document Preview</span>
          <span className="text-slate-400">— {referenceNo}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="primary" onClick={() => window.print()}>
            <Printer size={14} />
            Print / Export PDF
          </Button>
          {onClose && <Button size="sm" variant="secondary" onClick={onClose}>Close</Button>}
        </div>
      </div>
      {/* Document */}
      <div className="p-8 max-w-2xl mx-auto">
        {/* Letterhead */}
        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
          <p className="text-xs text-slate-500">Republic of the Philippines</p>
          <p className="text-xs text-slate-500">Province of {BARANGAY_INFO.province}</p>
          <p className="text-xs text-slate-500">Municipality of {BARANGAY_INFO.municipality}</p>
          <h2 className="text-lg font-bold text-slate-900 mt-1">{BARANGAY_INFO.name.toUpperCase()}</h2>
          <p className="text-xs text-slate-500 mt-1">{BARANGAY_INFO.contactNo} · {BARANGAY_INFO.email}</p>
        </div>
        {/* Document title */}
        <h3 className="text-base font-bold text-center uppercase tracking-wide text-slate-900 mb-6">{documentTitle}</h3>
        {/* Content */}
        <div className="text-sm text-slate-800 leading-relaxed">{children}</div>
        {/* Signature */}
        <div className="mt-10 flex justify-end">
          <div className="text-center">
            <div className="border-t border-slate-800 pt-2 w-48">
              <p className="font-bold text-sm">{BARANGAY_INFO.punongBarangay}</p>
              <p className="text-xs text-slate-500">Punong Barangay</p>
            </div>
          </div>
        </div>
        {/* Verification note */}
        <div className="mt-6 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 text-center">
          Reference No.: {referenceNo} · Verify at /public/verify
        </div>
      </div>
    </div>
  );
}
