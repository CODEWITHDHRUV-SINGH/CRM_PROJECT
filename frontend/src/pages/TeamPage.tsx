import { Users } from 'lucide-react';
import { ModulePlaceholder } from '../components/feedback/ModulePlaceholder';

export default function TeamPage() {
  return (
    <ModulePlaceholder
      title="Team"
      description="Manage users, roles, and permissions."
      icon={<Users size={22} />}
    />
  );
}