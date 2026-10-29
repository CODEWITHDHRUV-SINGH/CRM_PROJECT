import { Loader } from '../../../components/common/Loader';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { KPICard } from './KPICard';
import { usePipelineReport } from '../hooks/useReports';
import type { ReportRange } from '../types/report.types';

export function PipelineTab({ range }: { range: ReportRange }) {
  const { data, isLoading, error } = usePipelineReport(range);

  if (error) return <ErrorMessage message={error} />;
  if (isLoading || !data) {
    return (
      <div style={{ padding: 60 }}>
        <Loader label="Loading pipeline report..." />
      </div>
    );
  }

  const maxStageValue = Math.max(...data.byStage.map((s) => s.value));
  const maxForecast = Math.max(...data.forecast.map((f) => f.value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <section className="stat-grid">
        {data.kpis.map((kpi) => <KPICard key={kpi.label} data={kpi} />)}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <article className="panel" style={{ padding: 18 }}>
          <div className="panel-heading" style={{ marginBottom: 16 }}>
            <div>
              <h2>Conversion funnel</h2>
              <p>How leads progress through stages</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.funnel.map((stage, i) => {
              const width = Math.max((stage.count / data.funnel[0].count) * 100, 20);
              return (
                <div key={stage.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 4 }}>
                    <span style={{ color: '#5a655e', fontWeight: 600 }}>{stage.label}</span>
                    <span style={{ color: '#8d968e' }}>
                      {stage.count} · {stage.conversion}%
                    </span>
                  </div>
                  <div style={{ height: 20, background: '#f1f2ed', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${width}%`,
                      background: `hsl(${160 - i * 12}, 45%, ${55 - i * 3}%)`,
                      borderRadius: 4,
                      transition: 'width .4s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="panel" style={{ padding: 18 }}>
          <div className="panel-heading" style={{ marginBottom: 16 }}>
            <div>
              <h2>Pipeline by stage</h2>
              <p>Deal value distribution</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.byStage.map((stage) => (
              <div key={stage.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 4 }}>
                  <span style={{ color: '#5a655e', fontWeight: 600 }}>
                    {stage.label} <span style={{ color: '#8d968e', fontWeight: 400 }}>({stage.count})</span>
                  </span>
                  <span style={{ color: '#2b3831', fontWeight: 600 }}>
                    ${(stage.value / 1000).toFixed(0)}k
                  </span>
                </div>
                <div style={{ height: 6, background: '#f1f2ed', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${(stage.value / maxStageValue) * 100}%`,
                    background: stage.color,
                    borderRadius: 3,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="panel" style={{ padding: 18 }}>
        <div className="panel-heading" style={{ marginBottom: 16 }}>
          <div>
            <h2>Revenue forecast</h2>
            <p>Projected pipeline value for coming periods</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {data.forecast.map((item) => (
            <div key={item.label} style={{
              padding: 14,
              background: '#fafaf8',
              borderRadius: 8,
              borderLeft: `3px solid ${item.color}`,
            }}>
              <p style={{ margin: 0, fontSize: 10, color: '#8d968e', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {item.label}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 700, color: '#2b3831' }}>
                ${(item.value / 1000).toFixed(0)}k
              </p>
              <div style={{ marginTop: 8, height: 4, background: '#e9e9e3', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(item.value / maxForecast) * 100}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}