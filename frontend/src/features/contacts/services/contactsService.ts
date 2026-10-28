import type {
  Contact,
  ContactFilters,
  CreateContactInput,
  UpdateContactInput,
} from '../types/contact.types';

/**
 * MOCK CONTACTS SERVICE — Phase 14 me real API se replace hoga.
 */

const now = new Date().toISOString();

const seedContacts: Contact[] = [
  { id: 'C-001', name: 'Olivia Rhye', email: 'olivia@layers.com', phone: '+8801711111111', company: 'Layers', jobTitle: 'Head of Marketing', status: 'active', role: 'decision-maker', owner: 'Alex Morgan', notes: 'Primary decision-maker for enterprise deals.', createdAt: '2026-10-15T10:00:00Z', updatedAt: now },
  { id: 'C-002', name: 'Phoenix Baker', email: 'phoenix@quotient.co', phone: '+8801722222222', company: 'Quotient', jobTitle: 'CTO', status: 'active', role: 'champion', owner: 'Alex Morgan', createdAt: '2026-10-16T11:30:00Z', updatedAt: now },
  { id: 'C-003', name: 'Lana Steiner', email: 'lana@circooles.com', company: 'Circooles', jobTitle: 'Product Manager', status: 'active', role: 'influencer', owner: 'Alex Morgan', createdAt: '2026-10-17T09:15:00Z', updatedAt: now },
  { id: 'C-004', name: 'Demi Wilkinson', email: 'demi@catalog.com', company: 'Catalog', jobTitle: 'Sales Director', status: 'active', role: 'decision-maker', owner: 'Alex Morgan', notes: 'Met at SaaStr 2026.', createdAt: '2026-10-14T14:00:00Z', updatedAt: now },
  { id: 'C-005', name: 'Candice Wu', email: 'candice@studio.co', company: 'Studio Co', status: 'active', role: 'user', owner: 'Alex Morgan', createdAt: '2026-10-12T16:00:00Z', updatedAt: now },
  { id: 'C-006', name: 'Natali Craig', email: 'natali@global.com', company: 'Global', status: 'inactive', role: 'other', owner: 'Alex Morgan', createdAt: '2026-10-10T08:30:00Z', updatedAt: now },
  { id: 'C-007', name: 'Drew Cano', email: 'drew@pixelly.com', company: 'Pixelly', jobTitle: 'Design Lead', status: 'active', role: 'influencer', owner: 'Alex Morgan', createdAt: '2026-10-18T12:00:00Z', updatedAt: now },
  { id: 'C-008', name: 'Orlando Diggs', email: 'orlando@bright.com', company: 'Bright', jobTitle: 'VP Sales', status: 'active', role: 'decision-maker', owner: 'Alex Morgan', createdAt: '2026-10-08T10:00:00Z', updatedAt: now },
  { id: 'C-009', name: 'Andi Lane', email: 'andi@ventures.io', company: 'Ventures', status: 'do-not-contact', role: 'other', owner: 'Alex Morgan', notes: 'Requested no outreach.', createdAt: '2026-10-05T11:00:00Z', updatedAt: now },
  { id: 'C-010', name: 'Kate Morrison', email: 'kate@apex.co', company: 'Apex', status: 'active', role: 'champion', owner: 'Alex Morgan', createdAt: '2026-10-19T15:45:00Z', updatedAt: now },
];

let contactsDb: Contact[] = [...seedContacts];
let nextId = 11;
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const contactsService = {
  async list(filters?: ContactFilters): Promise<Contact[]> {
    await delay();
    let results = [...contactsDb];

    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((c) =>
        `${c.name} ${c.email} ${c.company}`.toLowerCase().includes(q),
      );
    }
    if (filters?.status && filters.status !== 'all') {
      results = results.filter((c) => c.status === filters.status);
    }
    if (filters?.role && filters.role !== 'all') {
      results = results.filter((c) => c.role === filters.role);
    }

    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(id: string): Promise<Contact> {
    await delay(150);
    const contact = contactsDb.find((c) => c.id === id);
    if (!contact) throw new Error('Contact not found');
    return contact;
  },

  async create(input: CreateContactInput): Promise<Contact> {
    await delay(300);
    const now = new Date().toISOString();
    const contact: Contact = {
      id: `C-${String(nextId++).padStart(3, '0')}`,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      company: input.company.trim(),
      jobTitle: input.jobTitle?.trim() || undefined,
      status: input.status ?? 'active',
      role: input.role ?? 'other',
      owner: 'Alex Morgan',
      notes: input.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    contactsDb = [contact, ...contactsDb];
    return contact;
  },

  async update(input: UpdateContactInput): Promise<Contact> {
    await delay(250);
    const index = contactsDb.findIndex((c) => c.id === input.id);
    if (index === -1) throw new Error('Contact not found');

    const updated: Contact = {
      ...contactsDb[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    contactsDb = [...contactsDb.slice(0, index), updated, ...contactsDb.slice(index + 1)];
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay(200);
    contactsDb = contactsDb.filter((c) => c.id !== id);
  },
};