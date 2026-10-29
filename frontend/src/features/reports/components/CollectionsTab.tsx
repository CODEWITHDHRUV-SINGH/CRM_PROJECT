import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { SalesChart } from '../../../components/charts/SalesChart';
import { KPICard } from './KPICard';
import { useCollectionsReport } from '../hooks/useReports';
import type { ReportRange } from '../types/report.types';

export function CollectionsTab({ range }: { range: ReportRange }) {
  const { data, isLoading, error } = useCollectionsReport(range);

  if (error) return <ErrorMessage message={error} />;
  if (isLoading || !data) return <div style={{ padding: 60 }}><Loader label="Loading collections report..." /></div>;

  const maxAging = Math.max(...data.aging.map((a) => a.amount));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <section className="stat-grid">
        {data.kpis.map((kpi) => <KPICard key={kpi.label} data={kpi} />)}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <article className="panel" style={{ padding: 18 }}>
          <div className="panel-heading" style={{ marginBottom: 16 }}>
            <div>
              <h2>Invoice aging</h2>
              <p>Outstanding amounts by age</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.aging.map((bucket) => (
              <div key={bucket.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 4 }}>
                  <span style={{ color: '#5a655e', fontWeight: 600 }}>
                    {bucket.label} <span style={{ color: '#8d968e', fontWeight: 400 }}>({bucket.count})</span>
                  </span>
                  <span style={{ color: bucket.label === '90+ days' ? '#bd6948' : '#2b3831', fontWeight: 700 }}>
                    ${bucket.amount.toLocaleString()}
                  </span>
                </div>
                <div style={{ height: 8, background: '#f1f2ed', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(bucket.amount / maxAging) * 100}%`,
                    background: bucket.color,
                    borderRadius: 4,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel" style={{ padding: 18 }}>
          <div className="panel-heading" style={{ marginBottom: 14 }}>
            <div>
              <h2>Collected by month</h2>
              <p>Cash collected over time</p>
            </div>
          </div>
          <SalesChart data={data.collectedByMonth} height={180} color="#73a985" />
        </article>
      </div>

      <article className="panel" style={{ padding: 18 }}>
        <div className="panel-heading" style={{ marginBottom: 14 }}>
          <div>
            <h2>Top outstanding customers</h2>
            <p>Who owes you money right now</p>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th style={{ textAlign: 'right' }}>Invoiced</th>
                <th style={{ textAlign: 'right' }}>Paid</th>
                <th style={{ textAlign: 'right' }}>Outstanding</th>
                <th style={{ textAlign: 'right' }}>Days</th>
              </tr>
            </thead>
            <tbody>
              {data.topCustomers.map((c) => (
                <tr key={c.customer}>
                  <td><strong style={{ color: '#2b3831', fontSize: 11 }}>{c.customer}</strong></td>
                  <td style={{ textAlign: 'right' }}>${c.total.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', color: '#397a55' }}>${c.paid.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', color: '#bd6948', fontWeight: 600 }}>
                    ${c.outstanding.toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {c.daysOverdue > 0 ? (
                      <span style={{ color: '#bd6948', fontWeight: 700 }}>{c.daysOverdue}d overdue</span>
                    ) : (
                      <span style={{ color: '#8d968e' }}>{Math.abs(c.daysOverdue)}d to due</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}