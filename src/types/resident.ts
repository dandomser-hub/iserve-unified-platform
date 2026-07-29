export type Sex = 'Male' | 'Female';
export type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated' | 'Annulled';
export type ResidentStatus = 'Active' | 'Transferred Out' | 'Deceased' | 'Inactive';
export type AgeGroup = 'Infant (0-2)' | 'Child (3-12)' | 'Teen (13-17)' | 'Youth (18-30)' | 'Adult (31-59)' | 'Senior (60+)';

export type SectorTag =
  | 'Senior Citizen'
  | 'Person with Disability (PWD)'
  | 'Solo Parent'
  | 'Indigenous People (IP)'
  | 'Overseas Filipino Worker (OFW)'
  | 'Youth'
  | '4Ps Beneficiary'
  | 'Voter'
  | 'Indigent'
  | 'First Time Jobseeker';

export type PrivacyLevel = 'Public' | 'Internal' | 'Confidential' | 'Restricted' | 'System';

export interface Resident {
  id: string;
  residentNo: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix?: string;
  sex: Sex;
  birthDate: string;
  age: number;
  ageGroup: AgeGroup;
  civilStatus: CivilStatus;
  address: string;
  purok: string;
  householdId?: string;
  relationshipToHead?: string;
  sectorTags: SectorTag[];
  isVoter: boolean;
  precinct?: string;
  contactNumber?: string;
  emailAddress?: string;
  status: ResidentStatus;
  privacyLevel: PrivacyLevel;
  registeredAt: string;
  updatedAt: string;
  remarks?: string;
}

export interface ResidentDuplicateCandidate {
  id: string;
  residentA: Resident;
  residentB: Resident;
  matchScore: number;
  matchFields: string[];
  status: 'Pending Review' | 'Same Person' | 'Not Duplicate' | 'Merged' | 'For PB Review';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface ResidentStatusChange {
  id: string;
  residentId: string;
  fromStatus: ResidentStatus;
  toStatus: ResidentStatus;
  effectiveDate: string;
  reason: string;
  processedBy: string;
  remarks?: string;
  createdAt: string;
}
