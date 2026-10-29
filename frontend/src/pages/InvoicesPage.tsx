import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { useToast } from '../components/feedback/Toast';
import { useInvoices } from '../features/invoices/hooks/useInvoices';
import { InvoiceFilters } from '../features/invoices/components/InvoiceFilters';
import { InvoiceTable } from '../features/invoices/components/InvoiceTable';
import { InvoiceForm } from '../features/invoices/components/InvoiceForm';
import { InvoiceDetails } from '../features/invoices/components/InvoiceDetails';
import { PaymentForm } from '../features/invoices/components/PaymentForm';
import type {
  CreateInvoiceInput,
  CreatePaymentInput,
  Invoice,
  InvoiceFilters as Filters,
} from '../features/invoices/types/invoice.types';
import { getOutstanding } from '../features/invoices/types/invoice.types';
import { getErrorMessage } from '../api/errorHandler';

export default function InvoicesPage() {
  const toast = useToast();
  const [filters, setFilters] = useState<Filters>({ search: '', status: 'all' });
  const { data, isLoading, error, refetch, create, update, voidInvoice, addPayment } = useInvoices(filters);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Invoice | null>(null);
  const [viewTarget, setViewTarget] = useState<Invoice | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<Invoice | null>(null);
  const [voidTarget, setVoidTarget] = useState<Invoice | null>(null);
  const [isVoiding, setIsVoiding] = useState(false);
  const [detailsRefreshKey, setDetailsRefreshKey] = useState(0);

  const totals = data.reduce(
    (acc, i) => {
      acc.total += i.total;
      acc.paid += i.paidAmount;
      acc.outstanding += getOutstanding(i);
      return acc;
    },
    { total: 0, paid: 0, outstanding: 0 },
  );

  async function handleCreate(values: CreateInvoiceInput) {
    try {
      await create(values);
      toast.success('Invoice created');
      setCreateOpen(false);
    } catch (err) { toast.error(getErrorMessage(err)); }
  }

  async function handleUpdate(values: CreateInvoiceInput) {
    if (!editTarget) return;
    try {
      const updated = await update({ ...values, id: editTarget.id });
      if (viewTarget?.id === updated.id) setViewTarget(updated);
      toast.success('Invoice updated');
      setEditTarget(null);
    } catch (err) { toast.error(getErrorMessage(err)); }
  }

  async function handleAddPayment(values: Omit<CreatePaymentInput, 'invoiceId'>) {
    if (!paymentTarget) return;
    try {
      const { invoice } = await addPayment({ ...values, invoiceId: paymentTarget.id });
      if (viewTarget?.id === invoice.id) setViewTarget(invoice);
      toast.success(`Payment of $${values.amount.toLocaleString()} recorded`);
      setPaymentTarget(null);
      setDetailsRefreshKey((k) => k + 1);
    } catch (err) { toast.error(getErrorMessage(err)); }
  }

  async function handleVoid() {
    if (!voidTarget) return;
    setIsVoiding(true);
    try {
      const updated = await voidInvoice(voidTarget.id);
      if (viewTarget?.id === updated.id) setViewTarget(updated);
      toast.success('Invoice voided');
      setVoidTarget(null);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setIsVoiding(false); }
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading-row">
        <div>
          <p className="eyebrow">OPERATIONS <span className="heading-eyebrow-dot">/</span> Invoices</p>
          <h1>Invoices</h1>
          <p className="page-subtitle">
            {isLoading ? 'Loading...' : `${data.length} invoices · $${(totals.outstanding).toLocaleString()} outstanding`}
          </p>
        </div>
        <div className="heading-actions">
          <Button variant="primary" iconLeft={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
            New invoice
          </Button>
        </div>
      </div>

      {!isLoading && data.length > 0 && (
        <section className="stat-grid" style={{ marginBottom: 14 }}>
          <article className="stat-card">
            <p className="stat-label">Total invoiced</p>
            <div className="stat-value-row"><strong>${totals.total.toLocaleString()}</strong></div>
          </article>
          <article className="stat-card">
            <p className="stat-label">Paid</p>
            <div className="stat-value-row"><strong style={{ color: '#397a55' }}>${totals.paid.toLocaleString()}</strong></div>
          </article>
          <article className="stat-card">
            <p className="stat-label">Outstanding</p>
            <div className="stat-value-row"><strong style={{ color: '#bd6948' }}>${totals.outstanding.toLocaleString()}</strong></div>
          </article>
          <article className="stat-card">
            <p className="stat-label">Collection rate</p>
            <div className="stat-value-row"><strong>{totals.total > 0 ? Math.round((totals.paid / totals.total) * 100) : 0}%</strong></div>
          </article>
        </section>
      )}

      <section className="panel" style={{ padding: '16px 18px' }}>
        <div style={{ marginBottom: 14 }}>
          <InvoiceFilters filters={filters} onChange={setFilters} />
        </div>
        {error ? (
          <ErrorMessage onRetry={refetch} message={error} />
        ) : (
          <InvoiceTable
            data={data}
            isLoading={isLoading}
            onRowClick={setViewTarget}
            onEdit={setEditTarget}
            onVoid={setVoidTarget}
          />
        )}
      </section>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create invoice" size="lg">
        <InvoiceForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit invoice" subtitle={editTarget?.number} size="lg">
        {editTarget && <InvoiceForm initial={editTarget} onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} />}
      </Modal>

      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Invoice details" size="lg">
        {viewTarget && (
          <InvoiceDetails
            invoice={viewTarget}
            onClose={() => setViewTarget(null)}
            onEdit={() => { setEditTarget(viewTarget); setViewTarget(null); }}
            onAddPayment={() => { setPaymentTarget(viewTarget); }}
            onVoid={() => { setVoidTarget(viewTarget); }}
            refreshKey={detailsRefreshKey}
          />
        )}
      </Modal>

      <Modal
        open={!!paymentTarget}
        onClose={() => setPaymentTarget(null)}
        title="Record payment"
        subtitle={paymentTarget?.number}
      >
        {paymentTarget && (
          <PaymentForm
            invoice={paymentTarget}
            onSubmit={handleAddPayment}
            onCancel={() => setPaymentTarget(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!voidTarget}
        title={`Void invoice ${voidTarget?.number ?? ''}?`}
        description="Voiding an invoice keeps the record but cancels it. This cannot be undone."
        confirmText="Void invoice"
        variant="danger"
        loading={isVoiding}
        onConfirm={handleVoid}
        onCancel={() => setVoidTarget(null)}
      />
    </div>
  );
}