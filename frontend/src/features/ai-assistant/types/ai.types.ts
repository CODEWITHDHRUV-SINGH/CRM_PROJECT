export type MessageRole = 'user' | 'assistant';
export type AIActionType = 'lead-score' | 'email-draft' | 'summary' | 'next-action' | 'text';

export interface LeadScoreData {
  leadName: string;
  company: string;
  score: number;
  factors: { label: string; value: number; note: string }[];
  recommendation: string;
}

export interface EmailDraftData {
  to: string;
  subject: string;
  body: string;
}

export interface SummaryData {
  period: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
}

export interface NextActionData {
  priority: 'high' | 'medium' | 'low';
  actions: { title: string; description: string; dueDate?: string }[];
}

export type AIStructuredData =
  | { kind: 'lead-score'; data: LeadScoreData }
  | { kind: 'email-draft'; data: EmailDraftData }
  | { kind: 'summary'; data: SummaryData }
  | { kind: 'next-action'; data: NextActionData };

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  structured?: AIStructuredData;
  createdAt: string;
  isError?: boolean;
}

export const QUICK_ACTIONS: { id: AIActionType; label: string; prompt: string }[] = [
  { id: 'lead-score', label: 'Score my hottest lead', prompt: 'Score my hottest lead and explain why.' },
  { id: 'email-draft', label: 'Draft follow-up email', prompt: 'Draft a follow-up email for my top deal.' },
  { id: 'summary', label: 'Summarize this week', prompt: 'Summarize my activity from the past week.' },
  { id: 'next-action', label: 'What should I do next?', prompt: 'What should I focus on today?' },
];