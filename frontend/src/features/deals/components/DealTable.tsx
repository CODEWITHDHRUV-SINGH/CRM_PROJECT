import { Eye, Pencil, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '../../../components/tables/DataTable';
import { RowMenu } from '../../../components/common/RowMenu';
import {
  DEAL_SOURCE_LABELS,
  DEAL_STAGE_LABELS,
  type Deal,
} from '../types/deal.types';

interface DealTableProps {
  data: Deal[];
  isLoading: boolean;
  onRowClick: (deal: Deal) => void;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

const STAGE_TONE: Record<string, { color: string; bg: string }> = {
  new: { color: '#bd6948', bg: '#fff1e9' },
  contacted: { color: '#aa7531', bg: '#fbf3e2' },
  qualified: { color: '#397a55', bg: '#edf5ed' },
  proposal: { color: '#547c9c', bg: '#edf4f9' },
  won: { color: '#176451', bg: '#e7f4ec' },
  lost: { color: '#8a6b5d', bg: '#f5f0ed' },
};

export function DealTable({ data, isLoading, onRowClick, onEdit, onDelete }: DealTableProps) {
  const columns: Column<Deal>[] = [
    {
      key: 'name',
      header: 'Deal',
      render: (d) => (
        <div>
          <strong style={{ display: 'block', color: '#46534b', fontSize: 11 }}>{d.name}</strong>
          <span style={{ fontSize: 10, color: '#8d968e' }}>{d.companyName}</span>
        </div>
      ),
    },
    {
      key: 'value',
      header: 'Value',
      align: 'right',
      render: (d) => (
        <strong style={{ color: '#2b3831', fontSize: 11 }}>
          ${d.value.toLocaleString()}
        </strong>
      ),
    },
    {
      key: 'stage',
      header: 'Stage',
      render: (d) => {
        const tone = STAGE_TONE[d.stage];
        return (
          <span className="status-pill" style={{ color: tone.color, background: tone.bg }}>
            <i />{DEAL_STAGE_LABELS[d.stage]}
          </span>
        );
      },
    },
    {
      key: 'probability',
      header: 'Probability',
      align: 'center',
      render: (d) => (
        <span style={{ fontSize: 10, color: '#5a655e' }}>{d.probability}%</span>
      ),
    },
    {
      key: 'closeDate',
      header: 'Expected close',
      render: (d) => (
        <span style={{ fontSize: 10, color: '#5a655e' }}>
          {d.expectedCloseDate
            ? new Date(d.expectedCloseDate).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—'}
        </span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      render: (d) => (
        <span style={{ fontSize: 10, color: '#5a655e' }}>{DEAL_SOURCE_LABELS[d.source]}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (d) => (
        <RowMenu
          ariaLabel={`Actions for ${d.name}`}
          items={[
            { label: 'View details', icon: <Eye size={13} />, onClick: () => onRowClick(d) },
            { label: 'Edit', icon: <Pencil size={13} />, onClick: () => onEdit(d) },
            { label: 'Delete', icon: <Trash2 size={13} />, onClick: () => onDelete(d), danger: true },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(d) => d.id}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyMessage="No deals found. Add your first opportunity."
    />
  );
}