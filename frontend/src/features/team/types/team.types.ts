export type TeamRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
export type MemberStatus = 'active' | 'invited' | 'suspended';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: MemberStatus;
  department?: string;
  phone?: string;
  lastActiveAt?: string;
  invitedAt?: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberInput {
  name: string;
  email: string;
  role: TeamRole;
  department?: string;
  phone?: string;
}

export interface UpdateMemberInput extends Partial<CreateMemberInput> {
  id: string;
  status?: MemberStatus;
}

export interface TeamFilters {
  search?: string;
  role?: TeamRole | 'all';
  status?: MemberStatus | 'all';
}

export const ROLE_LABELS: Record<TeamRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  manager: 'Manager',
  member: 'Member',
  viewer: 'Viewer',
};

export const ROLE_TONE: Record<TeamRole, { fg: string; bg: string }> = {
  owner: { fg: '#8a6b2c', bg: '#f5eecf' },
  admin: { fg: '#70518b', bg: '#f0eefa' },
  manager: { fg: '#547c9c', bg: '#edf4f9' },
  member: { fg: '#397a55', bg: '#edf5ed' },
  viewer: { fg: '#6d7770', bg: '#f3f3f0' },
};

export const STATUS_LABELS: Record<MemberStatus, string> = {
  active: 'Active',
  invited: 'Invited',
  suspended: 'Suspended',
};

export const STATUS_TONE: Record<MemberStatus, { fg: string; bg: string }> = {
  active: { fg: '#397a55', bg: '#edf5ed' },
  invited: { fg: '#aa7531', bg: '#fbf3e2' },
  suspended: { fg: '#bd6948', bg: '#fff1e9' },
};

export function formatLastActive(member: TeamMember): string {
  if (member.status === 'invited') return 'Invitation pending';
  if (!member.lastActiveAt) return 'Never';
  const diff = Date.now() - new Date(member.lastActiveAt).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(member.lastActiveAt).toLocaleDateString('en', { day: 'numeric', month: 'short' });
}