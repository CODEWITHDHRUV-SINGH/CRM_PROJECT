import { Search } from 'lucide-react';
import {
  COMPANY_INDUSTRY_LABELS,
  COMPANY_SIZE_LABELS,
  COMPANY_STATUS_LABELS,
  type CompanyFilters as Filters,
  type CompanyIndustry,
  type CompanySize,
  type CompanyStatus,
} from '../types/company.types';

interface CompanyFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function CompanyFilters({ filters, onChange }: CompanyFiltersProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <label className="global-search" style={{ width: 240, height: 34, display: 'flex' }}>
        <Search size={14} />
        <input
          aria-label="Search companies"
          placeholder="Search by name, domain, location..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </label>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.status ?? 'all'}
        onChange={(e) => onChange({ ...filters, status: e.target.value as CompanyStatus | 'all' })}
      >
        <option value="all">All statuses</option>
        {(Object.keys(COMPANY_STATUS_LABELS) as CompanyStatus[]).map((s) => (
          <option key={s} value={s}>{COMPANY_STATUS_LABELS[s]}</option>
        ))}
      </select>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.industry ?? 'all'}
        onChange={(e) => onChange({ ...filters, industry: e.target.value as CompanyIndustry | 'all' })}
      >
        <option value="all">All industries</option>
        {(Object.keys(COMPANY_INDUSTRY_LABELS) as CompanyIndustry[]).map((i) => (
          <option key={i} value={i}>{COMPANY_INDUSTRY_LABELS[i]}</option>
        ))}
      </select>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.size ?? 'all'}
        onChange={(e) => onChange({ ...filters, size: e.target.value as CompanySize | 'all' })}
      >
        <option value="all">All sizes</option>
        {(Object.keys(COMPANY_SIZE_LABELS) as CompanySize[]).map((s) => (
          <option key={s} value={s}>{COMPANY_SIZE_LABELS[s]}</option>
        ))}
      </select>
    </div>
  );
}