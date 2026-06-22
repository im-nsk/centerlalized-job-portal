import { Search, X } from 'lucide-react';
import { STATUSES, TIERS } from '../data/constants.js';
import { PRIORITY_FILTER_OPTIONS, hasActiveFilters } from '../utils/companyFilters.js';

export default function Filters({
  filters,
  onChange,
  onClear,
}) {
  const {
    query, tierFilter, statusFilter, priorityFilter, sortBy, followUpQueue,
  } = filters;

  const handleStatusChange = (value) => {
    onChange((prev) => ({
      ...prev,
      statusFilter: value,
      statusGroup: value !== 'all' ? null : prev.statusGroup,
      followUpQueue: false,
    }));
  };

  const handleTierChange = (value) => onChange((prev) => ({ ...prev, tierFilter: value }));
  const handlePriorityChange = (value) => onChange((prev) => ({ ...prev, priorityFilter: value }));
  const handleSortChange = (value) => onChange((prev) => ({ ...prev, sortBy: value }));
  const handleQueryChange = (value) => onChange((prev) => ({ ...prev, query: value }));

  const active = hasActiveFilters(filters) || followUpQueue;

  return (
    <div className="jcc-card" style={{ padding: 12, marginBottom: 18 }}>
      <div className="jcc-filters">
        <div className="jcc-filters-search">
          <Search size={14} style={{ position:'absolute', left: 10, top:'50%', transform:'translateY(-50%)', color:'var(--ink-4)', pointerEvents:'none' }}/>
          <input
            className="jcc-input"
            placeholder="Search by name, location, tag, notes…"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            style={{ paddingLeft: 32 }}
            aria-label="Filter companies"
          />
        </div>
        <select className="jcc-input jcc-filters-select" value={tierFilter} onChange={(e) => handleTierChange(e.target.value)} aria-label="Filter by tier">
          <option value="all">All tiers</option>
          {TIERS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <select className="jcc-input jcc-filters-select" value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)} aria-label="Filter by status" disabled={followUpQueue}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select className="jcc-input jcc-filters-select" value={priorityFilter} onChange={(e) => handlePriorityChange(e.target.value)} aria-label="Filter by priority">
          {PRIORITY_FILTER_OPTIONS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <select className="jcc-input jcc-filters-select" value={sortBy} onChange={(e) => handleSortChange(e.target.value)} aria-label="Sort companies" style={{ width: 160 }}>
          <option value="priority">Priority score</option>
          <option value="name">Alphabetical</option>
          <option value="recent">Recently applied</option>
        </select>
        {active && (
          <button type="button" className="jcc-btn jcc-btn-sm" onClick={onClear} aria-label="Clear all filters">
            <X size={13}/> Clear filters
          </button>
        )}
      </div>
      {followUpQueue && (
        <div style={{ marginTop: 10, fontSize: 12, color: '#92400E', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706', flexShrink: 0 }}/>
          Showing follow-up queue — companies with due or overdue follow-ups
        </div>
      )}
    </div>
  );
}
