import { Target } from 'lucide-react';
import { ModulePlaceholder } from '../components/feedback/ModulePlaceholder';

export default function LeadsPage() {
  return (
    <ModulePlaceholder
      title="Leads"
      description="Capture, qualify, and convert your leads into customers."
      icon={<Target size={22} />}
    />
  );
}