export type RoleId =
  | 'system_admin'
  | 'punong_barangay'
  | 'barangay_secretary'
  | 'barangay_treasurer'
  | 'drrm_focal'
  | 'gad_focal'
  | 'municipal_reviewer'
  | 'read_only_auditor';

export interface Role {
  id: RoleId;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  icon: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  roleId: RoleId;
  accessScope: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastActive: string;
}

export type Permission =
  | 'residents.view'
  | 'residents.create'
  | 'residents.edit'
  | 'residents.delete'
  | 'households.view'
  | 'households.create'
  | 'households.edit'
  | 'documents.view'
  | 'documents.create'
  | 'documents.validate'
  | 'documents.approve'
  | 'documents.release'
  | 'documents.templates'
  | 'collections.view'
  | 'collections.create'
  | 'collections.certify'
  | 'collections.fees'
  | 'blotter.view'
  | 'blotter.create'
  | 'blotter.edit'
  | 'kp.view'
  | 'kp.create'
  | 'kp.edit'
  | 'drrm.view'
  | 'drrm.create'
  | 'drrm.edit'
  | 'drrm.approve'
  | 'drrm.submit'
  | 'gad.view'
  | 'gad.create'
  | 'gad.edit'
  | 'gad.submit'
  | 'reports.view'
  | 'reports.export'
  | 'review.view'
  | 'review.comment'
  | 'admin.users'
  | 'admin.audit'
  | 'admin.backup'
  | 'admin.settings'
  | 'dashboard.executive';
