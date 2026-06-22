import { useState, useMemo, useCallback } from 'react';
import { Plus, Inbox } from 'lucide-react';
import { TIERS } from '../data/constants.js';
import { liEmployees, liRecruiters } from '../utils/helpers.js';
import { openSmartCareerSearch } from '../utils/careerSearch.js';
import { openExternalUrl, captureScrollBeforeAction } from '../utils/externalNav.js';
import Filters from './Filters.jsx';
import CompanyCard from './CompanyCard.jsx';
import RoleFocusSelector from './RoleFocusSelector.jsx';

export default function CompanyTable({
  state, setState, onOpenCompany, onAddCompany, onToast,
}) {
  const { companies, searchPreferences } = state;
  const [query, setQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [loadingCareerId, setLoadingCareerId] = useState(null);

  const prefs = searchPreferences || { roleFocus: 'data_plus_ai', smartSearchMode: true };

  const setSearchPreferences = useCallback((next) => {
    setState((s) => ({ ...s, searchPreferences: next }));
  }, [setState]);

  const filtered = useMemo(() => {
    let r = companies;
    if (tierFilter !== 'all') r = r.filter(c => c.tier === tierFilter);
    if (statusFilter !== 'all') r = r.filter(c => c.status === statusFilter);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(c => c.name.toLowerCase().includes(q) || (c.location||'').toLowerCase().includes(q) || (c.tags||[]).some(t => t.toLowerCase().includes(q)));
    }
    if (sortBy === 'priority') r = [...r].sort((a,b) => b.priorityScore - a.priorityScore);
    if (sortBy === 'name')     r = [...r].sort((a,b) => a.name.localeCompare(b.name));
    if (sortBy === 'recent')   r = [...r].sort((a,b) => (b.appliedDate || '').localeCompare(a.appliedDate || ''));
    return r;
  }, [companies, query, tierFilter, statusFilter, sortBy]);

  const grouped = useMemo(() => {
    if (tierFilter !== 'all') return [{ tier: TIERS.find(t => t.id === tierFilter), items: filtered }];
    return TIERS.map(t => ({ tier: t, items: filtered.filter(c => c.tier === t.id) })).filter(g => g.items.length);
  }, [filtered, tierFilter]);

  const openCareer = async (c) => {
    if (!c.careerUrl) {
      onToast('No career portal URL configured');
      return;
    }
    captureScrollBeforeAction();
    setLoadingCareerId(c.id);
    onToast('Opening smart role search…');
    try {
      const meta = await openSmartCareerSearch(c, prefs);
      if (meta) {
        setState((s) => ({
          ...s,
          companies: s.companies.map((co) =>
            co.id === c.id ? { ...co, roleSearch: meta } : co
          ),
        }));
        const countMsg = meta.matchCount != null
          ? `${meta.matchCount} matching role${meta.matchCount !== 1 ? 's' : ''} found`
          : `${meta.termsSearched} titles searched`;
        onToast(`${countMsg} · ${meta.topRole || 'Multi-role'}`);
      }
    } finally {
      setLoadingCareerId(null);
    }
  };

  return (
    <div className="jcc-fade-in jcc-page">
      <div className="jcc-page-header">
        <div>
          <h1 className="jcc-page-title">Companies</h1>
          <p className="jcc-page-sub">
            <span className="jcc-num">{filtered.length}</span> of <span className="jcc-num">{companies.length}</span> shown · sorted by {sortBy}
            {prefs.smartSearchMode && ' · Smart Search on'}
          </p>
        </div>
        <button type="button" className="jcc-btn jcc-btn-primary" onClick={onAddCompany}>
          <Plus size={14}/> Add company
        </button>
      </div>

      <div className="jcc-card" style={{ padding: 14, marginBottom: 18 }}>
        <RoleFocusSelector preferences={prefs} onChange={setSearchPreferences} compact />
      </div>

      <Filters
        query={query}
        setQuery={setQuery}
        tierFilter={tierFilter}
        setTierFilter={setTierFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {grouped.length === 0 ? (
        <div className="jcc-card" style={{ padding: 48, textAlign:'center', color:'var(--ink-3)' }}>
          <Inbox size={28} style={{ color:'var(--ink-4)', marginBottom: 12 }}/>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>No companies match those filters.</div>
          <div style={{ fontSize: 12.5 }}>Try clearing filters or searching for something different.</div>
        </div>
      ) : grouped.map(g => (
        <div key={g.tier.id} style={{ marginBottom: 28 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: g.tier.accent }}/>
            <h3 style={{ fontSize: 12, fontWeight: 600, color:'var(--ink-2)', letterSpacing:'.04em', textTransform:'uppercase', margin: 0 }}>{g.tier.label}</h3>
            <span className="jcc-num" style={{ fontSize: 12, color:'var(--ink-4)' }}>{g.items.length}</span>
          </div>
          <div className="jcc-company-grid">
            {g.items.map(c => (
              <CompanyCard key={c.id} company={c}
                smartSearchMode={prefs.smartSearchMode}
                searchPreferences={prefs}
                careerLoading={loadingCareerId === c.id}
                onOpen={() => onOpenCompany(c.id)}
                onCareer={() => openCareer(c)}
                onEmployees={() => { openExternalUrl(liEmployees(c.name)); onToast('Opened LinkedIn employee search'); }}
                onRecruiters={() => { openExternalUrl(liRecruiters(c.name)); onToast('Opened LinkedIn recruiter search'); }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
