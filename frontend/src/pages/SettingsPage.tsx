import { useState } from 'react';
import { Building2, Plug, Bell, Shield } from 'lucide-react';
import { OrganizationTab } from '../features/settings/components/OrganizationTab';
import { IntegrationsTab } from '../features/settings/components/IntegrationsTab';
import { NotificationsTab } from '../features/settings/components/NotificationsTab';
import { SecurityTab } from '../features/settings/components/SecurityTab';

type SettingsTab = 'organization' | 'integrations' | 'notifications' | 'security';

const TABS: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: 'organization', label: 'Organization', icon: <Building2 size={13} /> },
  { key: 'integrations', label: 'Integrations', icon: <Plug size={13} /> },
  { key: 'notifications', label: 'Notifications', icon: <Bell size={13} /> },
  { key: 'security', label: 'Security', icon: <Shield size={13} /> },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>('organization');

  return (
    <div className="dashboard-content">
      <div className="page-heading-row">
        <div>
          <p className="eyebrow">ADMIN <span className="heading-eyebrow-dot">/</span> Settings</p>
          <h1>Settings</h1>
          <p className="page-subtitle">
            Configure your workspace, integrations, notifications, and security.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, alignItems: 'flex-start' }}>
        {/* Sidebar tabs */}
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: 6,
          border: '1px solid #e9e9e3',
          borderRadius: 8,
          background: '#fff',
        }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 11px',
                border: 0,
                borderRadius: 6,
                background: tab === t.key ? '#edf4ef' : 'transparent',
                color: tab === t.key ? '#176451' : '#5a655e',
                fontSize: 11,
                fontWeight: tab === t.key ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background .12s, color .12s',
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>

        {/* Panel */}
        <section className="panel" style={{ padding: 20 }}>
          {tab === 'organization' && <OrganizationTab />}
          {tab === 'integrations' && <IntegrationsTab />}
          {tab === 'notifications' && <NotificationsTab />}
          {tab === 'security' && <SecurityTab />}
        </section>
      </div>
    </div>
  );
}