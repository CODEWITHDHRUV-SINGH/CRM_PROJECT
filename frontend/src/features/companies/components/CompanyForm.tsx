import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { validateCompany, hasErrors, type ValidationErrors } from '../validation/company.schema';
import {
  COMPANY_INDUSTRY_LABELS,
  COMPANY_SIZE_LABELS,
  COMPANY_STATUS_LABELS,
  type Company,
  type CompanyIndustry,
  type CompanySize,
  type CompanyStatus,
  type CreateCompanyInput,
} from '../types/company.types';

interface CompanyFormProps {
  initial?: Company;
  onSubmit: (values: CreateCompanyInput) => Promise<void>;
  onCancel: () => void;
}

export function CompanyForm({ initial, onSubmit, onCancel }: CompanyFormProps) {
  const [values, setValues] = useState<CreateCompanyInput>({
    name: initial?.name ?? '',
    domain: initial?.domain ?? '',
    industry: initial?.industry ?? 'technology',
    size: initial?.size ?? '1-10',
    location: initial?.location ?? '',
    phone: initial?.phone ?? '',
    description: initial?.description ?? '',
    status: initial?.status ?? 'prospect',
    annualRevenue: initial?.annualRevenue,
  });
  const [errors, setErrors] = useState<ValidationErrors<CreateCompanyInput>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof CreateCompanyInput>(key: K, value: CreateCompanyInput[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateCompany(values);
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
        label="Company name"
        requiredMark
        value={values.name}
        onChange={(e) => update('name', e.target.value)}
        error={errors.name}
        placeholder="e.g. Layers"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input
          label="Website"
          value={values.domain ?? ''}
          onChange={(e) => update('domain', e.target.value)}
          error={errors.domain}
          placeholder="example.com"
        />
        <Input
          label="Phone"
          value={values.phone ?? ''}
          onChange={(e) => update('phone', e.target.value)}
          error={errors.phone}
          placeholder="+1-415-555-0100"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="input-field">
          <label className="field-label" htmlFor="company-industry">Industry</label>
          <select
            id="company-industry"
            className="text-input"
            value={values.industry}
            onChange={(e) => update('industry', e.target.value as CompanyIndustry)}
          >
            {(Object.keys(COMPANY_INDUSTRY_LABELS) as CompanyIndustry[]).map((i) => (
              <option key={i} value={i}>{COMPANY_INDUSTRY_LABELS[i]}</option>
            ))}
          </select>
        </div>
        <div className="input-field">
          <label className="field-label" htmlFor="company-size">Size</label>
          <select
            id="company-size"
            className="text-input"
            value={values.size}
            onChange={(e) => update('size', e.target.value as CompanySize)}
          >
            {(Object.keys(COMPANY_SIZE_LABELS) as CompanySize[]).map((s) => (
              <option key={s} value={s}>{COMPANY_SIZE_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Input
          label="Location"
          value={values.location ?? ''}
          onChange={(e) => update('location', e.target.value)}
          placeholder="City, Country"
        />
        <div className="input-field">
          <label className="field-label" htmlFor="company-status">Status</label>
          <select
            id="company-status"
            className="text-input"
            value={values.status}
            onChange={(e) => update('status', e.target.value as CompanyStatus)}
          >
            {(Object.keys(COMPANY_STATUS_LABELS) as CompanyStatus[]).map((s) => (
              <option key={s} value={s}>{COMPANY_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>
      <Input
        label="Annual revenue (USD)"
        type="number"
        value={values.annualRevenue?.toString() ?? ''}
        onChange={(e) => update('annualRevenue', e.target.value ? Number(e.target.value) : undefined)}
        error={errors.annualRevenue}
        placeholder="e.g. 1200000"
        hint="Optional. Helps with revenue forecasting."
      />
      <div className="input-field">
        <label className="field-label" htmlFor="company-description">Description</label>
        <textarea
          id="company-description"
          className="text-input"
          style={{ height: 70, padding: 10, resize: 'vertical' }}
          value={values.description ?? ''}
          onChange={(e) => update('description', e.target.value)}
          placeholder="What does this company do?"
        />
      </div>

      <div className="modal-actions">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" loading={isSubmitting}>
          {initial ? 'Save changes' : 'Add company'}
        </Button>
      </div>
    </form>
  );
}