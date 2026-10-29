import { Eye, Pencil, Trash2, Globe, Users, Briefcase } from 'lucide-react';
import { DataTable, type Column } from '../../../components/tables/DataTable';
import { RowMenu } from '../../../components/common/RowMenu';
import {
  COMPANY_INDUSTRY_LABELS,
  COMPANY_SIZE_LABELS,
  COMPANY_STATUS_LABELS,
  type Company,
} from '../types/company.types';

interface CompanyTableProps {
  data: Company[];
  isLoading: boolean;
  onRowClick: (company: Company) => void;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

const AVATAR_COLORS = ['coral', 'blue', 'green', 'yellow', 'purple'];

export function CompanyTable({ data, isLoading, onRowClick, onEdit, onDelete }: CompanyTableProps) {
  const columns: Column<Company>[] = [
    {
      key: 'name',
      header: 'Company',
      render: (c) => (
        <div className="lead-person">
          <span className={`lead-avatar avatar-${AVATAR_COLORS[c.name.length % AVATAR_COLORS.length]}`}>
            {c.name.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <strong style={{ display: 'block', color: '#46534b', fontSize: 11 }}>{c.name}</strong>
            {c.domain && (
              <span style={{ fontSize: 10, color: '#8d968e', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Globe size={9} /> {c.domain}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'industry',
      header: 'Industry',
      render: (c) => (
        <span style={{ fontSize: 10, color: '#5a655e' }}>
          {COMPANY_INDUSTRY_LABELS[c.industry]}
        </span>
      ),
    },
    {
      key: 'size',
      header: 'Size',
      render: (c) => (
        <span style={{ fontSize: 10, color: '#5a655e' }}>
          {COMPANY_SIZE_LABELS[c.size]}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => {
        const tone =
          c.status === 'customer' ? { color: '#397a55', bg: '#edf5ed' } :
          c.status === 'prospect' ? { color: '#547c9c', bg: '#edf4f9' } :
          c.status === 'active' ? { color: '#397a55', bg: '#edf5ed' } :
          { color: '#bd6948', bg: '#fff1e9' };
        return (
          <span className="status-pill" style={{ color: tone.color, background: tone.bg }}>
            <i />{COMPANY_STATUS_LABELS[c.status]}
          </span>
        );
      },
    },
    {
      key: 'related',
      header: 'Related',
      align: 'center',
      render: (c) => (
        <div style={{ display: 'inline-flex', gap: 10, fontSize: 10, color: '#5a655e' }}>
          <span title="Contacts" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Users size={11} /> {c.contactCount}
          </span>
          <span title="Deals" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Briefcase size={11} /> {c.dealCount}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (c) => (
        <RowMenu
          ariaLabel={`Actions for ${c.name}`}
          items={[
            { label: 'View details', icon: <Eye size={13} />, onClick: () => onRowClick(c) },
            { label: 'Edit', icon: <Pencil size={13} />, onClick: () => onEdit(c) },
            { label: 'Delete', icon: <Trash2 size={13} />, onClick: () => onDelete(c), danger: true },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(c) => c.id}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyMessage="No companies found. Add your first one to get started."
    />
  );
}