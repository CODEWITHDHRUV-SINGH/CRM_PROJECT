export interface AppRoute {
  path: string;
  name: string;
}

export const routes: AppRoute[] = [
  { path: '/', name: 'Overview' },
  { path: '/leads', name: 'Leads' },
  { path: '/contacts', name: 'Contacts' },
  { path: '/companies', name: 'Companies' },
  { path: '/deals', name: 'Deals' },
  { path: '/tasks', name: 'Tasks' },
  { path: '/invoices', name: 'Invoices' },
  { path: '/payments', name: 'Payments' },
  { path: '/ai', name: 'AI Assistant' },
  { path: '/reports', name: 'Reports' },
  { path: '/team', name: 'Team' },
  { path: '/settings', name: 'Settings' },
];