import { useState } from 'react';
import { PageScaffold } from '@/components/shared/PageScaffold';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusChip, Badge } from '@/components/ui/Badge';
import { useAudit } from '@/app/providers/AuditProvider';
import { useMockData } from '@/app/providers/MockDataProvider';
import { formatDate } from '@/utils/formatters';

// Simulated duplicate candidates
const DUPLICATE_CANDIDATES = [
  { id: 'DUP001', residentAId: 'R025', residentBId: 'R026', matchScore: 72, matchFields: ['Last Name', 'Address', 'Purok'], status: 'Pending Review' as const },
  { id: 'DUP002', residentAId: 'R001', residentBId: 'R011', matchScore: 45, matchFields: ['Purok', 'Last Name Initial'], status: 'Not Duplicate' as const },
];

export function ResidentDuplicateReviewPage() {
  const { residents } = useMockData();
  const { logEvent } = useAudit();
  const [candidates, setCandidates] = useState(DUPLICATE_CANDIDATES);
  const [selected, setSelected] = useState(DUPLICATE_CANDIDATES[0]);

  const resA = residents.find(r => r.id === selected?.residentAId);
  const resB = residents.find(r => r.id === selected?.residentBId);

  function handleAction(candidateId: string, action: string) {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: action as any } : c));
    logEvent({ action: 'Updated', module: 'Residents', recordId: candidateId, recordLabel: `Duplicate Review ${candidateId}`, description: `Duplicate review action: ${action} for candidate ${candidateId}` });
  }

  const fields = ['First Name', 'Middle Name', 'Last Name', 'Sex', 'Birth Date', 'Civil Status', 'Address', 'Purok'];

  return (
    <PageScaffold
      title="Resident Duplicate Review"
      subtitle="Review and resolve potential duplicate resident records"
      breadcrumbs={[{ label: 'Residents', href: '/residents' }, { label: 'Duplicate Review' }]}
      moduleTag="Residents"
      priorityTag="P1"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate list */}
        <div>
          <Card padding={false}>
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 text-sm">Candidate Pairs ({candidates.filter(c => c.status === 'Pending Review').length} pending)</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {candidates.map(c => {
                const a = residents.find(r => r.id === c.residentAId);
                const b = residents.find(r => r.id === c.residentBId);
                return (
                  <button key={c.id} onClick={() => setSelected(c)} className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selected?.id === c.id ? 'bg-forest/5 border-l-2 border-forest' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800">{a?.lastName} vs {b?.lastName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">Match: {c.matchScore}% · {c.matchFields.join(', ')}</p>
                      </div>
                      <StatusChip status={c.status} />
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Comparison */}
        <div className="lg:col-span-2">
          {resA && resB && selected ? (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">Side-by-Side Comparison</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Match score: <strong>{selected.matchScore}%</strong> · Matching fields: {selected.matchFields.join(', ')}</p>
                </div>
                <StatusChip status={selected.status} />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Field</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase bg-forest/5">{resA.residentNo}</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase bg-ocean/5">{resB.residentNo}</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase">Match</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      ['First Name', resA.firstName, resB.firstName],
                      ['Middle Name', resA.middleName, resB.middleName],
                      ['Last Name', resA.lastName, resB.lastName],
                      ['Sex', resA.sex, resB.sex],
                      ['Birth Date', formatDate(resA.birthDate), formatDate(resB.birthDate)],
                      ['Civil Status', resA.civilStatus, resB.civilStatus],
                      ['Address', resA.address, resB.address],
                      ['Purok', resA.purok, resB.purok],
                    ].map(([field, valA, valB]) => {
                      const isMatch = valA === valB;
                      return (
                        <tr key={field}>
                          <td className="px-3 py-2 text-slate-600 font-medium text-xs">{field}</td>
                          <td className={`px-3 py-2 text-slate-800 ${isMatch ? 'bg-green-50' : ''}`}>{valA}</td>
                          <td className={`px-3 py-2 text-slate-800 ${isMatch ? 'bg-green-50' : ''}`}>{valB}</td>
                          <td className="px-3 py-2">{isMatch ? <Badge label="Match" variant="success" /> : <Badge label="Different" variant="neutral" />}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {selected.status === 'Pending Review' && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button size="sm" variant="primary" onClick={() => handleAction(selected.id, 'Same Person')}>Mark as Same Person</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleAction(selected.id, 'Not Duplicate')}>Not a Duplicate</Button>
                  <Button size="sm" variant="secondary" onClick={() => handleAction(selected.id, 'For PB Review')}>Refer to PB Review</Button>
                </div>
              )}
              {selected.status !== 'Pending Review' && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-600">Resolution: <strong>{selected.status}</strong></p>
                </div>
              )}
            </Card>
          ) : (
            <Card className="flex items-center justify-center py-16 text-slate-400 text-sm">
              Select a duplicate candidate to compare records.
            </Card>
          )}
        </div>
      </div>
    </PageScaffold>
  );
}
