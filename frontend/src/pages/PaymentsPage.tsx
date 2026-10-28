import { Receipt } from 'lucide-react';
import { ModulePlaceholder } from '../components/feedback/ModulePlaceholder';

export default function PaymentsPage() {
  return (
    <ModulePlaceholder
      title="Payments"
      description="Record payments and manage refunds."
      icon={<Receipt size={22} />}
    />
  );
}