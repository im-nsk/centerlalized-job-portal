import { Briefcase, Clock, Sparkles } from 'lucide-react';
import { getActiveSearchRoles } from '../data/roles.js';
import { formatLastChecked, formatRoleSearchSummary } from '../utils/careerSearch.js';
import { Pill } from './ui/Pill.jsx';

export default function RoleSearchStats({ roleSearch, smartSearchMode, preferences, compact = false }) {
  const rs = roleSearch || {};
  const configuredTerms = preferences
    ? getActiveSearchRoles(preferences.roleFocus, preferences.smartSearchMode).length
    : rs.termsSearched;
  const displayRs = rs.lastCheckedAt ? rs : { ...rs, termsSearched: configuredTerms };
  const summary = formatRoleSearchSummary(displayRs, smartSearchMode);
  const checked = formatLastChecked(rs.lastCheckedAt);

  if (compact && !rs.lastCheckedAt && !preferences) return null;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 4,
      marginBottom: compact ? 8 : 10,
      padding: compact ? '8px 10px' : '10px 12px',
      background: 'var(--surface-3)', borderRadius: 8,
      border: '1px solid var(--hairline-2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)' }}>
          {smartSearchMode ? <Sparkles size={11} style={{ color: 'var(--secondary)' }}/> : <Briefcase size={11}/>}
          {summary}
        </div>
        {rs.topRole && (
          <Pill color="var(--secondary)" bg="var(--secondary-50)">{rs.topRole}</Pill>
        )}
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-4)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <Clock size={10}/>
        {checked}
        {rs.termsSearched > 0 && rs.lastCheckedAt && rs.matchCount == null && (
          <span> · {rs.termsSearched} titles searched</span>
        )}
        {!rs.lastCheckedAt && configuredTerms > 0 && (
          <span> · {configuredTerms} titles configured</span>
        )}
      </div>
    </div>
  );
}
