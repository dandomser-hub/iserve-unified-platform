import type { RoleId, Permission } from '@/types/auth';

// Role-permission matrix. Backend transition: this will be enforced server-side via Laravel Gates and Policies.
const ROLE_PERMISSIONS: Record<RoleId, Permission[]> = {
  system_admin: [
    'documents.templates',
    'admin.users', 'admin.audit', 'admin.backup', 'admin.settings',
    'dashboard.executive',
  ],
  punong_barangay: [
    'residents.view', 'households.view',
    'documents.view', 'documents.approve', 'documents.release',
    'collections.view',
    'blotter.view', 'kp.view',
    'drrm.view', 'drrm.approve', 'drrm.submit',
    'gad.view', 'gad.submit',
    'reports.view', 'reports.export',
    'review.view',
    'dashboard.executive',
  ],
  barangay_secretary: [
    'residents.view', 'residents.create', 'residents.edit',
    'households.view', 'households.create', 'households.edit',
    'documents.view', 'documents.create', 'documents.validate',
    'collections.view',
    'blotter.view', 'blotter.create', 'blotter.edit',
    'kp.view', 'kp.create', 'kp.edit',
    'drrm.view',
    'gad.view',
    'reports.view', 'reports.export',
    'review.view',
  ],
  barangay_treasurer: [
    'documents.view',
    'collections.view', 'collections.create', 'collections.certify', 'collections.fees',
    'gad.view',
    'reports.view',
  ],
  drrm_focal: [
    'drrm.view', 'drrm.create', 'drrm.edit', 'drrm.submit',
    'reports.view', 'reports.export',
    'dashboard.executive',
  ],
  gad_focal: [
    'gad.view', 'gad.create', 'gad.edit', 'gad.submit',
    'reports.view', 'reports.export',
  ],
  municipal_reviewer: [
    'reports.view',
    'review.view', 'review.comment',
  ],
  read_only_auditor: [
    'reports.view',
    'admin.audit',
    'dashboard.executive',
  ],
};

export function hasPermission(roleId: RoleId, permission: Permission): boolean {
  return ROLE_PERMISSIONS[roleId]?.includes(permission) ?? false;
}

export function getPermissions(roleId: RoleId): Permission[] {
  return ROLE_PERMISSIONS[roleId] ?? [];
}

export function canAccess(roleId: RoleId, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(roleId, p));
}
