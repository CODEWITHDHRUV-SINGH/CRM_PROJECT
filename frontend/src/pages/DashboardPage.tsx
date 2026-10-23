import { useMemo, useState, type FormEvent } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Command,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Target,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react';

interface DashboardPageProps {
  onLogout: () => void;
}

interface Lead {
  name: string;
  company: string;
  email: string;
  status: 'Qualified' | 'New' | 'Contacted';
  initials: string;
  color: string;
}

const initialLeads: Lead[] = [
  { name: 'Olivia Rhye', company: 'Layers', email: 'olivia@layers.com', status: 'Qualified', initials: 'OR', color: 'coral' },
  { name: 'Phoenix Baker', company: 'Quotient', email: 'phoenix@quotient.co', status: 'New', initials: 'PB', color: 'blue' },
  { name: 'Lana Steiner', company: 'Circooles', email: 'lana@circooles.com', status: 'Contacted', initials: 'LS', color: 'green' },
  { name: 'Demi Wilkinson', company: 'Catalog', email: 'demi@catalog.com', status: 'Qualified', initials: 'DW', color: 'yellow' },
];

const navigation: { label: string; icon: LucideIcon }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Leads', icon: Target },
  { label: 'Contacts', icon: UsersRound },
  { label: 'Companies', icon: Building2 },
  { label: 'Deals', icon: CircleDollarSign },
  { label: 'Activities', icon: Activity },
];

