import { Search } from 'lucide-react';
import { STATUSES, TIERS } from '../data/constants.js';

export default function Filters({ query, setQuery, tierFilter, setTierFilter, statusFilter, setStatusFilter, sortBy, setSortBy }) {
  return (
    <div className="jcc-card jcc-filters" style={{ padding: 12, marginBottom: 18 }}>
      <div className="jcc-filters-search">
        <Search size={14} style={{ position:'absolute', left: 10, top:'50%', transform:'translateY(-50%)', color:'var(--ink-4)', pointerEvents:'none' }}/>
        <input
          className="jcc-input"
          placeholder="Search by name, location, tag…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ paddingLeft: 32 }}
          aria-label="Filter companies"
        />
      </div>
      <select className="jcc-input jcc-filters-select" value={tierFilter} onChange={e => setTierFilter(e.target.value)} aria-label="Filter by tier">
        <option value="all">All tiers</option>
        {TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
      </select>
      <select className="jcc-input jcc-filters-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} aria-label="Filter by status">
        <option value="all">All statuses</option>
        {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
      <select className="jcc-input jcc-filters-select" value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label="Sort companies" style={{ width: 160 }}>
        <option value="priority">Priority score</option>
        <option value="name">Alphabetical</option>
        <option value="recent">Recently applied</option>
      </select>
    </div>
  );
}
