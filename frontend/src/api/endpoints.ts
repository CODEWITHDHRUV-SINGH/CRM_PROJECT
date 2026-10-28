/**
 * All API endpoints as functions — matches backend/api/v1 routers.
 * URLs from README.md section "5. REST API endpoints".
 */

export const endpoints = {
  auth: {
    login: () => '/auth/login',
    refresh: () => '/auth/refresh',
    logout: () => '/auth/logout',
    forgotPassword: () => '/auth/forgot-password',
    me: () => '/auth/me',
  },

  organizations: {
    current: () => '/organizations/current',
  },

  users: {
    list: () => '/users',
    invite: () => '/users/invitations',
    update: (id: string) => `/users/${id}`,
  },

  roles: {
    list: () => '/roles',
    updatePermissions: (id: string) => `/roles/${id}/permissions`,
  },

  leads: {
    list: () => '/leads',
    create: () => '/leads',
    get: (id: string) => `/leads/${id}`,
    update: (id: string) => `/leads/${id}`,
    assign: (id: string) => `/leads/${id}/assign`,
    convert: (id: string) => `/leads/${id}/convert`,
  },

  contacts: {
    list: () => '/contacts',
    create: () => '/contacts',
    get: (id: string) => `/contacts/${id}`,
    update: (id: string) => `/contacts/${id}`,
  },

  companies: {
    list: () => '/companies',
    create: () => '/companies',
    get: (id: string) => `/companies/${id}`,
    update: (id: string) => `/companies/${id}`,
  },

  deals: {
    list: () => '/deals',
    create: () => '/deals',
    get: (id: string) => `/deals/${id}`,
    update: (id: string) => `/deals/${id}`,
    changeStage: (id: string) => `/deals/${id}/stage`,
    pipelines: () => '/pipelines',
  },

  tasks: {
    list: () => '/tasks',
    create: () => '/tasks',
    update: (id: string) => `/tasks/${id}`,
  },

  activities: {
    create: () => '/activities',
    list: () => '/activities',
  },

  products: {
    list: () => '/products',
    create: () => '/products',
  },

  quotes: {
    create: () => '/quotes',
    approve: (id: string) => `/quotes/${id}/approve`,
  },

  invoices: {
    create: () => '/invoices',
    get: (id: string) => `/invoices/${id}`,
    addPayment: (id: string) => `/invoices/${id}/payments`,
  },

  payments: {
    refundOrReverse: (id: string) => `/payments/${id}/refund-or-reverse`,
  },

  ai: {
    leadScore: () => '/ai/lead-score',
    summarizeActivity: () => '/ai/summarize-activity',
    draftEmail: () => '/ai/draft-email',
    nextBestAction: () => '/ai/next-best-action',
  },

  automations: {
    listRules: () => '/automation-rules',
    createRule: () => '/automation-rules',
    listRuns: () => '/automation-runs',
  },

  reports: {
    sales: () => '/reports/sales',
    pipeline: () => '/reports/pipeline',
    collections: () => '/reports/collections',
  },

  audit: {
    list: () => '/audit-logs',
  },

  integrations: {
    connect: (provider: string) => `/integrations/${provider}/connect`,
    webhook: (provider: string) => `/webhooks/${provider}`,
  },
} as const;