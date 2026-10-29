import { RotateCcw } from 'lucide-react';
import { DataTable, type Column } from '../../../components/tables/DataTable';
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  type Payment,
} from '../types/invoice.types';

interface PaymentTableProps {
  data: Payment[];
  isLoading: boolean;
  onRowClick?: (payment: Payment) => void;
  onRefund?: (payment: Payment) => void;
}

export function PaymentTable({ data, isLoading, onRowClick, onRefund }: PaymentTableProps) {
  const columns: Column<Payment>[] = [
    {
      key: 'invoice',
      header: 'Invoice',
      render: (p) => (
        <div>
          <strong style={{ display: 'block', color: '#46534b', fontSize: 11 }}>{p.invoiceNumber}</strong>
          <span style={{ fontSize: 10, color: '#8d968e' }}>{p.customer}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (p) => (
        <strong style={{
          color: p.status === 'refunded' ? '#8a6b5d' : '#2b3831',
          fontSize: 11,
          textDecoration: p.status === 'refunded' ? 'line-through' : 'none',
        }}>
          ${p.amount.toLocaleString()}
        </strong>
      ),
    },
    {
      key: 'method',
      header: 'Method',
      render: (p) => (
        <span style={{ fontSize: 10, color: '#5a655e' }}>{PAYMENT_METHOD_LABELS[p.method]}</span>
      ),
    },
    {
      key: 'reference',
      header: 'Reference',
      render: (p) => (
        <span style={{ fontSize: 10, color: '#8d968e' }}>{p.reference ?? '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => {
        const tone =
          p.status === 'completed' ? { fg: '#397a55', bg: '#edf5ed' } :
          { fg: '#bd6948', bg: '#fff1e9' };
        return (
          <span className="status-pill" style={{ color: tone.fg, background: tone.bg }}>
            <i />{PAYMENT_STATUS_LABELS[p.status]}
          </span>
        );
      },
    },
    {
      key: 'paidAt',
      header: 'Paid at',
      render: (p) => (
        <span style={{ fontSize: 10, color: '#5a655e' }}>
          {new Date(p.paidAt).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '60px',
      render: (p) => {
        if (p.status === 'refunded' || !onRefund) return null;
        return (
          <button
            className="row-more"
            type="button"
            title="Refund payment"
            aria-label={`Refund payment ${p.id}`}
            onClick={(e) => { e.stopPropagation(); onRefund(p); }}
            style={{ color: '#bd6948' }}
          >
            <RotateCcw size={14} />
          </button>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(p) => p.id}
      isLoading={isLoading}
      onRowClick={onRowClick}
      emptyMessage="No payments recorded yet."
    />
  );
}