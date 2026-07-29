// Reference data for barangay configuration
// Backend transition: This will be fetched from the barangay_config table in production

export const BARANGAY_INFO = {
  name: 'Barangay Maligaya',
  municipality: 'Sample Municipality',
  province: 'Sample Province',
  region: 'Sample Region',
  punongBarangay: 'Hon. Rosario D. Macaraig',
  secretary: 'Elena C. Santos',
  treasurer: 'Ricardo B. Villanueva',
  contactNo: '(02) 8123-4567',
  email: 'maligaya@sample.gov.ph',
  barangayId: 'BRG-SAMPLE-001',
};

export const PUROKS = [
  { id: 'P1', name: 'Purok 1 - Riverside', sitio: 'Riverside' },
  { id: 'P2', name: 'Purok 2 - Mountainview', sitio: 'Mountainview' },
  { id: 'P3', name: 'Purok 3 - Seaside', sitio: 'Seaside' },
  { id: 'P4', name: 'Purok 4 - Grassland', sitio: 'Grassland' },
  { id: 'P5', name: 'Purok 5 - Town Center', sitio: 'Town Center' },
];

export const DOCUMENT_TYPES = [
  'Barangay Clearance',
  'Certificate of Residency',
  'Certificate of Indigency',
  'Certificate of Low Income / No Income',
  'Certificate of Good Moral Character',
  'Certificate of Unemployment',
  'First Time Jobseeker Certification',
  'Business Clearance',
  'Certificate of Appearance',
  'Blotter Certification',
  'KP Certification',
  'DRRM SitRep Export',
  'DANA Export',
  'GAD Annex D-1 Export',
  'GAD Annex E-1 Export',
];

export const INCIDENT_TYPES = [
  'Physical Altercation',
  'Property Dispute',
  'Noise Complaint',
  'Theft/Robbery',
  'Trespassing',
  'Verbal Abuse',
  'Public Disturbance',
  'Domestic Dispute',
  'Animal Bite Incident',
  'Traffic Incident',
  'Other',
];

export const KP_DISPUTE_CATEGORIES = [
  'Property / Land Boundary',
  'Money / Debt',
  'Family / Domestic',
  'Noise / Nuisance',
  'Physical Harm',
  'Business Dispute',
  'Other',
];

export const SECTOR_TAGS = [
  'Senior Citizen',
  'Person with Disability (PWD)',
  'Solo Parent',
  'Indigenous People (IP)',
  'Overseas Filipino Worker (OFW)',
  'Youth',
  '4Ps Beneficiary',
  'Voter',
  'Indigent',
  'First Time Jobseeker',
];

export const GAD_GENDER_ISSUES = [
  'Limited access to livelihood programs',
  'Insufficient VAWC awareness',
  'Limited health service access for women',
  'Under-representation in governance',
  'Education barriers for girls',
  'Gender-blind DRRM planning',
];

export const DRRM_HAZARD_TYPES = [
  'Typhoon',
  'Flooding',
  'Landslide',
  'Earthquake',
  'Fire',
  'Drought',
  'Storm Surge',
  'Other',
];

export const FEATURE_FLAGS = {
  legislativeRecords: false,
  assetsInventory: false,
  healthWelfare: false,
  personnelSkTanodLupon: false,
  residentPortal: false,
  onlinePayment: false,
  fullAccounting: false,
  vawcBcpcRestricted: false,
  nationalIntegrations: false,
  nativeMobileOffline: false,
  aiAnalytics: false,
  blockchainAudit: false,
};
