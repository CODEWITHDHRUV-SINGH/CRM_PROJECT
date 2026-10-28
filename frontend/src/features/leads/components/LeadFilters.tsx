import { Search } from 'lucide-react';
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  type LeadFilters as Filters,
  type LeadSource,
  type LeadStatus,
} from '../types/lead.types';

interface LeadFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function LeadFilters({ filters, onChange }: LeadFiltersProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <label
        className="global-search"
        style={{ width: 240, height: 34, display: 'flex' }}
      >
        <Search size={14} />
        <input
          aria-label="Search leads"
          placeholder="Search by name, email, company..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </label>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.status ?? 'all'}
        onChange={(e) => onChange({ ...filters, status: e.target.value as LeadStatus | 'all' })}
      >
        <option value="all">All statuses</option>
        {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((s) => (
          <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
        ))}
      </select>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.source ?? 'all'}
        onChange={(e) => onChange({ ...filters, source: e.target.value as LeadSource | 'all' })}
      >
        <option value="all">All sources</option>
        {(Object.keys(LEAD_SOURCE_LABELS) as LeadSource[]).map((s) => (
          <option key={s} value={s}>{LEAD_SOURCE_LABELS[s]}</option>
        ))}
      </select>
    </div>
  );
}