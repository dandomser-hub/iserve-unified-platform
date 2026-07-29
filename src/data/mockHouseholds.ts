import type { Household } from '@/types/household';

export const mockHouseholds: Household[] = [
  {
    id: 'H001', householdNo: 'HH-2024-001', headResidentId: 'R001', headName: 'Dela Cruz, Juan S.',
    address: '12 Riverside St.', purok: 'Purok 1 - Riverside',
    members: [
      { residentId: 'R001', name: 'Dela Cruz, Juan S.', relationship: 'Head', age: 39, sex: 'Male' },
      { residentId: 'R002', name: 'Dela Cruz, Maria R.', relationship: 'Spouse', age: 36, sex: 'Female' },
      { residentId: 'R003', name: 'Dela Cruz, Jose M.', relationship: 'Son', age: 14, sex: 'Male' },
    ],
    memberCount: 3, riskFlags: ['4Ps Beneficiary'], incomeCategory: 'Low Income',
    livelihood: 'Farming / Fishing', status: 'Active',
    registeredAt: '2024-01-10', updatedAt: '2024-06-01',
  },
  {
    id: 'H002', householdNo: 'HH-2024-002', headResidentId: 'R004', headName: 'Mendoza, Lourdes G.',
    address: '45 Hillcrest Ave.', purok: 'Purok 2 - Mountainview',
    members: [
      { residentId: 'R004', name: 'Mendoza, Lourdes G.', relationship: 'Head', age: 72, sex: 'Female' },
    ],
    memberCount: 1, riskFlags: ['Indigent', 'Flood-Prone'], incomeCategory: 'Indigent',
    livelihood: 'Pension / Assistance', status: 'Active',
    registeredAt: '2024-01-15', updatedAt: '2024-05-20',
  },
  {
    id: 'H003', householdNo: 'HH-2024-003', headResidentId: 'R005', headName: 'Villanueva, Ricardo B.',
    address: '78 Ocean View Rd.', purok: 'Purok 3 - Seaside',
    members: [
      { residentId: 'R005', name: 'Villanueva, Ricardo B.', relationship: 'Head', age: 49, sex: 'Male' },
      { residentId: 'R006', name: 'Villanueva, Elena C.', relationship: 'Spouse', age: 46, sex: 'Female' },
      { residentId: 'R023', name: 'Cabral, Miguel S.', relationship: 'Son', age: 6, sex: 'Male' },
    ],
    memberCount: 3, riskFlags: ['Flood-Prone', 'Fire Risk'], incomeCategory: 'Lower Middle',
    livelihood: 'Fishing / Small Business', status: 'Active',
    registeredAt: '2024-01-20', updatedAt: '2024-06-10',
  },
  {
    id: 'H004', householdNo: 'HH-2024-004', headResidentId: 'R008', headName: 'Aquino, Carmen S.',
    address: '23 Meadow Lane', purok: 'Purok 4 - Grassland',
    members: [
      { residentId: 'R008', name: 'Aquino, Carmen S.', relationship: 'Head', age: 59, sex: 'Female' },
      { residentId: 'R007', name: 'Aquino, Pedro L.', relationship: 'Son', age: 34, sex: 'Male' },
      { residentId: 'R024', name: 'Jimenez, Anna R.', relationship: 'Granddaughter', age: 2, sex: 'Female' },
    ],
    memberCount: 3, riskFlags: ['Indigent', '4Ps Beneficiary', 'PWD Member'], incomeCategory: 'Indigent',
    livelihood: 'Subsistence Farming', status: 'Active',
    registeredAt: '2024-02-01', updatedAt: '2024-05-15',
  },
  {
    id: 'H005', householdNo: 'HH-2024-005', headResidentId: 'R010', headName: 'Macaraig, Rosario D.',
    address: '5 Town Plaza', purok: 'Purok 5 - Town Center',
    members: [
      { residentId: 'R010', name: 'Macaraig, Rosario D.', relationship: 'Head', age: 54, sex: 'Female' },
      { residentId: 'R009', name: 'Macaraig, Fernando R.', relationship: 'Son', age: 26, sex: 'Male' },
    ],
    memberCount: 2, riskFlags: [], incomeCategory: 'Middle',
    livelihood: 'Government Employee / Small Trade', status: 'Active',
    registeredAt: '2024-02-10', updatedAt: '2024-06-05',
  },
  {
    id: 'H006', householdNo: 'HH-2024-006', headResidentId: 'R011', headName: 'Pascual, Antonio F.',
    address: '67 Riverside Blvd.', purok: 'Purok 1 - Riverside',
    members: [
      { residentId: 'R011', name: 'Pascual, Antonio F.', relationship: 'Head', age: 69, sex: 'Male' },
      { residentId: 'R012', name: 'Pascual, Maricel C.', relationship: 'Daughter', age: 42, sex: 'Female' },
    ],
    memberCount: 2, riskFlags: ['PWD Member', '4Ps Beneficiary'], incomeCategory: 'Low Income',
    livelihood: 'Pension / Informal work', status: 'Active',
    registeredAt: '2024-02-15', updatedAt: '2024-05-01',
  },
  {
    id: 'H007', householdNo: 'HH-2024-007', headResidentId: 'R013', headName: 'Espiritu, Roberto N.',
    address: '34 Mountain Path', purok: 'Purok 2 - Mountainview',
    members: [
      { residentId: 'R013', name: 'Espiritu, Roberto N.', relationship: 'Head', age: 61, sex: 'Male' },
      { residentId: 'R014', name: 'Espiritu, Natividad O.', relationship: 'Spouse', age: 58, sex: 'Female' },
      { residentId: 'R022', name: 'Fernandez, Josephine T.', relationship: 'Daughter-in-law', age: 31, sex: 'Female' },
    ],
    memberCount: 3, riskFlags: ['Landslide-Prone'], incomeCategory: 'Lower Middle',
    livelihood: 'Farming / Crafts', status: 'Active',
    registeredAt: '2024-03-01', updatedAt: '2024-06-01',
  },
  {
    id: 'H008', householdNo: 'HH-2024-008', headResidentId: 'R016', headName: 'Tolentino, Marcelino A.',
    address: '90 Seaside Dr.', purok: 'Purok 3 - Seaside',
    members: [
      { residentId: 'R016', name: 'Tolentino, Marcelino A.', relationship: 'Head', age: 52, sex: 'Male' },
      { residentId: 'R015', name: 'Tolentino, Kristine L.', relationship: 'Daughter', age: 21, sex: 'Female' },
    ],
    memberCount: 2, riskFlags: ['Flood-Prone'], incomeCategory: 'Middle',
    livelihood: 'OFW Remittance', status: 'Active',
    registeredAt: '2024-03-10', updatedAt: '2024-06-12',
  },
  {
    id: 'H009', householdNo: 'HH-2024-009', headResidentId: 'R017', headName: 'Buenaventura, Teresita U.',
    address: '11 Grassland Rd.', purok: 'Purok 4 - Grassland',
    members: [
      { residentId: 'R017', name: 'Buenaventura, Teresita U.', relationship: 'Head', age: 76, sex: 'Female' },
      { residentId: 'R018', name: 'Buenaventura, Angelito M.', relationship: 'Son', age: 42, sex: 'Male' },
    ],
    memberCount: 2, riskFlags: ['Indigent', '4Ps Beneficiary'], incomeCategory: 'Indigent',
    livelihood: 'Government Assistance', status: 'Active',
    registeredAt: '2024-03-15', updatedAt: '2024-05-10',
  },
  {
    id: 'H010', householdNo: 'HH-2024-010', headResidentId: 'R020', headName: 'Soriano, Gloria H.',
    address: '56 Center Ave.', purok: 'Purok 5 - Town Center',
    members: [
      { residentId: 'R020', name: 'Soriano, Gloria H.', relationship: 'Head', age: 47, sex: 'Female' },
      { residentId: 'R019', name: 'Soriano, Enrique P.', relationship: 'Son', age: 23, sex: 'Male' },
    ],
    memberCount: 2, riskFlags: [], incomeCategory: 'Lower Middle',
    livelihood: 'Small Business / Informal', status: 'Active',
    registeredAt: '2024-04-01', updatedAt: '2024-06-15',
  },
];
