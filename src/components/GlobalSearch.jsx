import { Search, ArrowRight } from 'lucide-react';
import { StatusBadge } from './ui/StatusBadge.jsx';

export default function GlobalSearch({ showSearch, onClose, globalQuery, setGlobalQuery, searchResults, onSelectCompany }) {
  if (!showSearch) return null;

  return (
    <div className="jcc-modal-overlay" onClick={onClose} style={{ paddingTop:'12vh' }}>
      <div className="jcc-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560, padding: 0, overflow:'hidden' }}>
        <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--hairline)', display:'flex', alignItems:'center', gap: 10 }}>
          <Search size={15} style={{ color:'var(--ink-3)', flexShrink: 0 }}/>
          <input
            autoFocus
            className="jcc-input"
            placeholder="Search companies, notes, locations…"
            value={globalQuery}
            onChange={e => setGlobalQuery(e.target.value)}
            style={{ border:'none', padding: 0, fontSize: 16, minHeight: 0 }}
            aria-label="Global search"
          />
          <span className="jcc-kbd jcc-hide-mobile">ESC</span>
        </div>
        <div className="jcc-scroll" style={{ maxHeight: 'min(50vh, 400px)', overflow:'auto' }}>
          {searchResults.length === 0 ? (
            <div style={{ padding: 36, textAlign:'center', color:'var(--ink-4)', fontSize: 13 }}>
              {globalQuery ? 'No matches.' : 'Start typing to search.'}
            </div>
          ) : searchResults.map(c => (
            <div
              key={c.id}
              className="jcc-search-result"
              onClick={() => onSelectCompany(c.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectCompany(c.id)}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background:'var(--primary-50)',
                            color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center',
                            fontWeight: 600, fontSize: 12, flexShrink: 0 }}>{c.name.slice(0,2).toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 550, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color:'var(--ink-3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.location} · {c.compTier}</div>
              </div>
              <StatusBadge statusId={c.status}/>
              <ArrowRight size={13} style={{ color:'var(--ink-4)', flexShrink: 0 }}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