const stages = [
  { label: 'New leads', value: 128, width: '92%', color: 'stage-orange' },
  { label: 'Contacted', value: 86, width: '70%', color: 'stage-yellow' },
  { label: 'Qualified', value: 54, width: '48%', color: 'stage-green' },
  { label: 'Proposal', value: 31, width: '34%', color: 'stage-blue' },
  { label: 'Won', value: 18, width: '23%', color: 'stage-ink' },
];

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [activeNav, setActiveNav] = useState('Overview');
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState('');
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const visibleLeads = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return leads;
    return leads.filter((lead) =>
      `${lead.name} ${lead.company} ${lead.email}`.toLowerCase().includes(normalizedSearch),
    );
  }, [leads, search]);

  function createLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name')).trim();
    const company = String(formData.get('company')).trim();
    const email = String(formData.get('email')).trim();
    const initials = name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

    setLeads((currentLeads) => [
      { name, company, email, status: 'New', initials, color: 'purple' },
      ...currentLeads,
    ]);
    setIsLeadModalOpen(false);
    setNotice(`${name} was added to your leads.`);
    window.setTimeout(() => setNotice(''), 3200);
  }

  const today = new Intl.DateTimeFormat('en', {
    weekday: 'short', month: 'short', day: 'numeric',
  }).format(new Date());

  return (
    <main className="dashboard-shell">
      <aside className={`sidebar ${isMobileNavOpen ? 'sidebar-open' : ''}`}>
        <a className="dashboard-brand" href="#overview" onClick={() => setActiveNav('Overview')}>
          <span className="dashboard-brand-mark"><Sparkles size={19} strokeWidth={2.5} /></span>
          <span>universal<span>crm</span></span>
        </a>

        <div className="workspace-switcher">
          <div className="workspace-avatar">N</div>
          <div className="workspace-copy"><strong>Northstar Studio</strong><span>Growth workspace</span></div>
          <ChevronDown size={15} />
        </div>

        <p className="nav-caption">WORKSPACE</p>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              className={`nav-item ${activeNav === label ? 'nav-item-active' : ''}`}
              key={label}
              type="button"
              onClick={() => { setActiveNav(label); setIsMobileNavOpen(false); }}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {label === 'Leads' && <span className="nav-count">12</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="ai-promo">
            <span className="ai-promo-icon"><Sparkles size={16} /></span>
            <strong>Your AI brief is ready</strong>
            <p>3 fresh insights from your pipeline.</p>
            <button type="button" onClick={() => setNotice('AI assistant is being set up.')}>View insights <ArrowRight size={14} /></button>
          </div>
          <button className="profile-row" type="button" onClick={onLogout}>
            <span className="profile-avatar">AM</span>
            <span className="profile-copy"><strong>Alex Morgan</strong><small>Workspace admin</small></span>
            <LogOut size={16} aria-label="Log out" />
          </button>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="topbar">
          <button className="mobile-menu icon-button" type="button" aria-label="Open menu" onClick={() => setIsMobileNavOpen((open) => !open)}>
            {isMobileNavOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-divider">/</span><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <label className="global-search">
              <Search size={16} />
              <input aria-label="Search leads" placeholder="Search anything..." value={search} onChange={(event) => setSearch(event.target.value)} />
              <kbd><Command size={11} /> K</kbd>
            </label>
            <button className="icon-button notification-button" type="button" aria-label="Notifications" onClick={() => setNotice('You are all caught up.') }>
              <Bell size={18} /><span />
            </button>
            <button className="topbar-avatar" type="button" aria-label="Log out" onClick={onLogout}>AM</button>
          </div>
        </header>

        {activeNav === 'Overview' ? (
          <div className="dashboard-content">
            <div className="page-heading-row">
              <div>
                <p className="eyebrow">{today} <span className="heading-eyebrow-dot">/</span> Your workspace</p>
                <h1>Good morning, Alex <span className="wave">✳</span></h1>
                <p className="page-subtitle">Here’s the pulse of your business today.</p>
              </div>
              <div className="heading-actions">
                <button className="secondary-button" type="button"><CalendarDays size={16} /> Last 30 days <ChevronDown size={14} /></button>
                <button className="primary-button" type="button" onClick={() => setIsLeadModalOpen(true)}><Plus size={17} /> Add lead</button>
              </div>
            </div>

            <section className="stat-grid" aria-label="Business overview">
              <article className="stat-card">
                <div className="stat-card-top"><span className="stat-icon stat-icon-orange"><UsersRound size={18} /></span><button className="more-button" aria-label="More lead options" type="button"><MoreHorizontal size={19} /></button></div>
                <p className="stat-label">Total leads</p><div className="stat-value-row"><strong>1,284</strong><span className="trend trend-up"><ArrowUpRight size={14} /> 12.8%</span></div><p className="stat-footnote">vs. previous 30 days</p>
              </article>
              <article className="stat-card">
                <div className="stat-card-top"><span className="stat-icon stat-icon-green"><Target size={18} /></span><button className="more-button" aria-label="More deal options" type="button"><MoreHorizontal size={19} /></button></div>
                <p className="stat-label">Open opportunities</p><div className="stat-value-row"><strong>৳ 8.42M</strong><span className="trend trend-up"><ArrowUpRight size={14} /> 8.2%</span></div><p className="stat-footnote">across 46 active deals</p>
              </article>
              <article className="stat-card">
                <div className="stat-card-top"><span className="stat-icon stat-icon-blue"><CircleDollarSign size={18} /></span><button className="more-button" aria-label="More revenue options" type="button"><MoreHorizontal size={19} /></button></div>
                <p className="stat-label">Revenue this month</p><div className="stat-value-row"><strong>৳ 2.16M</strong><span className="trend trend-up"><ArrowUpRight size={14} /> 18.4%</span></div><p className="stat-footnote">৳ 340K above your target</p>
              </article>
              <article className="stat-card">
                <div className="stat-card-top"><span className="stat-icon stat-icon-lilac"><Activity size={18} /></span><button className="more-button" aria-label="More conversion options" type="button"><MoreHorizontal size={19} /></button></div>
                <p className="stat-label">Conversion rate</p><div className="stat-value-row"><strong>24.6%</strong><span className="trend trend-down"><ArrowDownRight size={14} /> 2.1%</span></div><p className="stat-footnote">lead to customer conversion</p>
              </article>
            </section>

            <section className="dashboard-middle-grid">
              <article className="panel pipeline-panel">
                <div className="panel-heading"><div><h2>Pipeline overview</h2><p>Deals moving through your sales stages</p></div><button className="subtle-select" type="button">This quarter <ChevronDown size={14} /></button></div>
                <div className="pipeline-summary"><strong>৳ 8,420,000</strong><span className="trend trend-up"><ArrowUpRight size={14} /> 14.6%</span><span className="summary-caption">weighted pipeline value</span></div>
                <div className="pipeline-chart" aria-label="Deal counts by pipeline stage">
                  {stages.map((stage) => (
                    <div className="pipeline-row" key={stage.label}>
                      <span className="pipeline-stage-label">{stage.label}</span>
                      <div className="pipeline-track"><div className={`pipeline-fill ${stage.color}`} style={{ width: stage.width }} /></div>
                      <strong>{stage.value}</strong>
                    </div>
                  ))}
                </div>
                <div className="pipeline-footer"><span><i className="legend-dot legend-orange" /> 317 total deals</span><button type="button" onClick={() => setActiveNav('Deals')}>View pipeline <ArrowRight size={14} /></button></div>
              </article>

              <article className="panel activity-panel">
                <div className="panel-heading"><div><h2>Today’s focus</h2><p>A few things worth your attention</p></div><button className="icon-button panel-more" type="button" aria-label="More activity options"><MoreHorizontal size={19} /></button></div>
                <div className="focus-list">
                  <div className="focus-item"><span className="focus-icon focus-icon-peach"><CalendarDays size={16} /></span><div><strong>4 follow-ups due</strong><p>Start with your priority leads</p></div><span className="focus-count">4</span></div>
                  <div className="focus-item"><span className="focus-icon focus-icon-mint"><Check size={16} /></span><div><strong>2 deals need attention</strong><p>No activity in the last 7 days</p></div><span className="focus-count">2</span></div>
                  <div className="focus-item"><span className="focus-icon focus-icon-sky"><Sparkles size={16} /></span><div><strong>AI found 3 insights</strong><p>New signals in your pipeline</p></div><ArrowRight className="focus-arrow" size={16} /></div>
                </div>
                <button className="focus-footer" type="button" onClick={() => setActiveNav('Activities')}>Open activity center <ArrowRight size={14} /></button>
              </article>
            </section>

            <section className="panel leads-panel">
              <div className="panel-heading leads-panel-heading"><div><h2>Recently added leads</h2><p>Keep the conversation moving</p></div><div className="leads-panel-actions"><span className="lead-total">{leads.length} leads</span><button className="table-filter-button" type="button"><span className="filter-dot" /> All leads <ChevronDown size={14} /></button><button className="text-button" type="button" onClick={() => setActiveNav('Leads')}>View all <ArrowRight size={14} /></button></div></div>
              <div className="leads-table-wrap">
                <table className="leads-table">
                  <thead><tr><th>LEAD NAME</th><th>COMPANY</th><th>STATUS</th><th>EMAIL</th><th aria-label="Actions" /></tr></thead>
                  <tbody>
                    {visibleLeads.map((lead) => (
                      <tr key={`${lead.email}-${lead.name}`}>
                        <td><div className="lead-person"><span className={`lead-avatar avatar-${lead.color}`}>{lead.initials}</span><strong>{lead.name}</strong></div></td>
                        <td><span className="company-name">{lead.company}</span></td>
                        <td><span className={`status-pill status-${lead.status.toLowerCase()}`}><i />{lead.status}</span></td>
                        <td className="lead-email">{lead.email}</td>
                        <td><button className="row-more" type="button" aria-label={`More options for ${lead.name}`}><MoreHorizontal size={18} /></button></td>
                      </tr>
                    ))}
                    {visibleLeads.length === 0 && <tr><td className="empty-search" colSpan={5}>No leads match “{search}”.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="table-footer"><span>Showing <strong>{visibleLeads.length}</strong> of <strong>{leads.length}</strong> leads</span><button type="button" onClick={() => setActiveNav('Leads')}>Go to leads <ArrowRight size={14} /></button></div>
            </section>
          </div>
        ) : (
          <div className="module-empty-state">
            <span className="empty-state-icon"><Sparkles size={22} /></span>
            <p className="eyebrow">WORKSPACE MODULE</p>
            <h1>{activeNav}</h1>
            <p>This workspace is ready for your {activeNav.toLowerCase()} workflow.</p>
            <button className="primary-button" type="button" onClick={() => setActiveNav('Overview')}><ArrowRight size={16} /> Back to overview</button>
          </div>
        )}
      </section>

      {isLeadModalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsLeadModalOpen(false); }}>
          <section className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="add-lead-title">
            <div className="modal-heading"><div><p className="eyebrow">NEW CONTACT</p><h2 id="add-lead-title">Add a lead</h2></div><button className="icon-button" type="button" aria-label="Close dialog" onClick={() => setIsLeadModalOpen(false)}><X size={18} /></button></div>
            <p className="modal-description">Add someone new to your pipeline. You can fill in the rest later.</p>
            <form className="lead-form" onSubmit={createLead}>
              <label htmlFor="lead-name">Full name</label><input id="lead-name" name="name" placeholder="e.g. Sam Taylor" required autoFocus />
              <label htmlFor="lead-company">Company</label><input id="lead-company" name="company" placeholder="Company name" required />
              <label htmlFor="lead-email">Work email</label><input id="lead-email" name="email" type="email" placeholder="sam@company.com" required />
              <div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setIsLeadModalOpen(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={16} /> Add lead</button></div>
            </form>
          </section>
        </div>
      )}

      {notice && <div className="toast-message" role="status"><Check size={16} />{notice}</div>}
    </main>
  );
}