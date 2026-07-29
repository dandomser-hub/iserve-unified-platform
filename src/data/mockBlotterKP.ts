import type { BlotterIncident, KPCase, KPNotice, KPMinutes } from '@/types/blotter';

export const mockBlotterIncidents: BlotterIncident[] = [
  {
    id: 'BLT001', incidentNo: 'BLT-2024-001', dateTime: '2024-05-10T14:30:00',
    location: 'Purok 1 - Riverside, near barangay hall',
    incidentType: 'Physical Altercation',
    parties: [
      { residentId: 'R001', name: 'Dela Cruz, Juan S.', address: '12 Riverside St.', role: 'Complainant' },
      { name: 'Flores, Danny B.', address: '15 Riverside St.', role: 'Respondent' },
    ],
    narrativeSummary: 'Complainant alleged that respondent struck him on the shoulder during a verbal altercation regarding a property boundary dispute. Incident witnessed by two neighbors.',
    actionTaken: 'Parties were separated and advised to settle. Referred to KP for mediation.',
    status: 'Referred', isConfidential: false, linkedKPCaseId: 'KP001',
    encodedBy: 'Secretary Santos', createdAt: '2024-05-10T15:00:00', updatedAt: '2024-05-12T09:00:00',
    workflowHistory: [
      { status: 'New', action: 'Incident recorded', performedBy: 'Secretary Santos', performedAt: '2024-05-10T15:00:00' },
      { status: 'Recorded', action: 'Blotter officially recorded', performedBy: 'Secretary Santos', performedAt: '2024-05-10T15:30:00' },
      { status: 'Action Taken', action: 'Parties advised; referred to KP', performedBy: 'Hon. Reyes', performedAt: '2024-05-12T09:00:00' },
      { status: 'Referred', action: 'Referred to KP for conciliation', performedBy: 'Hon. Reyes', performedAt: '2024-05-12T09:30:00' },
    ],
  },
  {
    id: 'BLT002', incidentNo: 'BLT-2024-002', dateTime: '2024-05-18T20:00:00',
    location: 'Purok 3 - Seaside, Villanueva residence',
    incidentType: 'Noise Complaint',
    parties: [
      { name: 'Reyes, Angela', address: '80 Seaside Dr.', role: 'Complainant' },
      { residentId: 'R005', name: 'Villanueva, Ricardo B.', address: '78 Ocean View Rd.', role: 'Respondent' },
    ],
    narrativeSummary: 'Complainant reported excessive noise from respondent\'s residence (loud music and gathering) past 10 PM, in violation of barangay ordinance on noise.',
    actionTaken: 'Respondent warned and noise ceased.',
    status: 'Settled', isConfidential: false,
    encodedBy: 'Secretary Santos', createdAt: '2024-05-19T08:00:00', updatedAt: '2024-05-20T10:00:00',
    workflowHistory: [
      { status: 'New', action: 'Incident recorded', performedBy: 'Secretary Santos', performedAt: '2024-05-19T08:00:00' },
      { status: 'Recorded', action: 'Officially recorded', performedBy: 'Secretary Santos', performedAt: '2024-05-19T08:30:00' },
      { status: 'Action Taken', action: 'Respondent warned verbally', performedBy: 'Hon. Reyes', performedAt: '2024-05-20T09:00:00' },
      { status: 'Settled', action: 'Matter settled amicably', performedBy: 'Secretary Santos', performedAt: '2024-05-20T10:00:00' },
    ],
  },
  {
    id: 'BLT003', incidentNo: 'BLT-2024-003', dateTime: '2024-06-01T08:30:00',
    location: 'Purok 4 - Grassland Market Area',
    incidentType: 'Property Dispute',
    parties: [
      { residentId: 'R008', name: 'Aquino, Carmen S.', address: '23 Meadow Lane', role: 'Complainant' },
      { name: 'Ocampo, Benjamin', address: '25 Meadow Lane', role: 'Respondent' },
    ],
    narrativeSummary: 'Complainant alleges respondent encroached on her property boundary by constructing a fence that extends approximately 1.5 meters into her lot.',
    status: 'Recorded', isConfidential: false,
    encodedBy: 'Secretary Santos', createdAt: '2024-06-01T09:00:00', updatedAt: '2024-06-01T09:00:00',
    workflowHistory: [
      { status: 'New', action: 'Incident recorded', performedBy: 'Secretary Santos', performedAt: '2024-06-01T09:00:00' },
      { status: 'Recorded', action: 'Officially recorded', performedBy: 'Secretary Santos', performedAt: '2024-06-01T09:30:00' },
    ],
  },
  {
    id: 'BLT004', incidentNo: 'BLT-2024-004', dateTime: '2024-06-05T17:00:00',
    location: 'Purok 2 - Mountainview Road',
    incidentType: 'Traffic Incident',
    parties: [
      { name: 'Santos, Manuel T.', address: 'Purok 2', role: 'Complainant' },
      { name: 'Bautista, Carlo R.', address: 'Purok 2', role: 'Respondent' },
    ],
    narrativeSummary: 'Minor vehicle collision at the Mountainview junction. No injuries. Parties exchanged information and disputed liability.',
    actionTaken: 'Parties advised to coordinate with PNP for proper documentation.',
    status: 'Action Taken', isConfidential: false,
    encodedBy: 'Secretary Santos', createdAt: '2024-06-05T18:00:00', updatedAt: '2024-06-06T09:00:00',
    workflowHistory: [
      { status: 'New', action: 'Incident recorded', performedBy: 'Secretary Santos', performedAt: '2024-06-05T18:00:00' },
      { status: 'Recorded', action: 'Officially recorded', performedBy: 'Secretary Santos', performedAt: '2024-06-05T18:30:00' },
      { status: 'Action Taken', action: 'Parties advised to file with PNP', performedBy: 'Hon. Reyes', performedAt: '2024-06-06T09:00:00' },
    ],
  },
  {
    id: 'BLT005', incidentNo: 'BLT-2024-005', dateTime: '2024-06-08T11:00:00',
    location: 'Purok 5 - Town Center',
    incidentType: 'Verbal Abuse',
    parties: [
      { residentId: 'R019', name: 'Soriano, Enrique P.', address: '56 Center Ave.', role: 'Complainant' },
      { name: 'Lim, Carlos E.', address: 'Purok 5', role: 'Respondent' },
    ],
    narrativeSummary: 'Complainant alleges respondent verbally accosted him in public using abusive language, witnessed by bystanders at the town center market.',
    status: 'New', isConfidential: false,
    encodedBy: 'Secretary Santos', createdAt: '2024-06-08T11:30:00', updatedAt: '2024-06-08T11:30:00',
    workflowHistory: [
      { status: 'New', action: 'Incident recorded', performedBy: 'Secretary Santos', performedAt: '2024-06-08T11:30:00' },
    ],
  },
  {
    id: 'BLT006', incidentNo: 'BLT-2024-006', dateTime: '2024-04-20T13:00:00',
    location: 'Purok 1 - Riverside',
    incidentType: 'Theft/Robbery',
    parties: [
      { residentId: 'R030', name: 'Umali, Analiza B.', address: '33 Riverside Ln.', role: 'Complainant' },
      { name: 'Unknown', address: 'Unknown', role: 'Respondent' },
    ],
    narrativeSummary: 'Complainant reported theft of personal items including mobile phone and cash from her residence while away at work.',
    actionTaken: 'Matter referred to PNP. Blotter entry retained for record.',
    status: 'Referred', isConfidential: false,
    encodedBy: 'Secretary Santos', createdAt: '2024-04-20T14:00:00', updatedAt: '2024-04-21T09:00:00',
    workflowHistory: [
      { status: 'New', action: 'Incident recorded', performedBy: 'Secretary Santos', performedAt: '2024-04-20T14:00:00' },
      { status: 'Recorded', action: 'Officially recorded', performedBy: 'Secretary Santos', performedAt: '2024-04-20T14:30:00' },
      { status: 'Action Taken', action: 'Advised to file with PNP', performedBy: 'Hon. Reyes', performedAt: '2024-04-21T09:00:00' },
      { status: 'Referred', action: 'Referred to PNP', performedBy: 'Secretary Santos', performedAt: '2024-04-21T09:30:00' },
    ],
  },
  {
    id: 'BLT007', incidentNo: 'BLT-2024-007', dateTime: '2024-03-15T09:00:00',
    location: 'Purok 2 - Mountainview',
    incidentType: 'Property Dispute',
    parties: [
      { residentId: 'R013', name: 'Espiritu, Roberto N.', address: '34 Mountain Path', role: 'Complainant' },
      { name: 'Perez, Danilo', address: '36 Mountain Path', role: 'Respondent' },
    ],
    narrativeSummary: 'Long-standing boundary dispute over a 2-meter strip of land between adjacent lots. Both parties claim ownership based on informal transactions.',
    actionTaken: 'Settled through KP mediation.',
    status: 'Closed', isConfidential: false, linkedKPCaseId: 'KP003',
    encodedBy: 'Secretary Santos', createdAt: '2024-03-15T10:00:00', updatedAt: '2024-04-30T11:00:00',
    workflowHistory: [
      { status: 'New', action: 'Incident recorded', performedBy: 'Secretary Santos', performedAt: '2024-03-15T10:00:00' },
      { status: 'Recorded', action: 'Officially recorded', performedBy: 'Secretary Santos', performedAt: '2024-03-15T10:30:00' },
      { status: 'Action Taken', action: 'Referred to KP for mediation', performedBy: 'Hon. Reyes', performedAt: '2024-03-20T09:00:00' },
      { status: 'Referred', action: 'Referred to KP', performedBy: 'Secretary Santos', performedAt: '2024-03-20T09:30:00' },
      { status: 'Settled', action: 'Settled via KP agreement', performedBy: 'Secretary Santos', performedAt: '2024-04-30T10:00:00' },
      { status: 'Closed', action: 'Case closed', performedBy: 'Secretary Santos', performedAt: '2024-04-30T11:00:00' },
    ],
  },
  {
    id: 'BLT008', incidentNo: 'BLT-2024-008', dateTime: '2024-06-12T16:00:00',
    location: 'Purok 3 - Seaside Bridge',
    incidentType: 'Animal Bite Incident',
    parties: [
      { name: 'Gonzales, Minor (8 yrs)', address: 'Purok 3', role: 'Complainant' },
      { residentId: 'R016', name: 'Tolentino, Marcelino A. (dog owner)', address: '90 Seaside Dr.', role: 'Respondent' },
    ],
    narrativeSummary: 'Minor child bitten by respondent\'s unleashed dog near the Seaside Bridge. Child received first aid and was brought to the RHU for antirabies protocol.',
    actionTaken: 'Dog owner advised to keep dog leashed and to coordinate with the RHU.',
    status: 'Action Taken', isConfidential: false,
    encodedBy: 'Secretary Santos', createdAt: '2024-06-12T17:00:00', updatedAt: '2024-06-13T09:00:00',
    workflowHistory: [
      { status: 'New', action: 'Incident recorded', performedBy: 'Secretary Santos', performedAt: '2024-06-12T17:00:00' },
      { status: 'Recorded', action: 'Officially recorded', performedBy: 'Secretary Santos', performedAt: '2024-06-12T17:30:00' },
      { status: 'Action Taken', action: 'Owner advised; coordinated with RHU', performedBy: 'Hon. Reyes', performedAt: '2024-06-13T09:00:00' },
    ],
  },
];

