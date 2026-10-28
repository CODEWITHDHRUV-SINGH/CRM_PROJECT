import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { validateContact, hasErrors, type ValidationErrors } from '../validation/contact.schema';
import {
  CONTACT_ROLE_LABELS,
  CONTACT_STATUS_LABELS,
  type Contact,
  type ContactRole,
  type ContactStatus,
  type CreateContactInput,
} from '../types/contact.types';

interface ContactFormProps {
  initial?: Contact;
  onSubmit: (values: CreateContactInput) => Promise<void>;
  onCancel: () => void;
}

export function ContactForm({ initial, onSubmit, onCancel }: ContactFormProps) {
  const [values, setValues] = useState<CreateContactInput>({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    company: initial?.company ?? '',
    jobTitle: initial?.jobTitle ?? '',
    status: initial?.status ?? 'active',
    role: initial?.role ?? 'other',
    notes: initial?.notes ?? '',
  });
  const [errors, setErrors] = useState<ValidationErrors<CreateContactInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof CreateContactInput>(key: K, value: CreateContactInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateContact(values);
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input
          label="Company"
          requiredMark
          value={values.company}
          onChange={(e) => update('company', e.target.value)}
          error={errors.company}
          placeholder="Company name"
        />
        <Input
          label="Job title"
          value={values.jobTitle ?? ''}
          onChange={(e) => update('jobTitle', e.target.value)}
          placeholder="e.g. CTO"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input
          label="Phone"
          value={values.phone ?? ''}
          onChange={(e) => update('phone', e.target.value)}
          error={errors.phone}
          placeholder="+8801..."
        />
        <div className="input-field">
          <label className="field-label" htmlFor="contact-status">Status</label>
          <select
            id="contact-status"
            className="text-input"
            value={values.status}
            onChange={(e) => update('status', e.target.value as ContactStatus)}
          >
            {(Object.keys(CONTACT_STATUS_LABELS) as ContactStatus[]).map((s) => (
              <option key={s} value={s}>{CONTACT_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="input-field">
        <label className="field-label" htmlFor="contact-role">Role</label>
        <select
          id="contact-role"
          className="text-input"
          value={values.role}
          onChange={(e) => update('role', e.target.value as ContactRole)}
        >
          {(Object.keys(CONTACT_ROLE_LABELS) as ContactRole[]).map((r) => (
            <option key={r} value={r}>{CONTACT_ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>
      <div className="input-field">
        <label className="field-label" htmlFor="contact-notes">Notes</label>
        <textarea
          id="contact-notes"
          className="text-input"
          style={{ height: 70, padding: 10, resize: 'vertical' }}
          value={values.notes ?? ''}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Context, relationships, anything useful..."
        />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>
          {initial ? 'Save changes' : 'Add contact'}
        </Button>
      </div>
    </form>
  );
}