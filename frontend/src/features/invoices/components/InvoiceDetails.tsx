import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Loader } from '../../../components/common/Loader';
import { invoicesService } from '../services/invoicesService';
import {
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_TONE,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  getOutstanding,
  isInvoiceOverdue,
  type Invoice,
  type Payment,
} from '../types/invoice.types';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onClose: () => void;
  onEdit: () => void;
  onAddPayment: () => void;
  onVoid: () => void;
  refreshKey: number;
}

export function InvoiceDetails({ invoice, onClose, onEdit, onAddPayment, onVoid, refreshKey }: InvoiceDetailsProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    invoicesService.listPaymentsForInvoice(invoice.id).then((list) => {
      if (!cancelled) { setPayments(list); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [invoice.id, refreshKey]);

  const tone = INVOICE_STATUS_TONE[invoice.status];
  const outstanding = getOutstanding(invoice);
  const overdue = isInvoiceOverdue(invoice);
  const canAddPayment = outstanding > 0 && invoice.status !== 'void' && invoice.status !== 'draft';
  const canVoid = invoice.status !== 'void' && invoice.status !== 'paid';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, color: '#2b3831' }}>{invoice.number}</h3>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#89928b' }}>{invoice.customer}</p>
        </div>
        <span className="status-pill" style={{ color: tone.fg, background: tone.bg }}>
          <i />{INVOICE_STATUS_LABELS[invoice.status]}
        </span>
      </div>

      <div style={{
        padding: 12,
        background: '#fafaf8',
        borderRadius: 8,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 10,
      }}>
        <Stat label="Subtotal" value={`$${invoice.subtotal.toLocaleString()}`} />
        <Stat label="Tax" value={`$${invoice.tax.toLocaleString()}`} />
        <Stat label="Total" value={`$${invoice.total.toLocaleString()}`} highlight />
        <Stat label="Paid" value={`$${invoice.paidAmount.toLocaleString()}`} success />
        <Stat label="Outstanding" value={`$${outstanding.toLocaleString()}`} danger={outstanding > 0 && overdue} />
        <Stat
          label="Due"
          value={new Date(invoice.dueDate).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
          danger={overdue}
        />
      </div>

      {invoice.notes && (
        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#5a655e', background: '#fafaf8', padding: 10, borderRadius: 6 }}>
          {invoice.notes}
        </p>
      )}

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#89928b', textTransform: 'uppercase', letterSpacing: 1 }}>
            Payment history ({payments.length})
          </p>
          {canAddPayment && (
            <Button variant="secondary" size="sm" iconLeft={<Plus size={12} />} onClick={onAddPayment}>
              Add payment
            </Button>
          )}
        </div>

        {loading ? (
          <Loader size="sm" />
        ) : payments.length === 0 ? (
          <div style={{
            padding: 18,
            textAlign: 'center',
            fontSize: 10,
            color: '#b0b6af',
            border: '1px dashed #e5e7e0',
            borderRadius: 6,
          }}>
            No payments yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {payments.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  border: '1px solid #f0f0ec',
                  borderRadius: 6,
                  fontSize: 10,
                }}
              >
                <div>
                  <strong style={{ color: p.status === 'refunded' ? '#8a6b5d' : '#2b3831', textDecoration: p.status === 'refunded' ? 'line-through' : 'none' }}>
                    ${p.amount.toLocaleString()}
                  </strong>
                  <span style={{ color: '#8d968e', marginLeft: 6 }}>
                    {PAYMENT_METHOD_LABELS[p.method]}
                  </span>
                  {p.reference && (
                    <span style={{ color: '#b0b6af', marginLeft: 6 }}>· {p.reference}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: p.status === 'refunded' ? '#bd6948' : '#89928b' }}>
                    {p.status === 'refunded' ? PAYMENT_STATUS_LABELS.refunded : new Date(p.paidAt).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        {canVoid && <Button variant="secondary" onClick={onVoid}>Void</Button>}
        <Button variant="primary" onClick={onEdit}>Edit invoice</Button>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight, success, danger }: { label: string; value: string; highlight?: boolean; success?: boolean; danger?: boolean }) {
  const color = danger ? '#bd6948' : success ? '#397a55' : highlight ? '#176451' : '#2b3831';
  return (
    <div>
      <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: '#a0a69f', textTransform: 'uppercase', letterSpacing: 0.8 }}>
        {label}
      </p>
      <p style={{ margin: 0, color, fontSize: 12, fontWeight: 600 }}>{value}</p>
    </div>
  );
}