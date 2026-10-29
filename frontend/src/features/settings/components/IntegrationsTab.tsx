import { Mail, Calendar, MessageCircle, Cloud, Check, Plug } from 'lucide-react';
import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { useToast } from '../../../components/feedback/Toast';
import { useIntegrations } from '../hooks/useSettings';
import { INTEGRATION_META, type IntegrationProvider } from '../types/settings.types';
import { getErrorMessage } from '../../../api/errorHandler';

const ICONS: Record<IntegrationProvider, React.ReactNode> = {
  gmail: <Mail size={18} />,
  'google-calendar': <Calendar size={18} />,
  whatsapp: <MessageCircle size={18} />,
  s3: <Cloud size={18} />,
};

export function IntegrationsTab() {
  const toast = useToast();
  const { data, isLoading, error, refetch, toggle } = useIntegrations();

  async function handleToggle(provider: IntegrationProvider, name: string, connected: boolean) {
    try {
      await toggle(provider);
      toast.success(connected ? `${name} disconnected` : `${name} connected`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  if (error) return <ErrorMessage onRetry={refetch} message={error} />;
  if (isLoading) return <div style={{ padding: 40 }}><Loader label="Loading integrations..." /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data.map((integration) => {
        const meta = INTEGRATION_META[integration.provider];
        return (
          <div
            key={integration.provider}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: 14,
              border: `1px solid ${integration.connected ? '#e0ebdd' : '#e9e9e3'}`,
              borderRadius: 8,
              background: integration.connected ? '#f9fcf8' : '#fff',
            }}
          >
            <span style={{
              display: 'grid',
              width: 40,
              height: 40,
              flexShrink: 0,
              placeItems: 'center',
              borderRadius: 10,
              background: `${meta.color}15`,
              color: meta.color,
            }}>
              {ICONS[integration.provider]}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <strong style={{ fontSize: 12, color: '#2b3831' }}>{integration.name}</strong>
                {integration.connected && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    padding: '2px 6px',
                    borderRadius: 10,
                    background: '#edf5ed',
                    color: '#397a55',
                    fontSize: 8,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    <Check size={8} strokeWidth={3} /> Connected
                  </span>
                )}
              </div>
              <p style={{ margin: '3px 0 0', fontSize: 10, color: '#8d968e' }}>
                {integration.description}
              </p>
              {integration.connected && integration.accountLabel && (
                <p style={{ margin: '3px 0 0', fontSize: 9, color: '#6d7770', fontFamily: 'monospace' }}>
                  {integration.accountLabel}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleToggle(integration.provider, integration.name, integration.connected)}
              style={{
                padding: '6px 12px',
                border: `1px solid ${integration.connected ? '#e5e7e0' : '#176451'}`,
                borderRadius: 5,
                background: integration.connected ? '#fff' : '#176451',
                color: integration.connected ? '#6d7770' : '#fff',
                fontSize: 10,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
              }}
            >
              {!integration.connected && <Plug size={11} />}
              {integration.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        );
      })}
    </div>
  );
}