export type CollectionStatus = 'Recorded' | 'Certified' | 'Voided';

export interface CollectionRecord {
  id: string;
  transactionRef: string;
  linkedDocumentId?: string;
  linkedDocumentNo?: string;
  payerName: string;
  feeItem: string;
  amount: number;
  orReferenceNo?: string;
  encodedBy: string;
  transactionDate: string;
  status: CollectionStatus;
  remarks?: string;
}

export interface FeeItem {
  id: string;
  name: string;
  documentType?: string;
  baseAmount: number;
  isExemptible: boolean;
  exemptionReasons: string[];
  effectiveDate: string;
  isActive: boolean;
}

export interface DailyCollectionSummary {
  date: string;
  totalAmount: number;
  transactionCount: number;
  byFeeItem: { feeItem: string; amount: number; count: number }[];
  certifiedBy?: string;
  certifiedAt?: string;
  status: 'Pending' | 'Certified';
}
