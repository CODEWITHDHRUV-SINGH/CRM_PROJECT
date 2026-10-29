import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { useToast } from '../../../components/feedback/Toast';
import { useNotificationPreferences } from '../hooks/useSettings';
import type { NotificationPreferences } from '../types/settings.types';
import { getErrorMessage } from '../../../api/errorHandler';

const TOGGLES: { key: keyof NotificationPreferences; label: string; description: string; group: string }[] = [
  { key: 'emailOnNewLead', label: 'New lead assigned', description: 'Get an email whenever a new lead is assigned to you.', group: 'Deal activity' },
  { key: 'emailOnDealWon', label: 'Deal won', description: 'Celebrate every closed-won deal in your inbox.', group: 'Deal activity' },
  { key: 'emailOnDealLost', label: 'Deal lost', description: 'Notify when a deal is closed as lost.', group: 'Deal activity' },
  { key: 'emailOnInvoicePaid', label: 'Invoice paid', description: 'Get notified when a customer pays an invoice.', group: 'Billing' },
  { key: 'dailyDigest', label: 'Daily digest', description: 'Morning summary of tasks, follow-ups, and pipeline.', group: 'Digests' },
  { key: 'weeklyReport', label: 'Weekly report', description: 'Monday performance report across sales and collections.', group: 'Digests' },
  { key: 'whatsappAlerts', label: 'WhatsApp alerts', description: 'Real-time alerts on WhatsApp (requires integration).', group: 'Channels' },
];

export function NotificationsTab() {
  const toast = useToast();
  const { data, isLoading, error, update } = useNotificationPreferences();
  const [form, setForm] = useState<NotificationPreferences | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setForm(data); }, [data]);

  function toggle(key: keyof NotificationPreferences) {
    setForm((f) => (f ? { ...f, [key]: !f[key] } : f));
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      await update(form);
      toast.success('Notification preferences saved');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (error) return <ErrorMessage message={error} />;
  if (isLoading || !form) return <div style={{ padding: 40 }}><Loader label="Loading..." /></div>;

  const groups = Array.from(new Set(TOGGLES.map((t) => t.group)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
      {groups.map((group) => (
        <div key={group}>
          <p style={{ margin: '0 0 10px', fontSize: 10, fontWeight: 700, color: '#a0a69f', textTransform: 'uppercase', letterSpacing: 1 }}>
            {group}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {TOGGLES.filter((t) => t.group === group).map((toggleMeta) => {
              const isOn = form[toggleMeta.key] as boolean;
              return (
                <label
                  key={toggleMeta.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '10px 12px',
                    border: '1px solid #f0f0ec',
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: '#fff',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', fontSize: 11, color: '#2b3831' }}>{toggleMeta.label}</strong>
                    <span style={{ fontSize: 10, color: '#8d968e' }}>{toggleMeta.description}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isOn}
                    onChange={() => toggle(toggleMeta.key)}
                    style={{ display: 'none' }}
                  />
                  <span
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: 34,
                      height: 20,
                      flexShrink: 0,
                      borderRadius: 20,
                      background: isOn ? '#176451' : '#d5d8d2',
                      transition: 'background .15s',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 2,
                        left: isOn ? 16 : 2,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: '#fff',
                        transition: 'left .15s',
                        boxShadow: '0 1px 3px rgba(0,0,0,.15)',
                      }}
                    />
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" onClick={handleSave} loading={saving} iconLeft={<Save size={14} />}>
          Save preferences
        </Button>
      </div>
    </div>
  );
}