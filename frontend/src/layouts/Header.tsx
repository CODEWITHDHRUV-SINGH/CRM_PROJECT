import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Command, Menu, Search, X } from 'lucide-react';
import { useToast } from '../components/feedback/Toast';

const routeLabels: Record<string, string> = {
  '/': 'Overview',
  '/leads': 'Leads',
  '/contacts': 'Contacts',
  '/companies': 'Companies',
  '/deals': 'Deals',
  '/tasks': 'Tasks',
  '/invoices': 'Invoices',
  '/payments': 'Payments',
  '/ai': 'AI Assistant',
  '/reports': 'Reports',
  '/team': 'Team',
  '/settings': 'Settings',
};

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  isMobileNavOpen: boolean;
  onToggleNav: () => void;
}

export function Header({ search, onSearchChange, isMobileNavOpen, onToggleNav }: HeaderProps) {
  const location = useLocation();
  const toast = useToast();

  const currentLabel = useMemo(
    () => routeLabels[location.pathname] ?? 'Workspace',
    [location.pathname],
  );

  return (
    <header className="topbar">
      <button
        className="mobile-menu icon-button"
        type="button"
        aria-label="Toggle menu"
        onClick={onToggleNav}
      >
        {isMobileNavOpen ? <X size={19} /> : <Menu size={19} />}
      </button>

      <div className="breadcrumb">
        <span>Workspace</span>
        <span className="breadcrumb-divider">/</span>
        <strong>{currentLabel}</strong>
      </div>

      <div className="topbar-actions">
        <label className="global-search">
          <Search size={16} />
          <input
            aria-label="Search"
            placeholder="Search anything..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <kbd><Command size={11} /> K</kbd>
        </label>
        <button
          className="icon-button notification-button"
          type="button"
          aria-label="Notifications"
          onClick={() => toast.info('You are all caught up.')}
        >
          <Bell size={18} /><span />
        </button>
      </div>
    </header>
  );
}