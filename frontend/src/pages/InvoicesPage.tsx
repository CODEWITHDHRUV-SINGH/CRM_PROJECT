import { FileText } from 'lucide-react';
import { ModulePlaceholder } from '../components/feedback/ModulePlaceholder';

export default function InvoicesPage() {
  return (
    <ModulePlaceholder
      title="Invoices"
      description="Generate and track invoices for your customers."
      icon={<FileText size={22} />}
    />
  );
}