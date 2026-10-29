import { Search } from 'lucide-react';
import {
  INVOICE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  type InvoiceFilters as InvFilters,
  type InvoiceStatus,
  type PaymentFilters as PayFilters,
  type PaymentMethod,
  type PaymentStatus,
} from '../types/invoice.types';

export function InvoiceFilters({ filters, onChange }: { filters: InvFilters; onChange: (f: InvFilters) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <label className="global-search" style={{ width: 240, height: 34, display: 'flex' }}>
        <Search size={14} />
        <input
          aria-label="Search invoices"
          placeholder="Search by number, customer..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </label>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.status ?? 'all'}
        onChange={(e) => onChange({ ...filters, status: e.target.value as InvoiceStatus | 'all' })}
      >
        <option value="all">All statuses</option>
        {(Object.keys(INVOICE_STATUS_LABELS) as InvoiceStatus[]).map((s) => (
          <option key={s} value={s}>{INVOICE_STATUS_LABELS[s]}</option>
        ))}
      </select>
    </div>
  );
}

export function PaymentFilters({ filters, onChange }: { filters: PayFilters; onChange: (f: PayFilters) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <label className="global-search" style={{ width: 240, height: 34, display: 'flex' }}>
        <Search size={14} />
        <input
          aria-label="Search payments"
          placeholder="Search by invoice, customer, reference..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </label>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.method ?? 'all'}
        onChange={(e) => onChange({ ...filters, method: e.target.value as PaymentMethod | 'all' })}
      >
        <option value="all">All methods</option>
        {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => (
          <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>
        ))}
      </select>

      <select
        className="subtle-select"
        style={{ height: 34, padding: '0 10px', fontSize: 11 }}
        value={filters.status ?? 'all'}
        onChange={(e) => onChange({ ...filters, status: e.target.value as PaymentStatus | 'all' })}
      >
        <option value="all">All statuses</option>
        {(Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[]).map((s) => (
          <option key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</option>
        ))}
      </select>
    </div>
  );
}