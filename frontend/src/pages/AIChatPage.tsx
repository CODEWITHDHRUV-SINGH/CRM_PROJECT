import { useAI } from '../features/ai-assistant/hooks/useAI';
import { ChatWindow } from '../features/ai-assistant/components/ChatWindow';

export default function AIChatPage() {
  const { messages, isLoading, send, reset } = useAI();

  return (
    <div className="dashboard-content" style={{ paddingBottom: 20 }}>
      <div className="page-heading-row" style={{ marginBottom: 14 }}>
        <div>
          <p className="eyebrow">INTELLIGENCE <span className="heading-eyebrow-dot">/</span> AI Assistant</p>
          <h1>AI Assistant</h1>
          <p className="page-subtitle">
            Score leads, draft emails, summarize activity, and get next-best actions.
          </p>
        </div>
      </div>

      <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSend={send}
          onReset={reset}
        />
      </section>
    </div>
  );
}