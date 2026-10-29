import { Sparkles, AlertCircle } from 'lucide-react';
import type { ChatMessage } from '../types/ai.types';
import { AIResponse } from './AIResponse';

interface AIMessageProps {
  message: ChatMessage;
}

export function AIMessage({ message }: AIMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        flexDirection: isUser ? 'row-reverse' : 'row',
        maxWidth: '100%',
      }}
    >
      {/* Avatar */}
      <span
        style={{
          display: 'grid',
          width: 30,
          height: 30,
          flexShrink: 0,
          placeItems: 'center',
          borderRadius: 8,
          background: isUser ? '#176451' : message.isError ? '#fdecea' : '#f7e6c8',
          color: isUser ? '#fff' : message.isError ? '#b91c1c' : '#ad7028',
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {isUser ? 'A' : message.isError ? <AlertCircle size={14} /> : <Sparkles size={14} />}
      </span>

      {/* Bubble */}
      <div
        style={{
          maxWidth: 'calc(100% - 42px)',
          padding: '10px 14px',
          borderRadius: 12,
          background: isUser ? '#176451' : message.isError ? '#fdecea' : '#fafaf8',
          border: isUser ? 'none' : `1px solid ${message.isError ? '#f5d9d5' : '#f0f0ec'}`,
          color: isUser ? '#fff' : message.isError ? '#9e3a27' : '#3a4640',
          fontSize: 11,
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
        {message.structured && (
          <div style={{ marginTop: message.content ? 10 : 0 }}>
            <AIResponse structured={message.structured} />
          </div>
        )}
      </div>
    </div>
  );
}