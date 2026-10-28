import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { validateLead, hasErrors, type ValidationErrors } from '../validation/lead.schema';
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  type CreateLeadInput,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from '../types/lead.types';

interface LeadFormProps {
  initial?: Lead;
  onSubmit: (values: CreateLeadInput) => Promise<void>;
  onCancel: () => void;
}

export function LeadForm({ initial, onSubmit, onCancel }: LeadFormProps) {
  const [values, setValues] = useState<CreateLeadInput>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    company: initial?.company ?? '',
    jobTitle: initial?.jobTitle ?? '',
    status: initial?.status ?? 'new',
    source: initial?.source ?? 'website',
    notes: initial?.notes ?? '',
  });
  const [errors, setErrors] = useState<ValidationErrors<CreateLeadInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof CreateLeadInput>(key: K, value: CreateLeadInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateLead(values);
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
        label="Full name"
        requiredMark
        value={values.name}
        onChange={(e) => update('name', e.target.value)}
        error={errors.name}
        placeholder="e.g. Sam Taylor"
      />
      <Input
        label="Work email"
        requiredMark
        type="email"
        value={values.email}
        onChange={(e) => update('email', e.target.value)}
        error={errors.email}
        placeholder="sam@company.com"
      />
      <Input
        label="Company"
        requiredMark
        value={values.company}
        onChange={(e) => update('company', e.target.value)}
        error={errors.company}
        placeholder="Company name"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input
          label="Phone"
          value={values.phone ?? ''}
          onChange={(e) => update('phone', e.target.value)}
          error={errors.phone}
          placeholder="+8801..."
        />
        <Input
          label="Job title"
          value={values.jobTitle ?? ''}
          onChange={(e) => update('jobTitle', e.target.value)}
          placeholder="e.g. CTO"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="input-field">
          <label className="field-label" htmlFor="lead-status">Status</label>
          <select
            id="lead-status"
            className="text-input"
            value={values.status}
            onChange={(e) => update('status', e.target.value as LeadStatus)}
          >
            {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map((s) => (
              <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div className="input-field">
          <label className="field-label" htmlFor="lead-source">Source</label>
          <select
            id="lead-source"
            className="text-input"
            value={values.source}
            onChange={(e) => update('source', e.target.value as LeadSource)}
          >
            {(Object.keys(LEAD_SOURCE_LABELS) as LeadSource[]).map((s) => (
              <option key={s} value={s}>{LEAD_SOURCE_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="input-field">
        <label className="field-label" htmlFor="lead-notes">Notes</label>
        <textarea
          id="lead-notes"
          className="text-input"
          style={{ height: 70, padding: 10, resize: 'vertical' }}
          value={values.notes ?? ''}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Context, next steps, anything useful..."
        />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>
          {initial ? 'Save changes' : 'Add lead'}
        </Button>
      </div>
    </form>
  );
}