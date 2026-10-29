import { TrendingUp, Copy, Calendar, ArrowRight, AlertTriangle } from 'lucide-react';
import { useToast } from '../../../components/feedback/Toast';
import type { AIStructuredData } from '../types/ai.types';

interface AIResponseProps {
  structured: AIStructuredData;
}

export function AIResponse({ structured }: AIResponseProps) {
  const toast = useToast();

  async function copyText(text: string, label = 'Copied') {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} to clipboard`);
    } catch {
      toast.error('Could not copy');
    }
  }

  switch (structured.kind) {
    case 'lead-score':
      return <LeadScoreCard data={structured.data} />;
    case 'email-draft':
      return <EmailDraftCard data={structured.data} onCopy={copyText} />;
    case 'summary':
      return <SummaryCard data={structured.data} />;
    case 'next-action':
      return <NextActionCard data={structured.data} />;
    default:
      return null;
  }
}

function LeadScoreCard({ data }: { data: AIStructuredData & { kind: 'lead-score' }['data'] }) {
  const scoreColor = data.score >= 80 ? '#397a55' : data.score >= 60 ? '#aa7531' : '#6d7770';
  const scoreBg = data.score >= 80 ? '#edf5ed' : data.score >= 60 ? '#fbf3e2' : '#f3f3f0';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <strong style={{ fontSize: 12, color: '#2b3831' }}>{data.leadName}</strong>
          <p style={{ margin: '2px 0 0', fontSize: 10, color: '#8d968e' }}>{data.company}</p>
        </div>
        <div style={{
          padding: '8px 14px',
          borderRadius: 10,
          background: scoreBg,
          color: scoreColor,
          fontSize: 20,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <TrendingUp size={16} />
          {data.score}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.factors.map((f) => (
          <div key={f.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 3 }}>
              <span style={{ color: '#5a655e', fontWeight: 600 }}>{f.label}</span>
              <span style={{ color: '#8d968e' }}>{f.value}/100</span>
            </div>
            <div style={{ height: 4, background: '#f0f0ec', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${f.value}%`, background: scoreColor }} />
            </div>
            <p style={{ margin: '3px 0 0', fontSize: 9, color: '#8d968e' }}>{f.note}</p>
          </div>
        ))}
      </div>

      <div style={{
        padding: 10,
        background: '#edf5ed',
        border: '1px solid #d9ead9',
        borderRadius: 6,
        fontSize: 10,
        lineHeight: 1.6,
        color: '#2f5a3f',
      }}>
        <strong style={{ display: 'block', marginBottom: 3 }}>Recommendation</strong>
        {data.recommendation}
      </div>
    </div>
  );
}

function EmailDraftCard({
  data,
  onCopy,
}: {
  data: AIStructuredData & { kind: 'email-draft' }['data'];
  onCopy: (text: string, label?: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 10, color: '#8d968e' }}>
        <div><strong>To:</strong> {data.to}</div>
        <div><strong>Subject:</strong> {data.subject}</div>
      </div>
      <pre style={{
        margin: 0,
        padding: 12,
        background: '#fafaf8',
        border: '1px solid #f0f0ec',
        borderRadius: 6,
        fontSize: 10,
        lineHeight: 1.65,
        color: '#3a4640',
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
      }}>
        {data.body}
      </pre>
      <button
        type="button"
        onClick={() => onCopy(data.body, 'Email body copied')}
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '5px 10px',
          border: '1px solid #e9eae4',
          borderRadius: 5,
          background: '#fff',
          color: '#536f5e',
          fontSize: 10,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <Copy size={12} /> Copy email
      </button>
    </div>
  );
}

function SummaryCard({ data }: { data: AIStructuredData & { kind: 'summary' }['data'] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 10, color: '#8d968e', display: 'flex', alignItems: 'center', gap: 4 }}>
        <Calendar size={11} /> {data.period}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {data.metrics.map((m) => (
          <div key={m.label} style={{
            padding: '8px 10px',
            background: '#fafaf8',
            border: '1px solid #f0f0ec',
            borderRadius: 6,
          }}>
            <p style={{ margin: 0, fontSize: 9, color: '#8d968e', textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.label}</p>
            <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#2b3831' }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div>
        <p style={{ margin: '0 0 6px', fontSize: 9, fontWeight: 700, color: '#8d968e', textTransform: 'uppercase', letterSpacing: 1 }}>
          Highlights
        </p>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {data.highlights.map((h, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 10, color: '#3a4640', lineHeight: 1.5 }}>
              <span style={{ color: '#397a55', marginTop: 1 }}>•</span>
              {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NextActionCard({ data }: { data: AIStructuredData & { kind: 'next-action' }['data'] }) {
  const priorityTone = {
    high: { color: '#bd6948', bg: '#fff1e9' },
    medium: { color: '#aa7531', bg: '#fbf3e2' },
    low: { color: '#6d7770', bg: '#f3f3f0' },
  }[data.priority];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{
        alignSelf: 'flex-start',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 8px',
        borderRadius: 20,
        background: priorityTone.bg,
        color: priorityTone.color,
        fontSize: 9,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}>
        <AlertTriangle size={10} />
        {data.priority} priority
      </span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.actions.map((a, i) => (
          <div key={i} style={{
            padding: 10,
            border: '1px solid #f0f0ec',
            borderRadius: 6,
            background: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <strong style={{ fontSize: 11, color: '#2b3831' }}>{a.title}</strong>
              {a.dueDate && (
                <span style={{ fontSize: 9, color: '#8d968e', whiteSpace: 'nowrap' }}>{a.dueDate}</span>
              )}
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 10, color: '#8d968e', lineHeight: 1.5 }}>{a.description}</p>
            <button
              type="button"
              style={{
                marginTop: 6,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: 0,
                border: 0,
                color: '#176451',
                background: 'transparent',
                fontSize: 10,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Take action <ArrowRight size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}