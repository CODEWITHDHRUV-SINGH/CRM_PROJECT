import { NavLink } from 'react-router-dom';
import {
  Activity,
  Building2,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  Receipt,
  Settings,
  Sparkles,
  Target,
  UsersRound,
  Users,
  BarChart3,
  Bot,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface NavSection {
  caption: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    caption: 'WORKSPACE',
    items: [
      { label: 'Overview', path: '/', icon: LayoutDashboard },
      { label: 'Leads', path: '/leads', icon: Target },
      { label: 'Contacts', path: '/contacts', icon: UsersRound },
      { label: 'Companies', path: '/companies', icon: Building2 },
      { label: 'Deals', path: '/deals', icon: CircleDollarSign },
    ],
  },
  {
    caption: 'OPERATIONS',
    items: [
      { label: 'Tasks', path: '/tasks', icon: Activity },
      { label: 'Invoices', path: '/invoices', icon: FileText },
      { label: 'Payments', path: '/payments', icon: Receipt },
    ],
  },
  {
    caption: 'INTELLIGENCE',
    items: [
      { label: 'AI Assistant', path: '/ai', icon: Bot },
      { label: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  },
  {
    caption: 'ADMIN',
    items: [
      { label: 'Team', path: '/team', icon: Users },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Fixed top: brand */}
      <NavLink to="/" className="dashboard-brand" onClick={onClose}>
        <span className="dashboard-brand-mark"><Sparkles size={19} strokeWidth={2.5} /></span>
        <span>universal<span>crm</span></span>
      </NavLink>

      {/* Fixed: workspace switcher */}
      <div className="workspace-switcher">
        <div className="workspace-avatar">
          {user?.organizationName?.charAt(0) ?? 'N'}
        </div>
        <div className="workspace-copy">
          <strong>{user?.organizationName ?? 'Northstar Studio'}</strong>
          <span>Growth workspace</span>
        </div>
      </div>

      {/* ✅ Scrollable middle: nav sections */}
      <div className="sidebar-nav-scroll">
        {sections.map((section) => (
          <div key={section.caption}>
            <p className="nav-caption">{section.caption}</p>
            <nav className="side-nav" aria-label={`${section.caption} navigation`}>
              {section.items.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'nav-item-active' : ''}`
                  }
                  onClick={onClose}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Fixed bottom: promo + profile */}
      <div className="sidebar-bottom">
        <div className="ai-promo">
          <span className="ai-promo-icon"><Sparkles size={16} /></span>
          <strong>Your AI brief is ready</strong>
          <p>3 fresh insights from your pipeline.</p>
        </div>
        <button className="profile-row" type="button" onClick={logout}>
          <span className="profile-avatar">
            {user?.name?.split(' ').map((p) => p[0]).join('').slice(0, 2) ?? 'AM'}
          </span>
          <span className="profile-copy">
            <strong>{user?.name ?? 'Alex Morgan'}</strong>
            <small>{user?.role ?? 'Workspace admin'}</small>
          </span>
        </button>
      </div>
    </aside>
  );
}