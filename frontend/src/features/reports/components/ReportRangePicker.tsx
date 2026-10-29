import { RANGE_LABELS, type ReportRange } from '../types/report.types';

interface ReportRangePickerProps {
  value: ReportRange;
  onChange: (value: ReportRange) => void;
}

export function ReportRangePicker({ value, onChange }: ReportRangePickerProps) {
  return (
    <div style={{
      display: 'inline-flex',
      border: '1px solid #e5e7e0',
      borderRadius: 6,
      overflow: 'hidden',
    }}>
      {(Object.keys(RANGE_LABELS) as ReportRange[]).map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          style={{
            padding: '7px 12px',
            border: 0,
            background: value === r ? '#176451' : '#fff',
            color: value === r ? '#fff' : '#5a655e',
            fontSize: 10,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background .12s',
          }}
        >
          {RANGE_LABELS[r]}
        </button>
      ))}
    </div>
  );
}