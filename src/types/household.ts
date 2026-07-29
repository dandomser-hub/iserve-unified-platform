export type HouseholdStatus = 'Active' | 'Inactive' | 'Transferred' | 'Dissolved';
export type RiskFlag = 'Flood-Prone' | 'Landslide-Prone' | 'Fire Risk' | 'Indigent' | 'PWD Member' | '4Ps Beneficiary' | 'Solo Parent';
export type IncomeCategory = 'Indigent' | 'Low Income' | 'Lower Middle' | 'Middle' | 'Upper Middle';

export interface HouseholdMember {
  residentId: string;
  name: string;
  relationship: string;
  age: number;
  sex: 'Male' | 'Female';
}

export interface Household {
  id: string;
  householdNo: string;
  headResidentId: string;
  headName: string;
  address: string;
  purok: string;
  members: HouseholdMember[];
  memberCount: number;
  riskFlags: RiskFlag[];
  incomeCategory: IncomeCategory;
  livelihood?: string;
  status: HouseholdStatus;
  registeredAt: string;
  updatedAt: string;
  remarks?: string;
}
