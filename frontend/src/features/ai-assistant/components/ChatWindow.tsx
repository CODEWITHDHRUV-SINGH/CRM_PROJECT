import { useEffect, useRef, useState } from 'react';
import { Send, RotateCcw, Sparkles } from 'lucide-react';
import { AIMessage } from './AIMessage';
import { TypingIndicator } from './TypingIndicator';
import { AIQuickActions } from './AIQuickActions';
import type { ChatMessage } from '../types/ai.types';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSend: (text: string) => void;
  onReset: () => void;
}

export function ChatWindow({ messages, isLoading, onSend, onReset }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isLoading]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
    inputRef.current?.focus();
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: 480 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0ec',
        background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'grid',
            width: 28,
            height: 28,
            placeItems: 'center',
            borderRadius: 8,
            background: '#f7e6c8',
            color: '#ad7028',
          }}>
            <Sparkles size={14} />
          </span>
          <div>
            <strong style={{ fontSize: 12, color: '#2b3831', display: 'block' }}>CRM Assistant</strong>
            <span style={{ fontSize: 9, color: '#8d968e' }}>Powered by mock AI · Phase 15 will connect a real LLM</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 9px',
            border: '1px solid #e9eae4',
            borderRadius: 5,
            background: '#fff',
            color: '#5a655e',
            fontSize: 10,
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        background: '#fff',
      }}>
        {messages.map((msg) => (
          <AIMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div style={{ borderTop: '1px solid #f0f0ec', background: '#fafaf8', padding: 12 }}>
        <div style={{ marginBottom: 8 }}>
          <AIQuickActions onAction={onSend} disabled={isLoading} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything about your pipeline… (Shift+Enter for new line)"
            rows={2}
            style={{
              flex: 1,
              padding: '9px 12px',
              border: '1px solid #e5e7e0',
              borderRadius: 8,
              fontSize: 11,
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              color: '#3a4640',
              background: '#fff',
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            style={{
              display: 'grid',
              width: 38,
              height: 38,
              placeItems: 'center',
              border: 0,
              borderRadius: 8,
              background: !input.trim() || isLoading ? '#d5d8d2' : '#176451',
              color: '#fff',
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              transition: 'background .15s',
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}