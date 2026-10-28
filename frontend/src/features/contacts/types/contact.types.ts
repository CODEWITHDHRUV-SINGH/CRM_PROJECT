export type ContactStatus = 'active' | 'inactive' | 'do-not-contact';
export type ContactRole = 'decision-maker' | 'influencer' | 'champion' | 'user' | 'other';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle?: string;
  status: ContactStatus;
  role: ContactRole;
  owner: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  name: string;
  email: string;
  phone?: string;
  company: string;
  jobTitle?: string;
  status?: ContactStatus;
  role?: ContactRole;
  notes?: string;
}

export interface UpdateContactInput extends Partial<CreateContactInput> {
  id: string;
}

export interface ContactFilters {
  search?: string;
  status?: ContactStatus | 'all';
  role?: ContactRole | 'all';
}

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  'do-not-contact': 'Do not contact',
};

export const CONTACT_ROLE_LABELS: Record<ContactRole, string> = {
  'decision-maker': 'Decision maker',
  influencer: 'Influencer',
  champion: 'Champion',
  user: 'User',
  other: 'Other',
};