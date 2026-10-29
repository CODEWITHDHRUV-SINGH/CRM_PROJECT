import type {
  CreateDealInput,
  Deal,
  DealFilters,
  DealStage,
  UpdateDealInput,
} from '../types/deal.types';

const now = new Date().toISOString();

const seedDeals: Deal[] = [
  { id: 'D-001', name: 'Layers — Enterprise Plan', value: 48000, currency: 'USD', stage: 'qualified', probability: 70, expectedCloseDate: '2026-12-15', companyName: 'Layers', contactName: 'Olivia Rhye', source: 'inbound', owner: 'Alex Morgan', notes: 'Needs SSO and custom integration.', createdAt: '2026-09-20T10:00:00Z', updatedAt: now },
  { id: 'D-002', name: 'Quotient — Platform Expansion', value: 125000, currency: 'USD', stage: 'proposal', probability: 60, expectedCloseDate: '2026-11-30', companyName: 'Quotient', contactName: 'Phoenix Baker', source: 'outbound', owner: 'Alex Morgan', createdAt: '2026-09-22T11:30:00Z', updatedAt: now },
  { id: 'D-003', name: 'Circooles — Starter Plan', value: 12000, currency: 'USD', stage: 'contacted', probability: 30, expectedCloseDate: '2026-12-01', companyName: 'Circooles', contactName: 'Lana Steiner', source: 'inbound', owner: 'Alex Morgan', createdAt: '2026-09-25T09:15:00Z', updatedAt: now },
  { id: 'D-004', name: 'Catalog — Annual Renewal', value: 36000, currency: 'USD', stage: 'won', probability: 100, expectedCloseDate: '2026-10-15', companyName: 'Catalog', contactName: 'Demi Wilkinson', source: 'referral', owner: 'Alex Morgan', createdAt: '2026-09-10T14:00:00Z', updatedAt: now },
  { id: 'D-005', name: 'Studio Co — Design Sprint', value: 8500, currency: 'USD', stage: 'new', probability: 20, expectedCloseDate: '2026-12-20', companyName: 'Studio Co', contactName: 'Candice Wu', source: 'inbound', owner: 'Alex Morgan', createdAt: '2026-09-28T16:00:00Z', updatedAt: now },
  { id: 'D-006', name: 'Global — Data Migration', value: 85000, currency: 'USD', stage: 'lost', probability: 0, expectedCloseDate: '2026-10-01', companyName: 'Global', contactName: 'Natali Craig', source: 'outbound', owner: 'Alex Morgan', notes: 'Went with competitor.', createdAt: '2026-08-15T08:30:00Z', updatedAt: now },
  { id: 'D-007', name: 'Pixelly — Mobile App Phase 2', value: 24000, currency: 'USD', stage: 'qualified', probability: 65, expectedCloseDate: '2026-12-10', companyName: 'Pixelly', contactName: 'Drew Cano', source: 'partner', owner: 'Alex Morgan', createdAt: '2026-09-26T12:00:00Z', updatedAt: now },
  { id: 'D-008', name: 'Bright — Enterprise Seats', value: 96000, currency: 'USD', stage: 'won', probability: 100, expectedCloseDate: '2026-10-20', companyName: 'Bright', contactName: 'Orlando Diggs', source: 'referral', owner: 'Alex Morgan', createdAt: '2026-09-05T10:00:00Z', updatedAt: now },
  { id: 'D-009', name: 'Ventures — Portfolio Analytics', value: 18000, currency: 'USD', stage: 'contacted', probability: 40, expectedCloseDate: '2026-12-05', companyName: 'Ventures', contactName: 'Andi Lane', source: 'event', owner: 'Alex Morgan', createdAt: '2026-09-29T11:00:00Z', updatedAt: now },
  { id: 'D-010', name: 'Apex — Compliance Module', value: 62000, currency: 'USD', stage: 'proposal', probability: 55, expectedCloseDate: '2026-11-25', companyName: 'Apex', contactName: 'Kate Morrison', source: 'inbound', owner: 'Alex Morgan', createdAt: '2026-09-24T15:45:00Z', updatedAt: now },
  { id: 'D-011', name: 'Layers — Additional Seats', value: 15000, currency: 'USD', stage: 'new', probability: 25, expectedCloseDate: '2026-12-25', companyName: 'Layers', contactName: 'Olivia Rhye', source: 'inbound', owner: 'Alex Morgan', createdAt: '2026-09-30T13:00:00Z', updatedAt: now },
  { id: 'D-012', name: 'Quotient — Support Add-on', value: 8000, currency: 'USD', stage: 'new', probability: 15, expectedCloseDate: '2027-01-10', companyName: 'Quotient', contactName: 'Phoenix Baker', source: 'inbound', owner: 'Alex Morgan', createdAt: '2026-10-01T09:00:00Z', updatedAt: now },
];

let dealsDb: Deal[] = [...seedDeals];
let nextId = 13;
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const dealsService = {
  async list(filters?: DealFilters): Promise<Deal[]> {
    await delay();
    let results = [...dealsDb];
    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((d) =>
        `${d.name} ${d.companyName} ${d.contactName ?? ''}`.toLowerCase().includes(q),
      );
    }
    if (filters?.stage && filters.stage !== 'all') {
      results = results.filter((d) => d.stage === filters.stage);
    }
    if (filters?.source && filters.source !== 'all') {
      results = results.filter((d) => d.source === filters.source);
    }
    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async create(input: CreateDealInput): Promise<Deal> {
    await delay(300);
    const now = new Date().toISOString();
    const deal: Deal = {
      id: `D-${String(nextId++).padStart(3, '0')}`,
      name: input.name.trim(),
      value: input.value,
      currency: input.currency ?? 'USD',
      stage: input.stage ?? 'new',
      probability: input.probability ?? 10,
      expectedCloseDate: input.expectedCloseDate,
      companyName: input.companyName.trim(),
      contactName: input.contactName?.trim() || undefined,
      source: input.source ?? 'other',
      owner: 'Alex Morgan',
      notes: input.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    dealsDb = [deal, ...dealsDb];
    return deal;
  },

  async update(input: UpdateDealInput): Promise<Deal> {
    await delay(250);
    const index = dealsDb.findIndex((d) => d.id === input.id);
    if (index === -1) throw new Error('Deal not found');
    const updated: Deal = {
      ...dealsDb[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    dealsDb = [...dealsDb.slice(0, index), updated, ...dealsDb.slice(index + 1)];
    return updated;
  },

  async moveStage(id: string, stage: DealStage): Promise<Deal> {
    const probabilityMap: Record<DealStage, number> = {
      new: 10, contacted: 30, qualified: 60, proposal: 75, won: 100, lost: 0,
    };
    return dealsService.update({ id, stage, probability: probabilityMap[stage] });
  },

  async remove(id: string): Promise<void> {
    await delay(200);
    dealsDb = dealsDb.filter((d) => d.id !== id);
  },
};