import { useCallback, useState } from 'react';
import { aiService } from '../services/aiService';
import type { ChatMessage } from '../types/ai.types';
import { getErrorMessage } from '../../../api/errorHandler';

const uid = () => `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi Alex — I'm your CRM assistant. I can score leads, draft emails, summarize your week, and recommend next actions. What would you like to do?",
  createdAt: new Date().toISOString(),
};

export function useAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((curr) => [...curr, userMsg]);
    setIsLoading(true);

    try {
      const reply = await aiService.sendMessage(trimmed);
      setMessages((curr) => [...curr, reply]);
    } catch (err) {
      setMessages((curr) => [
        ...curr,
        {
          id: uid(),
          role: 'assistant',
          content: `Sorry, something went wrong: ${getErrorMessage(err)}`,
          createdAt: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const reset = useCallback(() => {
    setMessages([welcomeMessage]);
    setIsLoading(false);
  }, []);

  return { messages, isLoading, send, reset };
}