import { Search } from 'lucide-react';
import {
  DEAL_SOURCE_LABELS,
  DEAL_STAGE_LABELS,
  type DealFilters as Filters,
  type DealSource,
  type DealStage,
} from '../types/deal.types';

interface DealFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function DealFilters({ filters, onChange }: DealFiltersProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <label className="global-search" style={{ width: 240, height: 34, display: 'flex' }}>
        <Search size={14} />
        <input
          aria-label="Search deals"
          placeholder="Search by deal, company, contact..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </label>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.stage ?? 'all'}
        onChange={(e) => onChange({ ...filters, stage: e.target.value as DealStage | 'all' })}
      >
        <option value="all">All stages</option>
        {(Object.keys(DEAL_STAGE_LABELS) as DealStage[]).map((s) => (
          <option key={s} value={s}>{DEAL_STAGE_LABELS[s]}</option>
        ))}
      </select>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.source ?? 'all'}
        onChange={(e) => onChange({ ...filters, source: e.target.value as DealSource | 'all' })}
      >
        <option value="all">All sources</option>
        {(Object.keys(DEAL_SOURCE_LABELS) as DealSource[]).map((s) => (
          <option key={s} value={s}>{DEAL_SOURCE_LABELS[s]}</option>
        ))}
      </select>
    </div>
  );
}