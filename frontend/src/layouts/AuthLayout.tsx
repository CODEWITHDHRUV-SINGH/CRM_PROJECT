import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="login-shell">
      <section className="login-brand-panel" aria-label="Universal CRM">
        <div className="brand-orbit brand-orbit-one" />
        <div className="brand-orbit brand-orbit-two" />
        <div className="brand-panel-content">
          <div className="brand-lockup">
            <span className="brand-mark"><Sparkles size={23} strokeWidth={2.5} /></span>
            <span>universal<span className="brand-lockup-light">crm</span></span>
          </div>
          <div className="brand-welcome">
            <p className="eyebrow eyebrow-light">One clear view of your business</p>
            <h1>Good relationships<br />move everything.</h1>
            <p className="brand-description">
              Bring your people, pipeline, and next big opportunity into focus.
            </p>
          </div>
          <div className="brand-footnote">
            <span className="brand-footnote-dot" /> Built for the way your team works
          </div>
        </div>
        <div className="brand-scallop" aria-hidden="true" />
      </section>

      <section className="login-form-panel">
        <div className="login-form-wrap">
          <div className="mobile-brand-lockup">
            <span className="brand-mark"><Sparkles size={20} strokeWidth={2.5} /></span>
            <span>universal<span className="brand-lockup-light">crm</span></span>
          </div>
          {children}
        </div>
        <footer className="login-footer">© 2026 Universal CRM <span>·</span> A better view of what matters</footer>
      </section>
    </main>
  );
}