import { Search } from 'lucide-react';
import {
  CONTACT_ROLE_LABELS,
  CONTACT_STATUS_LABELS,
  type ContactFilters as Filters,
  type ContactRole,
  type ContactStatus,
} from '../types/contact.types';

interface ContactFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function ContactFilters({ filters, onChange }: ContactFiltersProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <label className="global-search" style={{ width: 240, height: 34, display: 'flex' }}>
        <Search size={14} />
        <input
          aria-label="Search contacts"
          placeholder="Search by name, email, company..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </label>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.status ?? 'all'}
        onChange={(e) => onChange({ ...filters, status: e.target.value as ContactStatus | 'all' })}
      >
        <option value="all">All statuses</option>
        {(Object.keys(CONTACT_STATUS_LABELS) as ContactStatus[]).map((s) => (
          <option key={s} value={s}>{CONTACT_STATUS_LABELS[s]}</option>
        ))}
      </select>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.role ?? 'all'}
        onChange={(e) => onChange({ ...filters, role: e.target.value as ContactRole | 'all' })}
      >
        <option value="all">All roles</option>
        {(Object.keys(CONTACT_ROLE_LABELS) as ContactRole[]).map((r) => (
          <option key={r} value={r}>{CONTACT_ROLE_LABELS[r]}</option>
        ))}
      </select>
    </div>
  );
}