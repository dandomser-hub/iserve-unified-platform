import type { CollectionRecord, FeeItem } from '@/types/collection';

export const mockCollectionRecords: CollectionRecord[] = [
  { id: 'COL001', transactionRef: 'TRX-2024-001', linkedDocumentId: 'DOC001', linkedDocumentNo: 'REQ-2024-001', payerName: 'Dela Cruz, Juan S.', feeItem: 'Barangay Clearance Fee', amount: 50, orReferenceNo: 'OR-2024-101', encodedBy: 'Treas. Villanueva', transactionDate: '2024-06-02', status: 'Recorded' },
  { id: 'COL002', transactionRef: 'TRX-2024-002', linkedDocumentId: 'DOC006', linkedDocumentNo: 'REQ-2024-006', payerName: 'Pascual, Maricel C.', feeItem: 'Certificate of Indigency', amount: 0, encodedBy: 'Treas. Villanueva', transactionDate: '2024-06-05', status: 'Recorded', remarks: 'Fee waived - indigent' },
  { id: 'COL003', transactionRef: 'TRX-2024-003', linkedDocumentId: 'DOC011', linkedDocumentNo: 'REQ-2024-011', payerName: 'Macaraig, Rosario D.', feeItem: 'Certificate of Appearance Fee', amount: 30, orReferenceNo: 'OR-2024-102', encodedBy: 'Treas. Villanueva', transactionDate: '2024-06-06', status: 'Recorded' },
  { id: 'COL004', transactionRef: 'TRX-2024-004', payerName: 'Soriano, Enrique P.', feeItem: 'Barangay Clearance Fee', amount: 50, orReferenceNo: 'OR-2024-103', encodedBy: 'Treas. Villanueva', transactionDate: '2024-05-25', status: 'Certified' },
  { id: 'COL005', transactionRef: 'TRX-2024-005', payerName: 'Buenaventura, Teresita U.', feeItem: 'Certificate of Indigency', amount: 0, encodedBy: 'Treas. Villanueva', transactionDate: '2024-05-28', status: 'Certified', remarks: 'Indigent exemption applied' },
  { id: 'COL006', transactionRef: 'TRX-2024-006', payerName: 'Aquino, Carmen S.', feeItem: 'Certificate of Good Moral Character Fee', amount: 50, orReferenceNo: 'OR-2024-104', encodedBy: 'Treas. Villanueva', transactionDate: '2024-06-01', status: 'Certified' },
  { id: 'COL007', transactionRef: 'TRX-2024-007', payerName: 'Ramos, Benedicto L.', feeItem: 'First Time Jobseeker', amount: 0, encodedBy: 'Treas. Villanueva', transactionDate: '2024-06-03', status: 'Recorded', remarks: 'No fee per RA 11261' },
  { id: 'COL008', transactionRef: 'TRX-2024-008', payerName: 'De Guzman, Ramon', feeItem: 'Barangay Clearance Fee', amount: 50, orReferenceNo: 'OR-2024-105', encodedBy: 'Treas. Villanueva', transactionDate: '2024-06-10', status: 'Recorded' },
];

export const mockFeeItems: FeeItem[] = [
  { id: 'FEE001', name: 'Barangay Clearance Fee', documentType: 'Barangay Clearance', baseAmount: 50, isExemptible: true, exemptionReasons: ['Senior Citizen', 'PWD', 'Indigent (with PB approval)'], effectiveDate: '2024-01-01', isActive: true },
  { id: 'FEE002', name: 'Certificate of Residency Fee', documentType: 'Certificate of Residency', baseAmount: 30, isExemptible: true, exemptionReasons: ['School Enrollment (minor)', 'Indigent'], effectiveDate: '2024-01-01', isActive: true },
  { id: 'FEE003', name: 'Certificate of Indigency', documentType: 'Certificate of Indigency', baseAmount: 0, isExemptible: false, exemptionReasons: [], effectiveDate: '2024-01-01', isActive: true },
  { id: 'FEE004', name: 'Certificate of Good Moral Character Fee', documentType: 'Certificate of Good Moral Character', baseAmount: 50, isExemptible: true, exemptionReasons: ['Senior Citizen', 'PWD'], effectiveDate: '2024-01-01', isActive: true },
  { id: 'FEE005', name: 'Certificate of Unemployment', documentType: 'Certificate of Unemployment', baseAmount: 30, isExemptible: true, exemptionReasons: ['Indigent', 'DOLE Program Applicant'], effectiveDate: '2024-01-01', isActive: true },
  { id: 'FEE006', name: 'First Time Jobseeker Certification', documentType: 'First Time Jobseeker Certification', baseAmount: 0, isExemptible: false, exemptionReasons: ['Fee-free per RA 11261'], effectiveDate: '2024-01-01', isActive: true },
  { id: 'FEE007', name: 'Business Clearance Fee', documentType: 'Business Clearance', baseAmount: 200, isExemptible: false, exemptionReasons: [], effectiveDate: '2024-01-01', isActive: true },
  { id: 'FEE008', name: 'Certificate of Appearance Fee', documentType: 'Certificate of Appearance', baseAmount: 30, isExemptible: true, exemptionReasons: ['Senior Citizen'], effectiveDate: '2024-01-01', isActive: true },
  { id: 'FEE009', name: 'Blotter Certification Fee', documentType: 'Blotter Certification', baseAmount: 75, isExemptible: true, exemptionReasons: ['Indigent (with PB approval)'], effectiveDate: '2024-01-01', isActive: true },
  { id: 'FEE010', name: 'KP Certification Fee', documentType: 'KP Certification', baseAmount: 75, isExemptible: true, exemptionReasons: ['Indigent (with PB approval)'], effectiveDate: '2024-01-01', isActive: true },
  { id: 'FEE011', name: 'Certificate of Low Income / No Income', documentType: 'Certificate of Low Income / No Income', baseAmount: 0, isExemptible: false, exemptionReasons: [], effectiveDate: '2024-01-01', isActive: true },
];
