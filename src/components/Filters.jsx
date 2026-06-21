import { Search } from 'lucide-react';
import { STATUSES, TIERS } from '../data/constants.js';

export default function Filters({ query, setQuery, tierFilter, setTierFilter, statusFilter, setStatusFilter, sortBy, setSortBy }) {
  return (
    <div className="jcc-card" style={{ padding: 12, marginBottom: 18, display:'flex', gap: 10, alignItems:'center' }}>
      <div style={{ position:'relative', flex: 1, maxWidth: 320 }}>
        <Search size={14} style={{ position:'absolute', left: 10, top:'50%', transform:'translateY(-50%)', color:'var(--ink-4)' }}/>
        <input className="jcc-input" placeholder="Search by name, location, tag…" value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 32 }}/>
      </div>
      <select className="jcc-input" value={tierFilter} onChange={e => setTierFilter(e.target.value)} style={{ width: 180 }}>
        <option value="all">All tiers</option>
        {TIERS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
      </select>
      <select className="jcc-input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 180 }}>
        <option value="all">All statuses</option>
        {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
      <select className="jcc-input" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 160 }}>
        <option value="priority">Priority score</option>
        <option value="name">Alphabetical</option>
        <option value="recent">Recently applied</option>
      </select>
    </div>
  );
}
