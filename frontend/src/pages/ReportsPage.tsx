import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useToast } from '../components/feedback/Toast';
import { ReportRangePicker } from '../features/reports/components/ReportRangePicker';
import { SalesTab } from '../features/reports/components/SalesTab';
import { PipelineTab } from '../features/reports/components/PipelineTab';
import { CollectionsTab } from '../features/reports/components/CollectionsTab';
import type { ReportRange } from '../features/reports/types/report.types';

type ReportTab = 'sales' | 'pipeline' | 'collections';

const TABS: { key: ReportTab; label: string }[] = [
  { key: 'sales', label: 'Sales' },
  { key: 'pipeline', label: 'Pipeline' },
  { key: 'collections', label: 'Collections' },
];

export default function ReportsPage() {
  const toast = useToast();
  const [tab, setTab] = useState<ReportTab>('sales');
  const [range, setRange] = useState<ReportRange>('30d');

  function handleExport() {
    toast.info('Export to CSV coming in Phase 14');
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading-row">
        <div>
          <p className="eyebrow">INTELLIGENCE <span className="heading-eyebrow-dot">/</span> Reports</p>
          <h1>Reports</h1>
          <p className="page-subtitle">Deep dive into your sales, pipeline, and collections performance.</p>
        </div>
        <div className="heading-actions">
          <ReportRangePicker value={range} onChange={setRange} />
          <Button variant="secondary" iconLeft={<Download size={14} />} onClick={handleExport}>
            Export
          </Button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: 0,
        borderBottom: '1px solid #e9e9e3',
        marginBottom: 16,
      }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              padding: '10px 16px',
              border: 0,
              borderBottom: tab === t.key ? '2px solid #176451' : '2px solid transparent',
              background: 'transparent',
              color: tab === t.key ? '#176451' : '#7c857e',
              fontSize: 11,
              fontWeight: tab === t.key ? 700 : 500,
              cursor: 'pointer',
              transition: 'color .12s, border-color .12s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'sales' && <SalesTab range={range} />}
      {tab === 'pipeline' && <PipelineTab range={range} />}
      {tab === 'collections' && <CollectionsTab range={range} />}
    </div>
  );
}