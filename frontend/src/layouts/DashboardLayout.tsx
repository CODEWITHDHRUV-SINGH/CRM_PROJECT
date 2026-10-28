import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export interface DashboardOutletContext {
  search: string;
}

export function DashboardLayout() {
  const [search, setSearch] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <main className="dashboard-shell">
      <Sidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
      <section className="dashboard-main">
        <Header
          search={search}
          onSearchChange={setSearch}
          isMobileNavOpen={isMobileNavOpen}
          onToggleNav={() => setIsMobileNavOpen((v) => !v)}
        />
        <Outlet context={{ search } satisfies DashboardOutletContext} />
      </section>
    </main>
  );
}