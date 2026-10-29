import { Eye, Pencil, Ban, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '../../../components/tables/DataTable';
import { RowMenu } from '../../../components/common/RowMenu';
import {
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_TONE,
  getOutstanding,
  isInvoiceOverdue,
  type Invoice,
} from '../types/invoice.types';

interface InvoiceTableProps {
  data: Invoice[];
  isLoading: boolean;
  onRowClick: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onVoid: (invoice: Invoice) => void;
}

export function InvoiceTable({ data, isLoading, onRowClick, onEdit, onVoid }: InvoiceTableProps) {
  const columns: Column<Invoice>[] = [
    {
      key: 'number',
      header: 'Invoice',
      render: (i) => (
        <div>
          <strong style={{ display: 'block', color: '#46534b', fontSize: 11 }}>{i.number}</strong>
          <span style={{ fontSize: 10, color: '#8d968e' }}>{i.customer}</span>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Issue / Due',
      render: (i) => {
        const overdue = isInvoiceOverdue(i);
        return (
          <div style={{ fontSize: 10 }}>
            <div style={{ color: '#5a655e' }}>
              {new Date(i.issueDate).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
            </div>
            <div style={{ color: overdue ? '#bd6948' : '#8d968e', fontWeight: overdue ? 700 : 400 }}>
              {new Date(i.dueDate).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
            </div>
          </div>
        );
      },
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      render: (i) => (
        <strong style={{ color: '#2b3831', fontSize: 11 }}>${i.total.toLocaleString()}</strong>
      ),
    },
    {
      key: 'paid',
      header: 'Paid',
      align: 'right',
      render: (i) => {
        const outstanding = getOutstanding(i);
        return (
          <div style={{ fontSize: 10, textAlign: 'right' }}>
            <div style={{ color: '#397a55', fontWeight: 600 }}>${i.paidAmount.toLocaleString()}</div>
            {outstanding > 0 && (
              <div style={{ color: '#bd6948' }}>${outstanding.toLocaleString()} due</div>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (i) => {
        const tone = INVOICE_STATUS_TONE[i.status];
        return (
          <span className="status-pill" style={{ color: tone.fg, background: tone.bg }}>
            <i />{INVOICE_STATUS_LABELS[i.status]}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (i) => {
        const canVoid = i.status !== 'void' && i.status !== 'paid';
        return (
          <RowMenu
            ariaLabel={`Actions for ${i.number}`}
            items={[
              { label: 'View details', icon: <Eye size={13} />, onClick: () => onRowClick(i) },
              { label: 'Edit', icon: <Pencil size={13} />, onClick: () => onEdit(i) },
              ...(canVoid
                ? [{ label: 'Void invoice', icon: <Ban size={13} />, onClick: () => onVoid(i), danger: true as const }]
                : []),
            ]}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(i) => i.id}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyMessage="No invoices found. Create your first one."
    />
  );
}