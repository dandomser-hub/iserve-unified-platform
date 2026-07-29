import { useState } from 'react';
import { Search, CheckCircle, XCircle, Shield } from 'lucide-react';
import { mockIssuedDocuments } from '@/data/mockDocuments';
import { BARANGAY_INFO } from '@/data/mockReferenceData';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatters';

// Public verification page — minimal information only
// Backend transition: implement as a public unauthenticated Laravel route with rate limiting
export function DocumentVerificationPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<'idle' | 'found' | 'not_found' | 'revoked'>('idle');
  const [foundDoc, setFoundDoc] = useState<typeof mockIssuedDocuments[0] | null>(null);

  function handleVerify() {
    const q = query.trim().toUpperCase();
    const found = mockIssuedDocuments.find(d =>
      d.referenceNo.toUpperCase() === q ||
      d.verificationCode.toUpperCase() === q
    );
    if (found) {
      if (found.isRevoked) { setResult('revoked'); setFoundDoc(found); }
      else { setResult('found'); setFoundDoc(found); }
    } else {
      setResult('not_found');
      setFoundDoc(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-forest rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">iS</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{BARANGAY_INFO.name}</p>
            <p className="text-xs text-slate-500">Document Verification Portal · Public Access</p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-forest/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-forest" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Document Verification</h1>
            <p className="text-sm text-slate-500 mt-1">Enter a reference number or verification code to check document authenticity.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Reference No. or Verification Code</label>
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={e => { setQuery(e.target.value); setResult('idle'); }}
                  onKeyDown={e => e.key === 'Enter' && handleVerify()}
                  placeholder="e.g. BC-2024-0001 or VRF-BC-001XYZ"
                  className="flex-1 px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
                />
                <Button variant="primary" onClick={handleVerify} disabled={!query.trim()}>
                  <Search size={15} /> Verify
                </Button>
              </div>
            </div>

            {result === 'found' && foundDoc && (
              <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                  <span className="font-semibold text-green-800">Document Verified — Valid</span>
                </div>
                <dl className="space-y-1.5 text-sm">
                  <div className="flex gap-3"><dt className="text-slate-500 w-28 flex-shrink-0">Document Type</dt><dd className="font-medium text-slate-800">{foundDoc.documentType}</dd></div>
                  <div className="flex gap-3"><dt className="text-slate-500 w-28 flex-shrink-0">Issued Date</dt><dd className="font-medium text-slate-800">{formatDate(foundDoc.issuedAt)}</dd></div>
                  <div className="flex gap-3"><dt className="text-slate-500 w-28 flex-shrink-0">Barangay</dt><dd className="font-medium text-slate-800">{BARANGAY_INFO.name}</dd></div>
                  <div className="flex gap-3"><dt className="text-slate-500 w-28 flex-shrink-0">Reference No.</dt><dd className="font-mono text-xs text-slate-800 mt-0.5">{foundDoc.referenceNo}</dd></div>
                </dl>
                <p className="text-xs text-slate-400 mt-3 italic">For privacy protection, resident details are not displayed on this public portal.</p>
              </div>
            )}

            {result === 'revoked' && foundDoc && (
              <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={20} className="text-red-600 flex-shrink-0" />
                  <span className="font-semibold text-red-800">Document Revoked</span>
                </div>
                <p className="text-sm text-red-700">This document has been revoked. Please contact {BARANGAY_INFO.name} for details.</p>
              </div>
            )}

            {result === 'not_found' && (
              <div className="mt-5 p-4 bg-slate-100 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle size={20} className="text-slate-500 flex-shrink-0" />
                  <span className="font-semibold text-slate-700">Not Found</span>
                </div>
                <p className="text-sm text-slate-600">No document found for the provided reference. Please check the code and try again, or contact the barangay office.</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-400">
              Powered by {BARANGAY_INFO.name} iSERVE · {BARANGAY_INFO.municipality} · {BARANGAY_INFO.province}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">This portal shows minimal verification data only. Full document access requires barangay authorization.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
