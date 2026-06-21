import { ROLE_FOCUS_OPTIONS } from '../data/roles.js';

export default function RoleFocusSelector({ preferences, onChange, compact = false }) {
  const { roleFocus, smartSearchMode } = preferences;

  const setPref = (patch) => onChange({ ...preferences, ...patch });

  return (
    <div style={{ padding: compact ? 0 : '8px 12px 10px' }}>
      {!compact && (
        <div style={{
          fontSize: 10.5, fontWeight: 600, color: 'var(--ink-4)',
          textTransform: 'uppercase', letterSpacing: '.05em',
          padding: '4px 10px 6px',
        }}>
          Role Focus
        </div>
      )}
      <select
        className="jcc-input"
        value={roleFocus}
        onChange={(e) => setPref({ roleFocus: e.target.value })}
        style={{ width: '100%', fontSize: 12.5, marginBottom: 8 }}
        aria-label="Role focus filter"
      >
        {ROLE_FOCUS_OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
      <label style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 12, color: 'var(--ink-2)', cursor: 'pointer',
        padding: compact ? '4px 0' : '4px 10px',
      }}>
        <input
          type="checkbox"
          checked={smartSearchMode}
          onChange={(e) => setPref({ smartSearchMode: e.target.checked })}
          style={{ accentColor: 'var(--primary)' }}
        />
        <span>
          <strong style={{ fontWeight: 550 }}>Smart Search Mode</strong>
          <span style={{ display: 'block', fontSize: 10.5, color: 'var(--ink-4)', marginTop: 2 }}>
            OR-search across core Data / AI / Analytics titles
          </span>
        </span>
      </label>
    </div>
  );
}
