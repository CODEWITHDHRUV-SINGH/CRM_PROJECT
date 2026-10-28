import { BarChart3 } from 'lucide-react';
import { ModulePlaceholder } from '../components/feedback/ModulePlaceholder';

export default function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Reports"
      description="Analyze sales, pipeline, and collections."
      icon={<BarChart3 size={22} />}
    />
  );
}