export const mockKPCases: KPCase[] = [
  {
    id: 'KP001', caseNo: 'KP-2024-001', linkedBlotterId: 'BLT001', linkedBlotterNo: 'BLT-2024-001',
    disputeCategory: 'Physical Harm', complainant: 'Dela Cruz, Juan S.', respondent: 'Flores, Danny B.',
    filedDate: '2024-05-12', status: 'In Conciliation',
    hearingSchedule: '2024-06-20T09:00:00', venue: 'Barangay Hall KP Room',
    summonsIssuedAt: '2024-05-13',
    lupon: 'Lupon Tagapamayapa',
    workflowHistory: [
      { status: 'Filed', action: 'Case filed', performedBy: 'Secretary Santos', performedAt: '2024-05-12T10:00:00' },
      { status: 'Summons Prepared', action: 'Summons prepared and issued', performedBy: 'Secretary Santos', performedAt: '2024-05-13T09:00:00' },
      { status: 'Hearing Scheduled', action: 'First hearing scheduled', performedBy: 'Secretary Santos', performedAt: '2024-05-15T09:00:00' },
      { status: 'In Conciliation', action: 'First hearing held; conciliation ongoing', performedBy: 'Secretary Santos', performedAt: '2024-06-01T09:00:00' },
    ],
  },
  {
    id: 'KP002', caseNo: 'KP-2024-002',
    disputeCategory: 'Money / Debt', complainant: 'Pascual, Antonio F.', respondent: 'Morales, Victor',
    filedDate: '2024-05-20', status: 'Settled',
    hearingSchedule: '2024-06-05T10:00:00', venue: 'Barangay Hall',
    summonsIssuedAt: '2024-05-21',
    settlementSummary: 'Respondent agreed to pay complainant PHP 5,000 in two installments within 30 days.',
    lupon: 'Lupon Tagapamayapa',
    workflowHistory: [
      { status: 'Filed', action: 'Case filed', performedBy: 'Secretary Santos', performedAt: '2024-05-20T09:00:00' },
      { status: 'Summons Prepared', action: 'Summons issued', performedBy: 'Secretary Santos', performedAt: '2024-05-21T09:00:00' },
      { status: 'Hearing Scheduled', action: 'Hearing scheduled', performedBy: 'Secretary Santos', performedAt: '2024-05-22T09:00:00' },
      { status: 'In Conciliation', action: 'Conciliation started', performedBy: 'Secretary Santos', performedAt: '2024-06-05T10:00:00' },
      { status: 'Settled', action: 'Settlement agreement signed', performedBy: 'Secretary Santos', performedAt: '2024-06-05T12:00:00' },
    ],
  },
  {
    id: 'KP003', caseNo: 'KP-2024-003', linkedBlotterId: 'BLT007', linkedBlotterNo: 'BLT-2024-007',
    disputeCategory: 'Property / Land Boundary', complainant: 'Espiritu, Roberto N.', respondent: 'Perez, Danilo',
    filedDate: '2024-03-20', status: 'Closed',
    settlementSummary: 'Boundary agreed upon by both parties. Each party to plant markers at agreed boundary points within 2 weeks.',
    closedAt: '2024-04-30T11:00:00',
    lupon: 'Lupon Tagapamayapa',
    workflowHistory: [
      { status: 'Filed', action: 'Case filed', performedBy: 'Secretary Santos', performedAt: '2024-03-20T09:30:00' },
      { status: 'Summons Prepared', action: 'Summons issued', performedBy: 'Secretary Santos', performedAt: '2024-03-21T09:00:00' },
      { status: 'Hearing Scheduled', action: 'Hearing scheduled', performedBy: 'Secretary Santos', performedAt: '2024-03-22T09:00:00' },
      { status: 'In Conciliation', action: 'Conciliation sessions conducted', performedBy: 'Secretary Santos', performedAt: '2024-04-05T09:00:00' },
      { status: 'Settled', action: 'Settlement reached', performedBy: 'Secretary Santos', performedAt: '2024-04-30T10:00:00' },
      { status: 'Closed', action: 'Case closed', performedBy: 'Secretary Santos', performedAt: '2024-04-30T11:00:00' },
    ],
  },
  {
    id: 'KP004', caseNo: 'KP-2024-004',
    disputeCategory: 'Noise / Nuisance', complainant: 'Mendoza, Lourdes G.', respondent: 'Torres, Francisco',
    filedDate: '2024-06-03', status: 'Hearing Scheduled',
    hearingSchedule: '2024-06-25T09:00:00', venue: 'Barangay Hall KP Room',
    summonsIssuedAt: '2024-06-04',
    lupon: 'Lupon Tagapamayapa',
    workflowHistory: [
      { status: 'Filed', action: 'Case filed', performedBy: 'Secretary Santos', performedAt: '2024-06-03T10:00:00' },
      { status: 'Summons Prepared', action: 'Summons issued', performedBy: 'Secretary Santos', performedAt: '2024-06-04T09:00:00' },
      { status: 'Hearing Scheduled', action: 'First hearing scheduled', performedBy: 'Secretary Santos', performedAt: '2024-06-05T09:00:00' },
    ],
  },
  {
    id: 'KP005', caseNo: 'KP-2024-005',
    disputeCategory: 'Business Dispute', complainant: 'Soriano, Gloria H.', respondent: 'Buenaventura, Rogelio C.',
    filedDate: '2024-06-10', status: 'Filed',
    lupon: 'Lupon Tagapamayapa',
    workflowHistory: [
      { status: 'Filed', action: 'Case filed', performedBy: 'Secretary Santos', performedAt: '2024-06-10T09:00:00' },
    ],
  },
];

