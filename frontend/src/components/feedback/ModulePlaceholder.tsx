import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function ModulePlaceholder({ title, description, icon }: ModulePlaceholderProps) {
  return (
    <div className="dashboard-content">
      <div className="page-heading-row">
        <div>
          <p className="eyebrow">CRM MODULE</p>
          <h1>{title}</h1>
          <p className="page-subtitle">{description}</p>
        </div>
      </div>
      <div className="module-empty-state" style={{ minHeight: 500 }}>
        <span className="empty-state-icon">{icon ?? <Sparkles size={22} />}</span>
        <p className="eyebrow">COMING SOON</p>
        <h2 style={{ margin: '8px 0', fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500, fontSize: 24 }}>
          {title} workspace
        </h2>
        <p>This module will be fully implemented in Phase 5.</p>
      </div>
    </div>
  );
}