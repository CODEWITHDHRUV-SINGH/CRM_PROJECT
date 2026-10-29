export interface Deal { id: string; name: string; amount: number; }export type DealStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
export type DealSource = 'inbound' | 'outbound' | 'referral' | 'partner' | 'event' | 'other';

export interface Deal {
  id: string;
  name: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate?: string;
  companyName: string;
  contactName?: string;
  source: DealSource;
  owner: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDealInput {
  name: string;
  value: number;
  currency?: string;
  stage?: DealStage;
  probability?: number;
  expectedCloseDate?: string;
  companyName: string;
  contactName?: string;
  source?: DealSource;
  notes?: string;
}

export interface UpdateDealInput extends Partial<CreateDealInput> {
  id: string;
}

export interface DealFilters {
  search?: string;
  stage?: DealStage | 'all';
  source?: DealSource | 'all';
}

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
};

export const DEAL_SOURCE_LABELS: Record<DealSource, string> = {
  inbound: 'Inbound',
  outbound: 'Outbound',
  referral: 'Referral',
  partner: 'Partner',
  event: 'Event',
  other: 'Other',
};

export const PIPELINE_STAGES: { key: DealStage; label: string; color: string }[] = [
  { key: 'new', label: 'New', color: '#e87648' },
  { key: 'contacted', label: 'Contacted', color: '#e6b953' },
  { key: 'qualified', label: 'Qualified', color: '#73a985' },
  { key: 'proposal', label: 'Proposal', color: '#719bb5' },
  { key: 'won', label: 'Won', color: '#176451' },
  { key: 'lost', label: 'Lost', color: '#bd6948' },
];