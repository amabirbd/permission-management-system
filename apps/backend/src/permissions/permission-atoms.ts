export const PERMISSION_ATOMS = [
  { atom: 'dashboard.view', label: 'View dashboard', module: 'Dashboard' },
  { atom: 'users.view', label: 'View users', module: 'Users' },
  { atom: 'users.create', label: 'Create users', module: 'Users' },
  { atom: 'users.update', label: 'Update users', module: 'Users' },
  { atom: 'users.suspend', label: 'Suspend users', module: 'Users' },
  { atom: 'permissions.manage', label: 'Manage permissions', module: 'Permissions' },
  { atom: 'leads.view', label: 'View leads', module: 'Leads' },
  { atom: 'tasks.view', label: 'View tasks', module: 'Tasks' },
  { atom: 'reports.view', label: 'View reports', module: 'Reports' },
  { atom: 'audit.view', label: 'View audit log', module: 'Audit' },
  { atom: 'settings.view', label: 'View settings', module: 'Settings' },
  { atom: 'customer_portal.view', label: 'View customer portal', module: 'Customer Portal' }
] as const;

export type PermissionAtom = (typeof PERMISSION_ATOMS)[number]['atom'];
