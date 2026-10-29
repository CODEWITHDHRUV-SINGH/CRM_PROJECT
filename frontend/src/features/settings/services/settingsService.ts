import type {
  Integration,
  IntegrationProvider,
  NotificationPreferences,
  Organization,
  SecuritySettings,
  UpdateOrganizationInput,
} from '../types/settings.types';

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const now = new Date().toISOString();

let organization: Organization = {
  id: 'ORG-001',
  name: 'Northstar Studio',
  slug: 'northstar-studio',
  domain: 'northstar.co',
  timezone: 'Asia/Dhaka',
  currency: 'USD',
  plan: 'growth',
  createdAt: '2024-01-15T10:00:00Z',
};

let integrations: Integration[] = [
  { provider: 'gmail', name: 'Gmail', description: 'Send and track emails from your CRM.', connected: true, connectedAt: now, accountLabel: 'alex@northstar.co' },
  { provider: 'google-calendar', name: 'Google Calendar', description: 'Sync meetings and follow-ups automatically.', connected: false },
  { provider: 'whatsapp', name: 'WhatsApp Business', description: 'Message customers via WhatsApp.', connected: false },
  { provider: 's3', name: 'Object Storage', description: 'Store documents, quotes, and attachments.', connected: true, connectedAt: now, accountLabel: 's3://northstar-files' },
];

let notifications: NotificationPreferences = {
  emailOnNewLead: true,
  emailOnDealWon: true,
  emailOnDealLost: false,
  emailOnInvoicePaid: true,
  dailyDigest: true,
  weeklyReport: true,
  whatsappAlerts: false,
};

let security: SecuritySettings = {
  twoFactorEnabled: false,
  sessionTimeoutMinutes: 60,
  dataRetentionDays: 365,
  ipAllowlist: '',
};

export const settingsService = {
  async getOrganization(): Promise<Organization> {
    await delay();
    return { ...organization };
  },

  async updateOrganization(input: UpdateOrganizationInput): Promise<Organization> {
    await delay(300);
    organization = { ...organization, ...input };
    return { ...organization };
  },

  async getIntegrations(): Promise<Integration[]> {
    await delay();
    return integrations.map((i) => ({ ...i }));
  },

  async toggleIntegration(provider: IntegrationProvider): Promise<Integration> {
    await delay(400);
    const idx = integrations.findIndex((i) => i.provider === provider);
    if (idx === -1) throw new Error('Integration not found');
    const existing = integrations[idx];
    const updated: Integration = existing.connected
      ? { provider: existing.provider, name: existing.name, description: existing.description, connected: false }
      : { ...existing, connected: true, connectedAt: new Date().toISOString(), accountLabel: 'Connected just now' };
    integrations = [...integrations.slice(0, idx), updated, ...integrations.slice(idx + 1)];
    return { ...updated };
  },

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    await delay();
    return { ...notifications };
  },

  async updateNotificationPreferences(input: NotificationPreferences): Promise<NotificationPreferences> {
    await delay(250);
    notifications = { ...input };
    return { ...notifications };
  },

  async getSecuritySettings(): Promise<SecuritySettings> {
    await delay();
    return { ...security };
  },

  async updateSecuritySettings(input: SecuritySettings): Promise<SecuritySettings> {
    await delay(300);
    security = { ...input };
    return { ...security };
  },
};