import type { DemoUser } from '@/types/auth';

export const mockUsers: DemoUser[] = [
  { id: 'U001', name: 'Admin Reyes', email: 'admin@maligaya.gov.ph', roleId: 'system_admin', accessScope: 'Full System Access', status: 'active', createdAt: '2024-01-01', lastActive: '2024-06-15T08:00:00' },
  { id: 'U002', name: 'Hon. Rosario Macaraig', email: 'pb@maligaya.gov.ph', roleId: 'punong_barangay', accessScope: 'Barangay Maligaya - All Modules (Executive)', status: 'active', createdAt: '2024-01-01', lastActive: '2024-06-15T09:30:00' },
  { id: 'U003', name: 'Sec. Elena Santos', email: 'secretary@maligaya.gov.ph', roleId: 'barangay_secretary', accessScope: 'Barangay Maligaya - Residents, Documents, Blotter, KP', status: 'active', createdAt: '2024-01-01', lastActive: '2024-06-15T07:45:00' },
  { id: 'U004', name: 'Treas. Ricardo Villanueva', email: 'treasurer@maligaya.gov.ph', roleId: 'barangay_treasurer', accessScope: 'Barangay Maligaya - Collections, Documents (view)', status: 'active', createdAt: '2024-01-01', lastActive: '2024-06-14T16:00:00' },
  { id: 'U005', name: 'DRRM Focal Fernando Mangubat', email: 'drrm@maligaya.gov.ph', roleId: 'drrm_focal', accessScope: 'Barangay Maligaya - DRRM Module', status: 'active', createdAt: '2024-01-01', lastActive: '2024-06-15T06:00:00' },
  { id: 'U006', name: 'GAD Focal Rosario Macaraig Jr.', email: 'gad@maligaya.gov.ph', roleId: 'gad_focal', accessScope: 'Barangay Maligaya - GAD Module', status: 'active', createdAt: '2024-01-01', lastActive: '2024-06-13T14:00:00' },
  { id: 'U007', name: 'Reviewer Atty. Bernardo Quimpo', email: 'reviewer@sample.gov.ph', roleId: 'municipal_reviewer', accessScope: 'Municipal - Read-only review access', status: 'active', createdAt: '2024-01-01', lastActive: '2024-06-10T11:00:00' },
  { id: 'U008', name: 'Observer Maria Solis', email: 'auditor@sample.gov.ph', roleId: 'read_only_auditor', accessScope: 'Read-only observer access', status: 'active', createdAt: '2024-01-01', lastActive: '2024-06-08T15:00:00' },
];
