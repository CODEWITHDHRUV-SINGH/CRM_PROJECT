import { Bot } from 'lucide-react';
import { ModulePlaceholder } from '../components/feedback/ModulePlaceholder';

export default function AIChatPage() {
  return (
    <ModulePlaceholder
      title="AI Assistant"
      description="Score leads, summarize activity, and draft emails."
      icon={<Bot size={22} />}
    />
  );
}