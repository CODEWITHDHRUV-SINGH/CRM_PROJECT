import { Sparkles } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span
        style={{
          display: 'grid',
          width: 30,
          height: 30,
          flexShrink: 0,
          placeItems: 'center',
          borderRadius: 8,
          background: '#f7e6c8',
          color: '#ad7028',
        }}
      >
        <Sparkles size={14} />
      </span>
      <div
        style={{
          padding: '10px 14px',
          background: '#fafaf8',
          border: '1px solid #f0f0ec',
          borderRadius: 12,
          display: 'flex',
          gap: 4,
          alignItems: 'center',
        }}
      >
        <span className="typing-dot" />
        <span className="typing-dot" style={{ animationDelay: '0.15s' }} />
        <span className="typing-dot" style={{ animationDelay: '0.3s' }} />
        <style>{`
          .typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #b0b6af;
            animation: typingBounce 1.2s infinite ease-in-out;
          }
          @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); opacity: .5; }
            30% { transform: translateY(-3px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}