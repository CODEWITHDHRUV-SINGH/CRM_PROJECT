import type {
  CreateMemberInput,
  TeamFilters,
  TeamMember,
  UpdateMemberInput,
} from '../types/team.types';

const now = new Date().toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

const seedMembers: TeamMember[] = [
  { id: 'U-001', name: 'Alex Morgan', email: 'alex@universalcrm.io', role: 'owner', status: 'active', department: 'Leadership', phone: '+1-415-555-0100', lastActiveAt: hoursAgo(0.1), joinedAt: '2024-01-15', createdAt: '2024-01-15T10:00:00Z', updatedAt: now },
  { id: 'U-002', name: 'Sarah Chen', email: 'sarah@universalcrm.io', role: 'admin', status: 'active', department: 'Sales', phone: '+1-415-555-0101', lastActiveAt: hoursAgo(2), joinedAt: '2024-03-20', createdAt: '2024-03-20T10:00:00Z', updatedAt: now },
  { id: 'U-003', name: 'Marcus Reid', email: 'marcus@universalcrm.io', role: 'manager', status: 'active', department: 'Sales', lastActiveAt: hoursAgo(5), joinedAt: '2024-06-10', createdAt: '2024-06-10T10:00:00Z', updatedAt: now },
  { id: 'U-004', name: 'Priya Patel', email: 'priya@universalcrm.io', role: 'manager', status: 'active', department: 'Marketing', lastActiveAt: daysAgo(1), joinedAt: '2024-08-05', createdAt: '2024-08-05T10:00:00Z', updatedAt: now },
  { id: 'U-005', name: 'Diego Hernandez', email: 'diego@universalcrm.io', role: 'member', status: 'active', department: 'Sales', lastActiveAt: hoursAgo(1.5), joinedAt: '2025-01-12', createdAt: '2025-01-12T10:00:00Z', updatedAt: now },
  { id: 'U-006', name: 'Yuki Tanaka', email: 'yuki@universalcrm.io', role: 'member', status: 'active', department: 'Support', lastActiveAt: daysAgo(2), joinedAt: '2025-02-20', createdAt: '2025-02-20T10:00:00Z', updatedAt: now },
  { id: 'U-007', name: 'Elena Volkov', email: 'elena@universalcrm.io', role: 'viewer', status: 'active', department: 'Finance', lastActiveAt: daysAgo(5), joinedAt: '2025-04-15', createdAt: '2025-04-15T10:00:00Z', updatedAt: now },
  { id: 'U-008', name: 'James Okafor', email: 'james@universalcrm.io', role: 'member', status: 'invited', department: 'Sales', invitedAt: daysAgo(3), createdAt: daysAgo(3), updatedAt: now },
  { id: 'U-009', name: 'Nina Rossi', email: 'nina@universalcrm.io', role: 'viewer', status: 'invited', invitedAt: daysAgo(1), createdAt: daysAgo(1), updatedAt: now },
  { id: 'U-010', name: 'Tom Brooks', email: 'tom@universalcrm.io', role: 'member', status: 'suspended', department: 'Sales', lastActiveAt: daysAgo(45), joinedAt: '2024-11-01', createdAt: '2024-11-01T10:00:00Z', updatedAt: now },
];

let membersDb: TeamMember[] = [...seedMembers];
let nextId = 11;
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export const teamService = {
  async list(filters?: TeamFilters): Promise<TeamMember[]> {
    await delay();
    let results = [...membersDb];

    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      results = results.filter((m) =>
        `${m.name} ${m.email} ${m.department ?? ''}`.toLowerCase().includes(q),
      );
    }
    if (filters?.role && filters.role !== 'all') {
      results = results.filter((m) => m.role === filters.role);
    }
    if (filters?.status && filters.status !== 'all') {
      results = results.filter((m) => m.status === filters.status);
    }

    // Owners first, then by role priority, then alphabetical
    const roleOrder: Record<string, number> = { owner: 0, admin: 1, manager: 2, member: 3, viewer: 4 };
    return results.sort((a, b) => {
      const oa = roleOrder[a.role] ?? 99;
      const ob = roleOrder[b.role] ?? 99;
      if (oa !== ob) return oa - ob;
      return a.name.localeCompare(b.name);
    });
  },

  async get(id: string): Promise<TeamMember> {
    await delay(150);
    const member = membersDb.find((m) => m.id === id);
    if (!member) throw new Error('Member not found');
    return member;
  },

  async invite(input: CreateMemberInput): Promise<TeamMember> {
    await delay(300);
    const exists = membersDb.some((m) => m.email.toLowerCase() === input.email.toLowerCase().trim());
    if (exists) throw new Error('A member with this email already exists');

    const now = new Date().toISOString();
    const member: TeamMember = {
      id: `U-${String(nextId++).padStart(3, '0')}`,
      name: input.name.trim(),
      email: input.email.trim(),
      role: input.role,
      status: 'invited',
      department: input.department?.trim() || undefined,
      phone: input.phone?.trim() || undefined,
      invitedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    membersDb = [member, ...membersDb];
    return member;
  },

  async update(input: UpdateMemberInput): Promise<TeamMember> {
    await delay(250);
    const index = membersDb.findIndex((m) => m.id === input.id);
    if (index === -1) throw new Error('Member not found');

    const existing = membersDb[index];
    if (existing.role === 'owner' && input.role && input.role !== 'owner') {
      throw new Error('Cannot change owner role');
    }

    const updated: TeamMember = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    membersDb = [...membersDb.slice(0, index), updated, ...membersDb.slice(index + 1)];
    return updated;
  },

  async resendInvite(id: string): Promise<TeamMember> {
    await delay(250);
    const index = membersDb.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Member not found');
    if (membersDb[index].status !== 'invited') {
      throw new Error('Member is not in invited state');
    }
    const updated: TeamMember = { ...membersDb[index], invitedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    membersDb = [...membersDb.slice(0, index), updated, ...membersDb.slice(index + 1)];
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay(200);
    const member = membersDb.find((m) => m.id === id);
    if (!member) throw new Error('Member not found');
    if (member.role === 'owner') throw new Error('Cannot remove workspace owner');
    membersDb = membersDb.filter((m) => m.id !== id);
  },
};