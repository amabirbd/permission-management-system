export const routePermissions = {
  '/dashboard': 'dashboard.view',
  '/users': 'users.view',
  '/leads': 'leads.view',
  '/tasks': 'tasks.view',
  '/reports': 'reports.view',
  '/audit': 'audit.view',
  '/customer-portal': 'customer_portal.view',
  '/settings': 'settings.view'
} as const;

export const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', permission: 'dashboard.view' },
  { href: '/users', label: 'Users', permission: 'users.view' },
  { href: '/leads', label: 'Leads', permission: 'leads.view' },
  { href: '/tasks', label: 'Tasks', permission: 'tasks.view' },
  { href: '/reports', label: 'Reports', permission: 'reports.view' },
  { href: '/audit', label: 'Audit Log', permission: 'audit.view' },
  { href: '/customer-portal', label: 'Customer Portal', permission: 'customer_portal.view' },
  { href: '/settings', label: 'Settings', permission: 'settings.view' }
];
