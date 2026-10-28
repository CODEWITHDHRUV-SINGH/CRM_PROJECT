import { CircleDollarSign } from 'lucide-react';
import { ModulePlaceholder } from '../components/feedback/ModulePlaceholder';

export default function DealsPage() {
  return (
    <ModulePlaceholder
      title="Deals"
      description="Move opportunities through your sales pipeline."
      icon={<CircleDollarSign size={22} />}
    />
  );
}