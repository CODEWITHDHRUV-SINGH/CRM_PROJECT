import { Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '../../../components/tables/DataTable';
import { RowMenu } from '../../../components/common/RowMenu';
import {
  LEAD_STATUS_LABELS,
  type Lead,
} from '../types/lead.types';
import { LeadScoreBadge } from './LeadScoreBadge';

interface LeadTableProps {
  data: Lead[];
  isLoading: boolean;
  onRowClick: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const AVATAR_COLORS = ['coral', 'blue', 'green', 'yellow', 'purple'];

export function LeadTable({ data, isLoading, onRowClick, onEdit, onDelete }: LeadTableProps) {
  const columns: Column<Lead>[] = [
    {
      key: 'name',
      header: 'Lead',
      render: (lead) => (
        <div className="lead-person">
          <span className={`lead-avatar avatar-${AVATAR_COLORS[lead.name.length % AVATAR_COLORS.length]}`}>
            {lead.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
          </span>
          <div>
            <strong style={{ display: 'block', color: '#46534b', fontSize: 11 }}>
              {lead.name}
            </strong>
            <span style={{ fontSize: 10, color: '#8d968e' }}>{lead.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      render: (lead) => <span className="company-name">{lead.company}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (lead) => (
        <span className={`status-pill status-${lead.status}`}>
          <i />{LEAD_STATUS_LABELS[lead.status]}
        </span>
      ),
    },
    {
      key: 'score',
      header: 'Score',
      align: 'center',
      render: (lead) => <LeadScoreBadge score={lead.score} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (lead) => (
        <div style={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <RowMenu
            ariaLabel={`Actions for ${lead.name}`}
            items={[
              {
                label: 'View details',
                icon: <Eye size={13} />,
                onClick: () => onRowClick(lead),
              },
              {
                label: 'Edit',
                icon: <Pencil size={13} />,
                onClick: () => onEdit(lead),
              },
              {
                label: 'Delete',
                icon: <Trash2 size={13} />,
                onClick: () => onDelete(lead),
                danger: true,
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(l) => l.id}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyMessage="No leads found. Try adjusting filters or add a new lead."
    />
  );
}