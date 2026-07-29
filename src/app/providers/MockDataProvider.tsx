import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Resident } from '@/types/resident';
import type { Household } from '@/types/household';
import type { DocumentRequest } from '@/types/document';
import type { CollectionRecord } from '@/types/collection';
import type { BlotterIncident, KPCase } from '@/types/blotter';
import type { DANARecord, EvacuationRecord, SitRep } from '@/types/drrm';
import { mockResidents } from '@/data/mockResidents';
import { mockHouseholds } from '@/data/mockHouseholds';
import { mockDocumentRequests } from '@/data/mockDocuments';
import { mockCollectionRecords } from '@/data/mockCollections';
import { mockBlotterIncidents, mockKPCases } from '@/data/mockBlotterKP';
import { mockDANARecords, mockEvacuationRecords, mockSitReps } from '@/data/mockDRRM';

interface MockDataContextValue {
  residents: Resident[];
  setResidents: React.Dispatch<React.SetStateAction<Resident[]>>;
  households: Household[];
  setHouseholds: React.Dispatch<React.SetStateAction<Household[]>>;
  documentRequests: DocumentRequest[];
  setDocumentRequests: React.Dispatch<React.SetStateAction<DocumentRequest[]>>;
  collectionRecords: CollectionRecord[];
  setCollectionRecords: React.Dispatch<React.SetStateAction<CollectionRecord[]>>;
  blotterIncidents: BlotterIncident[];
  setBlotterIncidents: React.Dispatch<React.SetStateAction<BlotterIncident[]>>;
  kpCases: KPCase[];
  setKPCases: React.Dispatch<React.SetStateAction<KPCase[]>>;
  sitReps: SitRep[];
  setSitReps: React.Dispatch<React.SetStateAction<SitRep[]>>;
  danaRecords: DANARecord[];
  setDANARecords: React.Dispatch<React.SetStateAction<DANARecord[]>>;
  evacuationRecords: EvacuationRecord[];
  setEvacuationRecords: React.Dispatch<React.SetStateAction<EvacuationRecord[]>>;
  toasts: Toast[];
  showToast: (msg: string, type?: Toast['type']) => void;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const MockDataContext = createContext<MockDataContextValue | null>(null);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [households, setHouseholds] = useState<Household[]>(mockHouseholds);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>(mockDocumentRequests);
  const [collectionRecords, setCollectionRecords] = useState<CollectionRecord[]>(mockCollectionRecords);
  const [blotterIncidents, setBlotterIncidents] = useState<BlotterIncident[]>(mockBlotterIncidents);
  const [kpCases, setKPCases] = useState<KPCase[]>(mockKPCases);
  const [sitReps, setSitReps] = useState<SitRep[]>(mockSitReps);
  const [danaRecords, setDANARecords] = useState<DANARecord[]>(mockDANARecords);
  const [evacuationRecords, setEvacuationRecords] = useState<EvacuationRecord[]>(mockEvacuationRecords);
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(message: string, type: Toast['type'] = 'success') {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }

  return (
    <MockDataContext.Provider value={{
      residents, setResidents,
      households, setHouseholds,
      documentRequests, setDocumentRequests,
      collectionRecords, setCollectionRecords,
      blotterIncidents, setBlotterIncidents,
      kpCases, setKPCases,
      sitReps, setSitReps,
      danaRecords, setDANARecords,
      evacuationRecords, setEvacuationRecords,
      toasts, showToast,
    }}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const ctx = useContext(MockDataContext);
  if (!ctx) throw new Error('useMockData must be used within MockDataProvider');
  return ctx;
}