export const mockKPNotices: KPNotice[] = [
  { id: 'NOT001', kpCaseId: 'KP001', caseNo: 'KP-2024-001', noticeType: 'Summons', recipient: 'Dela Cruz, Juan S.', issuedDate: '2024-05-13', serviceStatus: 'Served', scheduleDate: '2024-06-20', venue: 'Barangay Hall', servedAt: '2024-05-14T10:00:00' },
  { id: 'NOT002', kpCaseId: 'KP001', caseNo: 'KP-2024-001', noticeType: 'Summons', recipient: 'Flores, Danny B.', issuedDate: '2024-05-13', serviceStatus: 'Served', scheduleDate: '2024-06-20', venue: 'Barangay Hall', servedAt: '2024-05-14T11:00:00' },
  { id: 'NOT003', kpCaseId: 'KP004', caseNo: 'KP-2024-004', noticeType: 'Hearing Notice', recipient: 'Torres, Francisco', issuedDate: '2024-06-04', serviceStatus: 'Served', scheduleDate: '2024-06-25', venue: 'Barangay Hall KP Room', servedAt: '2024-06-05T09:00:00' },
  { id: 'NOT004', kpCaseId: 'KP005', caseNo: 'KP-2024-005', noticeType: 'Summons', recipient: 'Buenaventura, Rogelio C.', issuedDate: '2024-06-11', serviceStatus: 'Pending', scheduleDate: '2024-06-28', venue: 'Barangay Hall' },
];

