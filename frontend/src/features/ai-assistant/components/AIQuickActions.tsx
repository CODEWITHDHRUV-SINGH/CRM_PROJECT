import { Target, Mail, Sparkles, Zap } from 'lucide-react';
import { QUICK_ACTIONS, type AIActionType } from '../types/ai.types';

interface AIQuickActionsProps {
  onAction: (prompt: string) => void;
  disabled?: boolean;
}

const ICONS: Record<AIActionType, React.ReactNode> = {
  'lead-score': <Target size={13} />,
  'email-draft': <Mail size={13} />,
  summary: <Sparkles size={13} />,
  'next-action': <Zap size={13} />,
  text: <Sparkles size={13} />,
};

export function AIQuickActions({ onAction, disabled }: AIQuickActionsProps) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          disabled={disabled}
          onClick={() => onAction(action.prompt)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            border: '1px solid #e9eae4',
            borderRadius: 20,
            color: '#536f5e',
            background: '#fff',
            fontSize: 10,
            fontWeight: 600,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'background .12s, border-color .12s',
          }}
          onMouseEnter={(e) => {
            if (!disabled) e.currentTarget.style.background = '#f5f7f2';
          }}
          onMouseLeave={(e) => {
            if (!disabled) e.currentTarget.style.background = '#fff';
          }}
        >
          {ICONS[action.id]}
          {action.label}
        </button>
      ))}
    </div>
  );
}