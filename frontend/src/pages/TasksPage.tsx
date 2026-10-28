import { Activity } from 'lucide-react';
import { ModulePlaceholder } from '../components/feedback/ModulePlaceholder';

export default function TasksPage() {
  return (
    <ModulePlaceholder
      title="Tasks"
      description="Manage follow-ups, calls, and meetings."
      icon={<Activity size={22} />}
    />
  );
}