export const mockKPMinutes: KPMinutes[] = [
  { id: 'MIN001', kpCaseId: 'KP002', caseNo: 'KP-2024-002', sessionDate: '2024-06-05', minutesSummary: 'Both parties appeared and engaged in mediation facilitated by Lupon Chair. Respondent acknowledged the debt and proposed installment terms.', settlementTerms: 'PHP 2,500 on June 20, 2024 and PHP 2,500 on July 5, 2024.', complianceStatus: 'Pending', nextSteps: 'Monitor compliance with payment schedule. Issue settlement certificate upon completion.', preparedBy: 'Secretary Santos', attendees: ['Pascual, Antonio F.', 'Morales, Victor', 'Lupon Chair Tañada', 'Secretary Santos'] },
  { id: 'MIN002', kpCaseId: 'KP003', caseNo: 'KP-2024-003', sessionDate: '2024-04-30', minutesSummary: 'Final hearing concluded with both parties agreeing to boundary markers. Surveyor Engr. Cruz attended to assist in identifying agreed boundary.', settlementTerms: 'Boundary markers to be set at agreed GPS coordinates within 14 days from date of agreement.', complianceStatus: 'Complied', nextSteps: 'Case closed. Issue settlement certificate.', preparedBy: 'Secretary Santos', attendees: ['Espiritu, Roberto N.', 'Perez, Danilo', 'Engr. Cruz (surveyor)', 'Lupon Chair Tañada', 'Secretary Santos'] },
];
