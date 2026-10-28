import { MoreHorizontal } from 'lucide-react';
import { DataTable, type Column } from '../../../components/tables/DataTable';
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

export function LeadTable({ data, isLoading, onRowClick, onEdit, onDelete }: LeadTableProps) {
  const columns: Column<Lead>[] = [
    {
      key: 'name',
      header: 'Lead',
      render: (lead) => (
        <div className="lead-person">
          <span className={`lead-avatar avatar-${['coral', 'blue', 'green', 'yellow', 'purple'][lead.name.length % 5]}`}>
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
          <button
            className="row-more"
            type="button"
            aria-label={`Edit ${lead.name}`}
            onClick={(e) => { e.stopPropagation(); onEdit(lead); }}
          >
            <MoreHorizontal size={16} />
          </button>
          <button
            className="row-more"
            type="button"
            aria-label={`Delete ${lead.name}`}
            onClick={(e) => { e.stopPropagation(); onDelete(lead); }}
            style={{ color: '#bd6948' }}
          >
            ×
          </button>
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