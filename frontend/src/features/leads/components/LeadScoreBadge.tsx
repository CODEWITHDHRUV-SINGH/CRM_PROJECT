interface LeadScoreBadgeProps {
  score: number;
}

export function LeadScoreBadge({ score }: LeadScoreBadgeProps) {
  const tone =
    score >= 80 ? { bg: '#edf5ed', fg: '#397a55', label: 'Hot' } :
    score >= 60 ? { bg: '#fbf3e2', fg: '#aa7531', label: 'Warm' } :
    { bg: '#f3f3f0', fg: '#6d7770', label: 'Cold' };

  return (
    <span
      title={`Score ${score}/100 — ${tone.label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 8px',
        borderRadius: 20,
        background: tone.bg,
        color: tone.fg,
        fontSize: 10,
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: tone.fg }} />
      {score}
    </span>
  );
}