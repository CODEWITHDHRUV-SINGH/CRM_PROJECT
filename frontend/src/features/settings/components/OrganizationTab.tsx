import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { useToast } from '../../../components/feedback/Toast';
import { useOrganization } from '../hooks/useSettings';
import {
  CURRENCIES,
  PLAN_LABELS,
  TIMEZONES,
  type UpdateOrganizationInput,
} from '../types/settings.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function OrganizationTab() {
  const toast = useToast();
  const { data, isLoading, error, refetch, update } = useOrganization();
  const [form, setForm] = useState<UpdateOrganizationInput>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name,
        domain: data.domain ?? '',
        timezone: data.timezone,
        currency: data.currency,
      });
    }
  }, [data]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await update(form);
      toast.success('Organization updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (error) return <ErrorMessage onRetry={refetch} message={error} />;
  if (isLoading || !data) return <div style={{ padding: 40 }}><Loader label="Loading..." /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Plan banner */}
      <div style={{
        padding: 16,
        borderRadius: 10,
        background: 'linear-gradient(135deg, #f7e6c8 0%, #fdf4e0 100%)',
        border: '1px solid #f0e0c4',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#8a6b2c', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            Current plan
          </p>
          <p style={{ margin: '4px 0 0', fontFamily: "'Fraunces', Georgia, serif", fontSize: 22, fontWeight: 500, color: '#5a4a1c' }}>
            {PLAN_LABELS[data.plan]}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 10, color: '#8a6b2c' }}>
            Workspace ID: {data.id} · Created {new Date(data.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
          </p>
        </div>
        <Button variant="secondary" size="sm">Manage billing</Button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560 }}>
        <Input
          label="Organization name"
          requiredMark
          value={form.name ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Acme Corp"
        />
        <Input
          label="Workspace slug"
          value={data.slug}
          disabled
          hint="Slug cannot be changed — used in URLs."
        />
        <Input
          label="Website domain"
          value={form.domain ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
          placeholder="e.g. acme.com"
          hint="Employees with this domain can auto-join when invited."
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="input-field">
            <label className="field-label" htmlFor="org-tz">Timezone</label>
            <select
              id="org-tz"
              className="text-input"
              value={form.timezone ?? data.timezone}
              onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
            >
              {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
          <div className="input-field">
            <label className="field-label" htmlFor="org-currency">Default currency</label>
            <select
              id="org-currency"
              className="text-input"
              value={form.currency ?? data.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
            >
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
          <Button variant="primary" type="submit" loading={saving} iconLeft={<Save size={14} />}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}