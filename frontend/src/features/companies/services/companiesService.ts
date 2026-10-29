import type {
  Company,
  CompanyFilters,
  CreateCompanyInput,
  UpdateCompanyInput,
} from '../types/company.types';

/**
 * MOCK COMPANIES SERVICE — Phase 14 me real API se replace hoga.
 */

const now = new Date().toISOString();

const seedCompanies: Company[] = [
  { id: 'CO-001', name: 'Layers', domain: 'layers.com', industry: 'technology', size: '51-200', location: 'San Francisco, CA', phone: '+1-415-555-0101', description: 'Design system platform for product teams.', status: 'customer', owner: 'Alex Morgan', contactCount: 3, dealCount: 2, annualRevenue: 2400000, createdAt: '2026-09-15T10:00:00Z', updatedAt: now },
  { id: 'CO-002', name: 'Quotient', domain: 'quotient.co', industry: 'finance', size: '201-1000', location: 'New York, NY', phone: '+1-212-555-0202', description: 'Fintech infrastructure for embedded finance.', status: 'customer', owner: 'Alex Morgan', contactCount: 2, dealCount: 1, annualRevenue: 8500000, createdAt: '2026-09-18T11:30:00Z', updatedAt: now },
  { id: 'CO-003', name: 'Circooles', domain: 'circooles.com', industry: 'technology', size: '11-50', location: 'Austin, TX', description: 'Circular economy SaaS for retailers.', status: 'prospect', owner: 'Alex Morgan', contactCount: 1, dealCount: 1, createdAt: '2026-09-22T09:15:00Z', updatedAt: now },
  { id: 'CO-004', name: 'Catalog', domain: 'catalog.com', industry: 'retail', size: '51-200', location: 'Portland, OR', phone: '+1-503-555-0404', description: 'Product photography at scale.', status: 'active', owner: 'Alex Morgan', contactCount: 2, dealCount: 1, annualRevenue: 3100000, createdAt: '2026-09-20T14:00:00Z', updatedAt: now },
  { id: 'CO-005', name: 'Studio Co', domain: 'studio.co', industry: 'technology', size: '1-10', location: 'Brooklyn, NY', description: 'Creative studio for early-stage startups.', status: 'prospect', owner: 'Alex Morgan', contactCount: 1, dealCount: 0, createdAt: '2026-09-25T16:00:00Z', updatedAt: now },
  { id: 'CO-006', name: 'Global', domain: 'global.com', industry: 'manufacturing', size: '1000+', location: 'Chicago, IL', phone: '+1-312-555-0606', description: 'Industrial automation and supply chain.', status: 'churned', owner: 'Alex Morgan', contactCount: 1, dealCount: 0, annualRevenue: 25000000, createdAt: '2026-08-10T08:30:00Z', updatedAt: now },
  { id: 'CO-007', name: 'Pixelly', domain: 'pixelly.com', industry: 'technology', size: '11-50', location: 'Los Angeles, CA', description: 'Mobile app development studio.', status: 'customer', owner: 'Alex Morgan', contactCount: 1, dealCount: 1, annualRevenue: 1200000, createdAt: '2026-09-19T12:00:00Z', updatedAt: now },
  { id: 'CO-008', name: 'Bright', domain: 'bright.com', industry: 'education', size: '201-1000', location: 'Boston, MA', description: 'Online learning platform for professionals.', status: 'customer', owner: 'Alex Morgan', contactCount: 1, dealCount: 1, annualRevenue: 6800000, createdAt: '2026-08-25T10:00:00Z', updatedAt: now },
  { id: 'CO-009', name: 'Ventures', domain: 'ventures.io', industry: 'finance', size: '11-50', location: 'Miami, FL', description: 'Venture capital for early-stage tech.', status: 'prospect', owner: 'Alex Morgan', contactCount: 1, dealCount: 0, createdAt: '2026-09-28T11:00:00Z', updatedAt: now },
  { id: 'CO-010', name: 'Apex', domain: 'apex.co', industry: 'healthcare', size: '201-1000', location: 'Seattle, WA', description: 'Healthcare analytics and insights.', status: 'active', owner: 'Alex Morgan', contactCount: 1, dealCount: 1, annualRevenue: 4200000, createdAt: '2026-09-24T15:45:00Z', updatedAt: now },
];

let companiesDb: Company[] = [...seedCompanies];
let nextId = 11;
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const companiesService = {
  async list(filters?: CompanyFilters): Promise<Company[]> {
    await delay();
    let results = [...companiesDb];

    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((c) =>
        `${c.name} ${c.domain ?? ''} ${c.location ?? ''}`.toLowerCase().includes(q),
      );
    }
    if (filters?.status && filters.status !== 'all') {
      results = results.filter((c) => c.status === filters.status);
    }
    if (filters?.industry && filters.industry !== 'all') {
      results = results.filter((c) => c.industry === filters.industry);
    }
    if (filters?.size && filters.size !== 'all') {
      results = results.filter((c) => c.size === filters.size);
    }

    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(id: string): Promise<Company> {
    await delay(150);
    const company = companiesDb.find((c) => c.id === id);
    if (!company) throw new Error('Company not found');
    return company;
  },

  async create(input: CreateCompanyInput): Promise<Company> {
    await delay(300);
    const now = new Date().toISOString();
    const company: Company = {
      id: `CO-${String(nextId++).padStart(3, '0')}`,
      name: input.name.trim(),
      domain: input.domain?.trim() || undefined,
      industry: input.industry ?? 'other',
      size: input.size ?? '1-10',
      location: input.location?.trim() || undefined,
      phone: input.phone?.trim() || undefined,
      description: input.description?.trim() || undefined,
      status: input.status ?? 'prospect',
      owner: 'Alex Morgan',
      contactCount: 0,
      dealCount: 0,
      annualRevenue: input.annualRevenue,
      createdAt: now,
      updatedAt: now,
    };
    companiesDb = [company, ...companiesDb];
    return company;
  },

  async update(input: UpdateCompanyInput): Promise<Company> {
    await delay(250);
    const index = companiesDb.findIndex((c) => c.id === input.id);
    if (index === -1) throw new Error('Company not found');

    const updated: Company = {
      ...companiesDb[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    companiesDb = [...companiesDb.slice(0, index), updated, ...companiesDb.slice(index + 1)];
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay(200);
    companiesDb = companiesDb.filter((c) => c.id !== id);
  },
};