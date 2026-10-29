export type PlanTier = 'free' | 'starter' | 'growth' | 'enterprise';
export type IntegrationProvider = 'gmail' | 'google-calendar' | 'whatsapp' | 's3';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  timezone: string;
  currency: string;
  plan: PlanTier;
  createdAt: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  domain?: string;
  timezone?: string;
  currency?: string;
}

export interface Integration {
  provider: IntegrationProvider;
  name: string;
  description: string;
  connected: boolean;
  connectedAt?: string;
  accountLabel?: string;
}

export interface NotificationPreferences {
  emailOnNewLead: boolean;
  emailOnDealWon: boolean;
  emailOnDealLost: boolean;
  emailOnInvoicePaid: boolean;
  dailyDigest: boolean;
  weeklyReport: boolean;
  whatsappAlerts: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
  dataRetentionDays: number;
  ipAllowlist?: string;
}

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: 'Free',
  starter: 'Starter',
  growth: 'Growth',
  enterprise: 'Enterprise',
};

export const TIMEZONES = [
  'Asia/Dhaka', 'Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore',
  'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Los_Angeles',
  'Australia/Sydney', 'UTC',
];

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'BDT', 'INR', 'AED', 'SGD', 'AUD'];

export const INTEGRATION_META: Record<IntegrationProvider, { color: string; icon: string }> = {
  gmail: { color: '#ea4335', icon: 'mail' },
  'google-calendar': { color: '#4285f4', icon: 'calendar' },
  whatsapp: { color: '#25d366', icon: 'message' },
  s3: { color: '#ff9900', icon: 'cloud' },
};