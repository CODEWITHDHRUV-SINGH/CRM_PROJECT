import { Building2 } from 'lucide-react';
import { ModulePlaceholder } from '../components/feedback/ModulePlaceholder';

export default function CompaniesPage() {
  return (
    <ModulePlaceholder
      title="Companies"
      description="Track organizations and their relationships."
      icon={<Building2 size={22} />}
    />
  );
}