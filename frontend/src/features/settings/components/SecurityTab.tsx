import { useEffect, useState } from 'react';
import { Save, ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { useToast } from '../../../components/feedback/Toast';
import { useSecuritySettings } from '../hooks/useSettings';
import type { SecuritySettings } from '../types/settings.types';
import { getErrorMessage } from '../../../api/errorHandler';

export function SecurityTab() {
  const toast = useToast();
  const { data, isLoading, error, update } = useSecuritySettings();
  const [form, setForm] = useState<SecuritySettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setForm(data); }, [data]);

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      await update(form);
      toast.success('Security settings saved');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (error) return <ErrorMessage message={error} />;
  if (isLoading || !form) return <div style={{ padding: 40 }}><Loader label="Loading..." /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 560 }}>
      {/* 2FA Toggle */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: 14,
        border: '1px solid #f0f0ec',
        borderRadius: 8,
        background: '#fff',
        cursor: 'pointer',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldAlert size={13} color="#176451" />
            <strong style={{ fontSize: 12, color: '#2b3831' }}>Two-factor authentication</strong>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 10, color: '#8d968e' }}>
            Require a verification code when signing in from a new device.
          </p>
        </div>
        <input
          type="checkbox"
          checked={form.twoFactorEnabled}
          onChange={(e) => setForm({ ...form, twoFactorEnabled: e.target.checked })}
          style={{ display: 'none' }}
        />
        <span style={{
          position: 'relative',
          display: 'inline-block',
          width: 34,
          height: 20,
          flexShrink: 0,
          borderRadius: 20,
          background: form.twoFactorEnabled ? '#176451' : '#d5d8d2',
          transition: 'background .15s',
        }}>
          <span style={{
            position: 'absolute',
            top: 2,
            left: form.twoFactorEnabled ? 16 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left .15s',
            boxShadow: '0 1px 3px rgba(0,0,0,.15)',
          }} />
        </span>
      </label>

      {/* Session timeout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="input-field">
          <label className="field-label" htmlFor="session-timeout">Session timeout (minutes)</label>
          <select
            id="session-timeout"
            className="text-input"
            value={form.sessionTimeoutMinutes}
            onChange={(e) => setForm({ ...form, sessionTimeoutMinutes: Number(e.target.value) })}
          >
            {[15, 30, 60, 120, 240, 480].map((m) => (
              <option key={m} value={m}>{m} minutes</option>
            ))}
          </select>
          <span className="input-hint">Auto-logout after inactivity.</span>
        </div>

        <div className="input-field">
          <label className="field-label" htmlFor="retention-days">Data retention (days)</label>
          <select
            id="retention-days"
            className="text-input"
            value={form.dataRetentionDays}
            onChange={(e) => setForm({ ...form, dataRetentionDays: Number(e.target.value) })}
          >
            {[30, 90, 180, 365, 730, 1095].map((d) => (
              <option key={d} value={d}>{d} days</option>
            ))}
          </select>
          <span className="input-hint">Old records auto-archive after this period.</span>
        </div>
      </div>

      {/* IP Allowlist */}
      <Input
        label="IP allowlist"
        value={form.ipAllowlist ?? ''}
        onChange={(e) => setForm({ ...form, ipAllowlist: e.target.value })}
        placeholder="192.168.1.0/24, 10.0.0.1"
        hint="Comma-separated. Leave empty to allow all IPs."
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={handleSave} loading={saving} iconLeft={<Save size={14} />}>
          Save security settings
        </Button>
      </div>
    </div>
  );
}