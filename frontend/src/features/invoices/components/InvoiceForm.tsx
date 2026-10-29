import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { validateInvoice, hasErrors, type ValidationErrors } from '../validation/invoice.schema';
import type { CreateInvoiceInput, Invoice } from '../types/invoice.types';

interface InvoiceFormProps {
  initial?: Invoice;
  onSubmit: (values: CreateInvoiceInput) => Promise<void>;
  onCancel: () => void;
}

export function InvoiceForm({ initial, onSubmit, onCancel }: InvoiceFormProps) {
  const [values, setValues] = useState<CreateInvoiceInput>({
    customer: initial?.customer ?? '',
    dealName: initial?.dealName ?? '',
    issueDate: initial?.issueDate ?? new Date().toISOString().slice(0, 10),
    dueDate: initial?.dueDate ?? '',
    subtotal: initial?.subtotal ?? 0,
    tax: initial?.tax ?? 0,
    notes: initial?.notes ?? '',
  });
  const [errors, setErrors] = useState<ValidationErrors<CreateInvoiceInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof CreateInvoiceInput>(key: K, value: CreateInvoiceInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  const total = (values.subtotal ?? 0) + (values.tax ?? 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateInvoice(values);
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
      <Input
        label="Customer"
        requiredMark
        value={values.customer}
        onChange={(e) => update('customer', e.target.value)}
        error={errors.customer}
        placeholder="Customer / company name"
      />
      <Input
        label="Related deal"
        value={values.dealName ?? ''}
        onChange={(e) => update('dealName', e.target.value)}
        placeholder="Deal name (optional)"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input
          label="Issue date"
          requiredMark
          type="date"
          value={values.issueDate}
          onChange={(e) => update('issueDate', e.target.value)}
          error={errors.issueDate}
        />
        <Input
          label="Due date"
          requiredMark
          type="date"
          value={values.dueDate}
          onChange={(e) => update('dueDate', e.target.value)}
          error={errors.dueDate}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input
          label="Subtotal (USD)"
          requiredMark
          type="number"
          value={values.subtotal?.toString() ?? ''}
          onChange={(e) => update('subtotal', Number(e.target.value))}
          error={errors.subtotal}
          placeholder="e.g. 10000"
        />
        <Input
          label="Tax (USD)"
          type="number"
          value={values.tax?.toString() ?? ''}
          onChange={(e) => update('tax', Number(e.target.value))}
          error={errors.tax}
          placeholder="e.g. 1000"
        />
      </div>

      <div style={{
        padding: '10px 12px',
        background: '#fafaf8',
        borderRadius: 6,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, color: '#6d7770' }}>Total</span>
        <strong style={{ fontSize: 14, color: '#2b3831' }}>${total.toLocaleString()}</strong>
      </div>

      <div className="input-field">
        <label className="field-label" htmlFor="invoice-notes">Notes</label>
        <textarea
          id="invoice-notes"
          className="text-input"
          style={{ height: 60, padding: 10, resize: 'vertical' }}
          value={values.notes ?? ''}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Payment terms, context, etc."
        />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>
          {initial ? 'Save changes' : 'Create invoice'}
        </Button>
      </div>
    </form>
  );
}