interface SalesChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function SalesChart({ data, height = 180, color = '#176451' }: SalesChartProps) {
  if (!data.length) return <div className="chart-empty">No sales data yet</div>;

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 10,
        height,
        padding: '10px 4px',
      }}
    >
      {data.map((d) => (
        <div
          key={d.label}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            height: '100%',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              width: '100%',
            }}
          >
            <div
              title={`${d.label}: ${d.value}`}
              style={{
                width: '100%',
                height: `${(d.value / max) * 100}%`,
                minHeight: 2,
                background: color,
                borderRadius: '4px 4px 0 0',
                transition: 'height .4s ease',
              }}
            />
          </div>
          <span style={{ fontSize: 9, color: '#9aa09a' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}