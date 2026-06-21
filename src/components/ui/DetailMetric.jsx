export function DetailMetric({ label, value, hint, accent }) {
  return (
    <div style={{ background:'var(--surface-2)', borderRadius: 10, padding: 12, border:'1px solid var(--hairline)' }}>
      <div style={{ fontSize: 10.5, fontWeight: 600, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.05em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: accent || 'var(--ink)', display:'flex', alignItems:'center', gap: 6 }}>{value}</div>
      {hint && <div style={{ fontSize: 11, color:'var(--ink-4)', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}
