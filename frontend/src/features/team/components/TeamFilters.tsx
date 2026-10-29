import { Search } from 'lucide-react';
import {
  ROLE_LABELS,
  STATUS_LABELS,
  type MemberStatus,
  type TeamFilters as Filters,
  type TeamRole,
} from '../types/team.types';

interface TeamFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function TeamFilters({ filters, onChange }: TeamFiltersProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <label className="global-search" style={{ width: 240, height: 34, display: 'flex' }}>
        <Search size={14} />
        <input
          aria-label="Search team"
          placeholder="Search by name, email, department..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </label>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.role ?? 'all'}
        onChange={(e) => onChange({ ...filters, role: e.target.value as TeamRole | 'all' })}
      >
        <option value="all">All roles</option>
        {(Object.keys(ROLE_LABELS) as TeamRole[]).map((r) => (
          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
        ))}
      </select>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.status ?? 'all'}
        onChange={(e) => onChange({ ...filters, status: e.target.value as MemberStatus | 'all' })}
      >
        <option value="all">All statuses</option>
        {(Object.keys(STATUS_LABELS) as MemberStatus[]).map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>
    </div>
  );
}