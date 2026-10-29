import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { SalesChart } from '../../../components/charts/SalesChart';
import { LeadSourceChart } from '../../../components/charts/LeadSourceChart';
import { KPICard } from './KPICard';
import { useSalesReport } from '../hooks/useReports';
import type { ReportRange } from '../types/report.types';

export function SalesTab({ range }: { range: ReportRange }) {
  const { data, isLoading, error } = useSalesReport(range);

  if (error) return <ErrorMessage message={error} />;
  if (isLoading || !data) return <div style={{ padding: 60 }}><Loader label="Loading sales report..." /></div>;

  const maxDeals = Math.max(...data.dealsClosedByMonth.map((d) => d.value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <section className="stat-grid">
        {data.kpis.map((kpi) => <KPICard key={kpi.label} data={kpi} />)}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
        <article className="panel" style={{ padding: 18 }}>
          <div className="panel-heading" style={{ marginBottom: 14 }}>
            <div>
              <h2>Revenue trend</h2>
              <p>Monthly revenue over the past year</p>
            </div>
          </div>
          <SalesChart data={data.revenueByMonth} height={200} />
        </article>

        <article className="panel" style={{ padding: 18 }}>
          <div className="panel-heading" style={{ marginBottom: 14 }}>
            <div>
              <h2>Lead sources</h2>
              <p>Where deals are coming from</p>
            </div>
          </div>
          <LeadSourceChart data={data.sources} size={160} />
        </article>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <article className="panel" style={{ padding: 18 }}>
          <div className="panel-heading" style={{ marginBottom: 14 }}>
            <div>
              <h2>Deals closed</h2>
              <p>Monthly closed deals</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, padding: '0 4px' }}>
            {data.dealsClosedByMonth.map((d) => (
              <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                  <div
                    title={`${d.label}: ${d.value}`}
                    style={{
                      width: '100%',
                      height: `${(d.value / maxDeals) * 100}%`,
                      minHeight: 2,
                      background: '#719bb5',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height .4s ease',
                    }}
                  />
                </div>
                <span style={{ fontSize: 9, color: '#9aa09a' }}>{d.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel" style={{ padding: 18 }}>
          <div className="panel-heading" style={{ marginBottom: 14 }}>
            <div>
              <h2>Top deals</h2>
              <p>Highest-value opportunities</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.topDeals.map((deal) => (
              <div key={deal.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 10px',
                background: '#fafaf8',
                borderRadius: 6,
                fontSize: 10,
              }}>
                <div>
                  <strong style={{ display: 'block', color: '#2b3831', fontSize: 11 }}>{deal.company}</strong>
                  <span style={{ color: '#8d968e' }}>{deal.name.replace(`${deal.company} — `, '')}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: '#176451', fontSize: 11 }}>${deal.value.toLocaleString()}</strong>
                  <div style={{ fontSize: 9, color: '#8d968e' }}>{deal.stage}</div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}