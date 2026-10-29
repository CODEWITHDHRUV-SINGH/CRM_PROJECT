import type { AIActionType, ChatMessage } from '../types/ai.types';

/**
 * MOCK AI SERVICE — Phase 15 me real LLM provider se replace hoga.
 * Public interface (sendMessage) same rahega.
 */

const delay = (ms = 900) => new Promise((r) => setTimeout(r, ms));
const uid = () => `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function detectAction(text: string): AIActionType {
  const lower = text.toLowerCase();
  if (/(score|hot|qualify|leads?)\b/.test(lower) && /(score|hot|qualif)/.test(lower)) return 'lead-score';
  if (/(email|draft|write|reach\s+out|follow[-\s]?up)/.test(lower)) return 'email-draft';
  if (/(summar|recap|week|month|activity)/.test(lower)) return 'summary';
  if (/(next|focus|action|priorit|today|todo)/.test(lower)) return 'next-action';
  return 'text';
}

export const aiService = {
  async sendMessage(userText: string): Promise<ChatMessage> {
    await delay(700 + Math.random() * 600);
    const action = detectAction(userText);

    switch (action) {
      case 'lead-score':
        return {
          id: uid(),
          role: 'assistant',
          content: "Here's the score for your hottest lead right now:",
          structured: {
            kind: 'lead-score',
            data: {
              leadName: 'Demi Wilkinson',
              company: 'Catalog',
              score: 91,
              factors: [
                { label: 'Engagement', value: 95, note: 'Replied within 2 hours to every email.' },
                { label: 'Budget fit', value: 88, note: 'Company revenue aligns with enterprise tier.' },
                { label: 'Authority', value: 92, note: 'Sales Director — confirmed decision-maker.' },
                { label: 'Timeline', value: 78, note: 'Wants to close before Q1 2027.' },
              ],
              recommendation:
                'Schedule a proposal review this week. Demi is highly qualified and warm — expect a 60-70% close probability if you move within the next 5 business days.',
            },
          },
          createdAt: new Date().toISOString(),
        };

      case 'email-draft':
        return {
          id: uid(),
          role: 'assistant',
          content: "Here's a follow-up email draft for your top deal (Quotient — $125,000):",
          structured: {
            kind: 'email-draft',
            data: {
              to: 'phoenix@quotient.co',
              subject: 'Next steps on Quotient expansion — proposal attached',
              body: `Hi Phoenix,\n\nHope you're doing well. Following up on our last conversation about the platform expansion — I've attached the revised proposal with the two-installment plan we discussed.\n\nA few highlights:\n• Enterprise SSO and audit logs included\n• Migration support at no additional cost\n• Go-live target of December 15\n\nWould Thursday at 2 PM work for a 20-minute review?\n\nBest,\nAlex Morgan`,
            },
          },
          createdAt: new Date().toISOString(),
        };

      case 'summary':
        return {
          id: uid(),
          role: 'assistant',
          content: "Here's your activity summary for the past 7 days:",
          structured: {
            kind: 'summary',
            data: {
              period: 'Oct 22 – Oct 29, 2026',
              highlights: [
                'Closed 1 deal worth $96,000 (Bright — Enterprise Seats)',
                'Added 3 new leads (Sam Taylor, Drew Cano, Kate Morrison)',
                'Sent 2 invoices totaling $121,600',
                'Moved 4 deals through pipeline stages',
                'Completed 6 of 11 tasks',
              ],
              metrics: [
                { label: 'Deals closed', value: '1' },
                { label: 'Revenue collected', value: '$96,000' },
                { label: 'New leads', value: '3' },
                { label: 'Conversion rate', value: '24.6%' },
              ],
            },
          },
          createdAt: new Date().toISOString(),
        };

      case 'next-action':
        return {
          id: uid(),
          role: 'assistant',
          content: 'Based on your pipeline, here are the 3 highest-impact actions today:',
          structured: {
            kind: 'next-action',
            data: {
              priority: 'high',
              actions: [
                {
                  title: 'Call Quotient about outstanding $75,000',
                  description: 'Invoice INV-2026-002 is partially paid. Second installment due in 15 days.',
                  dueDate: 'Today',
                },
                {
                  title: 'Send proposal review to Demi Wilkinson (Catalog)',
                  description: 'Hot lead — 91 score. Replying within 5 days is critical for close probability.',
                  dueDate: 'Tomorrow',
                },
                {
                  title: 'Follow up on overdue invoice to Circooles ($12,000)',
                  description: '23 days overdue. Relationship is strong but payment slipping.',
                  dueDate: 'This week',
                },
              ],
            },
          },
          createdAt: new Date().toISOString(),
        };

      default:
        return {
          id: uid(),
          role: 'assistant',
          content:
            "I can help you with lead scoring, drafting emails, weekly summaries, and next-best actions. Try one of the quick prompts below, or ask me anything about your pipeline.",
          createdAt: new Date().toISOString(),
        };
    }
  },
};