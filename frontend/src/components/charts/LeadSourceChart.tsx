interface LeadSourceItem {
  label: string;
  value: number;
  color: string;
}

interface LeadSourceChartProps {
  data: LeadSourceItem[];
  size?: number;
}

export function LeadSourceChart({ data, size = 180 }: LeadSourceChartProps) {
  if (!data.length) return <div className="chart-empty">No source data yet</div>;

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f1f2ed"
          strokeWidth={20}
        />
        {data.map((slice) => {
          const dash = (slice.value / total) * circumference;
          const circle = (
            <circle
              key={slice.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={20}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 140 }}>
        {data.map((slice) => (
          <div
            key={slice.label}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#5a655e' }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 3, background: slice.color }} />
            <span style={{ flex: 1 }}>{slice.label}</span>
            <strong style={{ color: '#2b3831' }}>{slice.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}