import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { validatePayment, hasErrors, type ValidationErrors } from '../validation/invoice.schema';
import {
  PAYMENT_METHOD_LABELS,
  getOutstanding,
  type CreatePaymentInput,
  type Invoice,
  type PaymentMethod,
} from '../types/invoice.types';

interface PaymentFormProps {
  invoice: Invoice;
  onSubmit: (values: Omit<CreatePaymentInput, 'invoiceId'>) => Promise<void>;
  onCancel: () => void;
}

export function PaymentForm({ invoice, onSubmit, onCancel }: PaymentFormProps) {
  const outstanding = getOutstanding(invoice);
  const [values, setValues] = useState<Omit<CreatePaymentInput, 'invoiceId'>>({
    amount: outstanding,
    method: 'bank-transfer',
    reference: '',
    paidAt: new Date().toISOString().slice(0, 10),
    notes: '',
  });
  const [errors, setErrors] = useState<ValidationErrors<CreatePaymentInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validatePayment(
      { ...values, invoiceId: invoice.id },
      outstanding,
    );
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        padding: '10px 12px',
        background: '#fafaf8',
        borderRadius: 6,
        fontSize: 11,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6d7770' }}>
          <span>Invoice</span>
          <strong style={{ color: '#2b3831' }}>{invoice.number}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, color: '#6d7770' }}>
          <span>Outstanding</span>
          <strong style={{ color: '#bd6948' }}>${outstanding.toLocaleString()}</strong>
        </div>
      </div>

      <Input
        label="Amount (USD)"
        requiredMark
        type="number"
        value={values.amount.toString()}
        onChange={(e) => update('amount', Number(e.target.value))}
        error={errors.amount}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="input-field">
          <label className="field-label" htmlFor="pay-method">Method</label>
          <select
            id="pay-method"
            className="text-input"
            value={values.method}
            onChange={(e) => update('method', e.target.value as PaymentMethod)}
          >
            {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => (
              <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>
            ))}
          </select>
        </div>
        <Input
          label="Paid on"
          type="date"
          value={values.paidAt ?? ''}
          onChange={(e) => update('paidAt', e.target.value)}
        />
      </div>

      <Input
        label="Reference"
        value={values.reference ?? ''}
        onChange={(e) => update('reference', e.target.value)}
        placeholder="Transaction ID, check #, etc."
      />

      <div className="input-field">
        <label className="field-label" htmlFor="pay-notes">Notes</label>
        <textarea
          id="pay-notes"
          className="text-input"
          style={{ height: 50, padding: 10, resize: 'vertical' }}
          value={values.notes ?? ''}
          onChange={(e) => update('notes', e.target.value)}
        />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>
          Record payment
        </Button>
      </div>
    </form>
  );
}