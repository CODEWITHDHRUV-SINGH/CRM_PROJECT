import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { KPIData } from '../types/report.types';

export function KPICard({ data }: { data: KPIData }) {
  const isUp = (data.delta ?? 0) > 0;
  const isFlat = data.delta === 0 || data.delta === undefined;

  return (
    <article className="stat-card">
      <p className="stat-label">{data.label}</p>
      <div className="stat-value-row">
        <strong>{data.value}</strong>
        {!isFlat && (
          <span className={`trend ${isUp ? 'trend-up' : 'trend-down'}`}>
            {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(data.delta ?? 0)}%
          </span>
        )}
      </div>
      {data.footnote && <p className="stat-footnote">{data.footnote}</p>}
    </article>
  );
}