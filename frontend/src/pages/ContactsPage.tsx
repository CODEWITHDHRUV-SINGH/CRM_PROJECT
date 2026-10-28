import { UsersRound } from 'lucide-react';
import { ModulePlaceholder } from '../components/feedback/ModulePlaceholder';

export default function ContactsPage() {
  return (
    <ModulePlaceholder
      title="Contacts"
      description="Manage people and decision-makers in your network."
      icon={<UsersRound size={22} />}
    />
  );
}