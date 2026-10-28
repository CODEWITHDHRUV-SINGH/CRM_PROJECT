import { Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '../../../components/tables/DataTable';
import { RowMenu } from '../../../components/common/RowMenu';
import {
  CONTACT_ROLE_LABELS,
  CONTACT_STATUS_LABELS,
  type Contact,
} from '../types/contact.types';

interface ContactTableProps {
  data: Contact[];
  isLoading: boolean;
  onRowClick: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

const AVATAR_COLORS = ['coral', 'blue', 'green', 'yellow', 'purple'];

export function ContactTable({ data, isLoading, onRowClick, onEdit, onDelete }: ContactTableProps) {
  const columns: Column<Contact>[] = [
    {
      key: 'name',
      header: 'Contact',
      render: (c) => (
        <div className="lead-person">
          <span className={`lead-avatar avatar-${AVATAR_COLORS[c.name.length % AVATAR_COLORS.length]}`}>
            {c.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
          </span>
          <div>
            <strong style={{ display: 'block', color: '#46534b', fontSize: 11 }}>{c.name}</strong>
            <span style={{ fontSize: 10, color: '#8d968e' }}>{c.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      render: (c) => (
        <div>
          <strong style={{ display: 'block', color: '#46534b', fontSize: 11, fontWeight: 600 }}>{c.company}</strong>
          {c.jobTitle && <span style={{ fontSize: 10, color: '#8d968e' }}>{c.jobTitle}</span>}
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (c) => (
        <span style={{ fontSize: 10, color: '#5a655e' }}>
          {CONTACT_ROLE_LABELS[c.role]}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => {
        const tone =
          c.status === 'active' ? { color: '#397a55', bg: '#edf5ed' } :
          c.status === 'inactive' ? { color: '#6d7770', bg: '#f3f3f0' } :
          { color: '#bd6948', bg: '#fff1e9' };
        return (
          <span
            className="status-pill"
            style={{ color: tone.color, background: tone.bg }}
          >
            <i />{CONTACT_STATUS_LABELS[c.status]}
          </span>
        );
      },
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
      emptyMessage="No contacts found. Add your first one to get started."
    />
  );
}