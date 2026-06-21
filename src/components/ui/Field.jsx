export function Field({ label, hint, children }) {
  return (
    <label style={{ display:'flex', flexDirection:'column', gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:'.04em' }}>{label}</span>
      {children}
      {hint && <span style={{ fontSize: 11.5, color:'var(--ink-4)' }}>{hint}</span>}
    </label>
  );
}
