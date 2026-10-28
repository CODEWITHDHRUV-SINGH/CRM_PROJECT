import { Settings } from 'lucide-react';
import { ModulePlaceholder } from '../components/feedback/ModulePlaceholder';

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      title="Settings"
      description="Configure your workspace, integrations, and preferences."
      icon={<Settings size={22} />}
    />
  );
}