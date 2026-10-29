import { useState } from 'react';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ErrorMessage } from '../components/feedback/ErrorMessage';
import { useToast } from '../components/feedback/Toast';
import { usePayments } from '../features/invoices/hooks/usePayments';
import { PaymentFilters } from '../features/invoices/components/InvoiceFilters';
import { PaymentTable } from '../features/invoices/components/PaymentTable';
import type {
  Payment,
  PaymentFilters as Filters,
} from '../features/invoices/types/invoice.types';
import { getErrorMessage } from '../api/errorHandler';

export default function PaymentsPage() {
  const toast = useToast();
  const [filters, setFilters] = useState<Filters>({ search: '', method: 'all', status: 'all' });
  const { data, isLoading, error, refetch, refund } = usePayments(filters);

  const [refundTarget, setRefundTarget] = useState<Payment | null>(null);
  const [isRefunding, setIsRefunding] = useState(false);

  const totals = data.reduce(
    (acc, p) => {
      if (p.status === 'completed') acc.completed += p.amount;
      if (p.status === 'refunded') acc.refunded += p.amount;
      return acc;
    },
    { completed: 0, refunded: 0 },
  );

  async function handleRefund() {
    if (!refundTarget) return;
    setIsRefunding(true);
    try {
      await refund(refundTarget.id);
      toast.success('Payment refunded');
      setRefundTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsRefunding(false);
    }
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading-row">
        <div>
          <p className="eyebrow">OPERATIONS <span className="heading-eyebrow-dot">/</span> Payments</p>
          <h1>Payments</h1>
          <p className="page-subtitle">
            {isLoading ? 'Loading...' : `${data.length} payments · $${totals.completed.toLocaleString()} collected`}
          </p>
        </div>
      </div>

      {!isLoading && data.length > 0 && (
        <section className="stat-grid" style={{ marginBottom: 14 }}>
          <article className="stat-card">
            <p className="stat-label">Collected</p>
            <div className="stat-value-row"><strong style={{ color: '#397a55' }}>${totals.completed.toLocaleString()}</strong></div>
          </article>
          <article className="stat-card">
            <p className="stat-label">Refunded</p>
            <div className="stat-value-row"><strong style={{ color: '#bd6948' }}>${totals.refunded.toLocaleString()}</strong></div>
          </article>
          <article className="stat-card">
            <p className="stat-label">Net</p>
            <div className="stat-value-row"><strong>${(totals.completed - totals.refunded).toLocaleString()}</strong></div>
          </article>
          <article className="stat-card">
            <p className="stat-label">Total records</p>
            <div className="stat-value-row"><strong>{data.length}</strong></div>
          </article>
        </section>
      )}

      <section className="panel" style={{ padding: '16px 18px' }}>
        <div style={{ marginBottom: 14 }}>
          <PaymentFilters filters={filters} onChange={setFilters} />
        </div>
        {error ? (
          <ErrorMessage onRetry={refetch} message={error} />
        ) : (
          <PaymentTable
            data={data}
            isLoading={isLoading}
            onRefund={(p) => setRefundTarget(p)}
          />
        )}
      </section>

      <ConfirmDialog
        open={!!refundTarget}
        title="Refund this payment?"
        description={`This will refund $${refundTarget?.amount.toLocaleString() ?? ''} and update the invoice status.`}
        confirmText="Refund"
        variant="danger"
        loading={isRefunding}
        onConfirm={handleRefund}
        onCancel={() => setRefundTarget(null)}
      />
    </div>
  );
}