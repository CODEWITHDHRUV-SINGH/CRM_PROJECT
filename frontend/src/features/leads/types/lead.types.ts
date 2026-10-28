export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export type LeadSource = 'website' | 'referral' | 'social' | 'email' | 'event' | 'other';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle?: string;
  status: LeadStatus;
  source: LeadSource;
  score: number;              // 0-100
  owner: string;              // "Alex Morgan"
  notes?: string;
  createdAt: string;          // ISO date
  updatedAt: string;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle?: string;
  status?: LeadStatus;
  source?: LeadSource;
  notes?: string;
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {
  id: string;
  score?: number;
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus | 'all';
  source?: LeadSource | 'all';
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Website',
  referral: 'Referral',
  social: 'Social',
  email: 'Email',
  event: 'Event',
  other: 'Other',
};