import type {
  CreateLeadInput,
  Lead,
  LeadFilters,
  UpdateLeadInput,
} from '../types/lead.types';

/**
 * MOCK LEADS SERVICE — Phase 14 me real API se replace hoga.
 * Public interface (list/create/update/remove/get) same rahega.
 */

const now = new Date().toISOString();

const seedLeads: Lead[] = [
  { id: 'L-001', name: 'Olivia Rhye', email: 'olivia@layers.com', phone: '+8801711111111', company: 'Layers', jobTitle: 'Head of Marketing', status: 'qualified', source: 'website', score: 87, owner: 'Alex Morgan', notes: 'Very interested in enterprise plan.', createdAt: '2026-10-20T10:00:00Z', updatedAt: now },
  { id: 'L-002', name: 'Phoenix Baker', email: 'phoenix@quotient.co', phone: '+8801722222222', company: 'Quotient', jobTitle: 'CTO', status: 'new', source: 'referral', score: 62, owner: 'Alex Morgan', createdAt: '2026-10-21T11:30:00Z', updatedAt: now },
  { id: 'L-003', name: 'Lana Steiner', email: 'lana@circooles.com', company: 'Circooles', jobTitle: 'Product Manager', status: 'contacted', source: 'social', score: 74, owner: 'Alex Morgan', createdAt: '2026-10-22T09:15:00Z', updatedAt: now },
  { id: 'L-004', name: 'Demi Wilkinson', email: 'demi@catalog.com', company: 'Catalog', jobTitle: 'Sales Director', status: 'qualified', source: 'event', score: 91, owner: 'Alex Morgan', notes: 'Met at SaaStr 2026.', createdAt: '2026-10-19T14:00:00Z', updatedAt: now },
  { id: 'L-005', name: 'Candice Wu', email: 'candice@studio.co', company: 'Studio Co', status: 'proposal', source: 'website', score: 78, owner: 'Alex Morgan', createdAt: '2026-10-18T16:00:00Z', updatedAt: now },
  { id: 'L-006', name: 'Natali Craig', email: 'natali@global.com', company: 'Global', status: 'new', source: 'email', score: 45, owner: 'Alex Morgan', createdAt: '2026-10-23T08:30:00Z', updatedAt: now },
  { id: 'L-007', name: 'Drew Cano', email: 'drew@pixelly.com', company: 'Pixelly', status: 'contacted', source: 'social', score: 68, owner: 'Alex Morgan', createdAt: '2026-10-20T12:00:00Z', updatedAt: now },
  { id: 'L-008', name: 'Orlando Diggs', email: 'orlando@bright.com', company: 'Bright', jobTitle: 'VP Sales', status: 'won', source: 'referral', score: 96, owner: 'Alex Morgan', createdAt: '2026-10-10T10:00:00Z', updatedAt: now },
  { id: 'L-009', name: 'Andi Lane', email: 'andi@ventures.io', company: 'Ventures', status: 'lost', source: 'website', score: 22, owner: 'Alex Morgan', notes: 'Went with competitor.', createdAt: '2026-10-05T11:00:00Z', updatedAt: now },
  { id: 'L-010', name: 'Kate Morrison', email: 'kate@apex.co', company: 'Apex', status: 'qualified', source: 'event', score: 82, owner: 'Alex Morgan', createdAt: '2026-10-22T15:45:00Z', updatedAt: now },
  { id: 'L-011', name: 'Koray Okumus', email: 'koray@designlabs.dev', company: 'DesignLabs', status: 'new', source: 'website', score: 55, owner: 'Alex Morgan', createdAt: '2026-10-24T10:00:00Z', updatedAt: now },
  { id: 'L-012', name: 'Alec Whitten', email: 'alec@quantum.io', company: 'Quantum', status: 'contacted', source: 'referral', score: 71, owner: 'Alex Morgan', createdAt: '2026-10-21T13:00:00Z', updatedAt: now },
];

let leadsDb: Lead[] = [...seedLeads];

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

let nextId = 13;

export const leadsService = {
  async list(filters?: LeadFilters): Promise<Lead[]> {
    await delay();
    let results = [...leadsDb];

    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((l) =>
        `${l.name} ${l.email} ${l.company}`.toLowerCase().includes(q),
      );
    }
    if (filters?.status && filters.status !== 'all') {
      results = results.filter((l) => l.status === filters.status);
    }
    if (filters?.source && filters.source !== 'all') {
      results = results.filter((l) => l.source === filters.source);
    }

    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(id: string): Promise<Lead> {
    await delay(150);
    const lead = leadsDb.find((l) => l.id === id);
    if (!lead) throw new Error('Lead not found');
    return lead;
  },

  async create(input: CreateLeadInput): Promise<Lead> {
    await delay(300);
    const now = new Date().toISOString();
    const lead: Lead = {
      id: `L-${String(nextId++).padStart(3, '0')}`,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      company: input.company.trim(),
      jobTitle: input.jobTitle?.trim() || undefined,
      status: input.status ?? 'new',
      source: input.source ?? 'other',
      score: Math.floor(Math.random() * 40) + 40, // mock scoring
      owner: 'Alex Morgan',
      notes: input.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    leadsDb = [lead, ...leadsDb];
    return lead;
  },

  async update(input: UpdateLeadInput): Promise<Lead> {
    await delay(250);
    const index = leadsDb.findIndex((l) => l.id === input.id);
    if (index === -1) throw new Error('Lead not found');

    const updated: Lead = {
      ...leadsDb[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    leadsDb = [...leadsDb.slice(0, index), updated, ...leadsDb.slice(index + 1)];
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay(200);
    leadsDb = leadsDb.filter((l) => l.id !== id);
  },
};