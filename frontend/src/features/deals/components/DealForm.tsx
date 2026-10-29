import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { validateDeal, hasErrors, type ValidationErrors } from '../validation/deal.schema';
import {
  DEAL_SOURCE_LABELS,
  DEAL_STAGE_LABELS,
  type CreateDealInput,
  type Deal,
  type DealSource,
  type DealStage,
} from '../types/deal.types';

interface DealFormProps {
  initial?: Deal;
  onSubmit: (values: CreateDealInput) => Promise<void>;
  onCancel: () => void;
}

export function DealForm({ initial, onSubmit, onCancel }: DealFormProps) {
  const [values, setValues] = useState<CreateDealInput>({
    name: initial?.name ?? '',
    value: initial?.value ?? 0,
    currency: initial?.currency ?? 'USD',
    stage: initial?.stage ?? 'new',
    probability: initial?.probability ?? 10,
    expectedCloseDate: initial?.expectedCloseDate ?? '',
    companyName: initial?.companyName ?? '',
    contactName: initial?.contactName ?? '',
    source: initial?.source ?? 'inbound',
    notes: initial?.notes ?? '',
  });
  const [errors, setErrors] = useState<ValidationErrors<CreateDealInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof CreateDealInput>(key: K, value: CreateDealInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateDeal(values);
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
        label="Deal name"
        requiredMark
        value={values.name}
        onChange={(e) => update('name', e.target.value)}
        error={errors.name}
        placeholder="e.g. Layers — Enterprise Plan"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input
          label="Company"
          requiredMark
          value={values.companyName}
          onChange={(e) => update('companyName', e.target.value)}
          error={errors.companyName}
          placeholder="Company name"
        />
        <Input
          label="Contact"
          value={values.contactName ?? ''}
          onChange={(e) => update('contactName', e.target.value)}
          placeholder="Primary contact"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input
          label="Value (USD)"
          requiredMark
          type="number"
          value={values.value?.toString() ?? ''}
          onChange={(e) => update('value', Number(e.target.value))}
          error={errors.value}
          placeholder="e.g. 48000"
        />
        <Input
          label="Probability (%)"
          type="number"
          min={0}
          max={100}
          value={values.probability?.toString() ?? ''}
          onChange={(e) => update('probability', Number(e.target.value))}
          error={errors.probability}
          placeholder="0-100"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="input-field">
          <label className="field-label" htmlFor="deal-stage">Stage</label>
          <select
            id="deal-stage"
            className="text-input"
            value={values.stage}
            onChange={(e) => update('stage', e.target.value as DealStage)}
          >
            {(Object.keys(DEAL_STAGE_LABELS) as DealStage[]).map((s) => (
              <option key={s} value={s}>{DEAL_STAGE_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div className="input-field">
          <label className="field-label" htmlFor="deal-source">Source</label>
          <select
            id="deal-source"
            className="text-input"
            value={values.source}
            onChange={(e) => update('source', e.target.value as DealSource)}
          >
            {(Object.keys(DEAL_SOURCE_LABELS) as DealSource[]).map((s) => (
              <option key={s} value={s}>{DEAL_SOURCE_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>
      <Input
        label="Expected close date"
        type="date"
        value={values.expectedCloseDate ?? ''}
        onChange={(e) => update('expectedCloseDate', e.target.value)}
      />
      <div className="input-field">
        <label className="field-label" htmlFor="deal-notes">Notes</label>
        <textarea
          id="deal-notes"
          className="text-input"
          style={{ height: 70, padding: 10, resize: 'vertical' }}
          value={values.notes ?? ''}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Requirements, blockers, next steps..."
        />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>
          {initial ? 'Save changes' : 'Add deal'}
        </Button>
      </div>
    </form>
  );
}