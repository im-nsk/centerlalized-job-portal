import { useState, useMemo, useCallback } from 'react';
import { TIERS } from '../data/constants.js';
import { liEmployees, liRecruiters } from '../utils/helpers.js';
import { openSmartCareerSearch } from '../utils/careerSearch.js';
import { openExternalUrl, captureScrollBeforeAction } from '../utils/externalNav.js';
import { mergeCompanyWithActivity } from '../utils/activityLog.js';
import {
  filterCompanies,
  getFilterSummary,
  hasActiveFilters,
  SORT_LABELS,
} from '../utils/companyFilters.js';
import Filters from './Filters.jsx';
import CompanyCard from './CompanyCard.jsx';
import RoleFocusSelector from './RoleFocusSelector.jsx';

export default function CompanyTable({
  state, setState, onOpenCompany, onAddCompany, onToast,
  filters, setFilters, onClearFilters, onOpenFollowUpQueue,
}) {
  const { companies, searchPreferences } = state;
  const [loadingCareerId, setLoadingCareerId] = useState(null);

  const prefs = searchPreferences || { roleFocus: 'data_plus_ai', smartSearchMode: true };

  const setSearchPreferences = useCallback((next) => {
    setState((s) => ({ ...s, searchPreferences: next }));
  }, [setState]);

  const filtered = useMemo(
    () => filterCompanies(companies, filters),
    [companies, filters]
  );

  const grouped = useMemo(() => {
    if (filters.tierFilter !== 'all') {
      return [{ tier: TIERS.find((t) => t.id === filters.tierFilter), items: filtered }];
    }
    return TIERS.map((t) => ({
      tier: t,
      items: filtered.filter((c) => c.tier === t.id),
    })).filter((g) => g.items.length);
  }, [filtered, filters.tierFilter]);

  const filterSummary = getFilterSummary(filters);
  const sortLabel = SORT_LABELS[filters.sortBy] || filters.sortBy;

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
            co.id === c.id ? mergeCompanyWithActivity(co, { roleSearch: meta }) : co
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
          <h1 className="jcc-page-title">
            {filters.followUpQueue ? 'Follow-up queue' : 'Companies'}
          </h1>
          <p className="jcc-page-sub">
            <span className="jcc-num">{filtered.length}</span> of <span className="jcc-num">{companies.length}</span> shown
            {filterSummary.length > 0 && <> · {filterSummary.join(' · ')}</>}
            {' · '}sorted by {sortLabel}
            {prefs.smartSearchMode && ' · Smart Search on'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`jcc-btn ${filters.followUpQueue ? 'jcc-btn-primary' : ''}`}
            onClick={onOpenFollowUpQueue}
          >
            <Bell size={14}/> Follow-up queue
          </button>
          <button type="button" className="jcc-btn jcc-btn-primary" onClick={onAddCompany}>
            <Plus size={14}/> Add company
          </button>
        </div>
      </div>

      <div className="jcc-card" style={{ padding: 14, marginBottom: 18 }}>
        <RoleFocusSelector preferences={prefs} onChange={setSearchPreferences} compact />
      </div>

      <Filters
        filters={filters}
        onChange={setFilters}
        onClear={onClearFilters}
      />

      {grouped.length === 0 ? (
        <div className="jcc-card" style={{ padding: 48, textAlign:'center', color:'var(--ink-3)' }}>
          <Inbox size={28} style={{ color:'var(--ink-4)', marginBottom: 12 }}/>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>No companies match those filters.</div>
          <div style={{ fontSize: 12.5, marginBottom: hasActiveFilters(filters) ? 14 : 0 }}>
            Try clearing filters or searching for something different.
          </div>
          {hasActiveFilters(filters) && (
            <button type="button" className="jcc-btn" onClick={onClearFilters}>
              Clear filters
            </button>
          )}
        </div>
      ) : grouped.map((g) => (
        <div key={g.tier.id} style={{ marginBottom: 28 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: g.tier.accent }}/>
            <h3 style={{ fontSize: 12, fontWeight: 600, color:'var(--ink-2)', letterSpacing:'.04em', textTransform:'uppercase', margin: 0 }}>{g.tier.label}</h3>
            <span className="jcc-num" style={{ fontSize: 12, color:'var(--ink-4)' }}>{g.items.length}</span>
          </div>
          <div className="jcc-company-grid">
            {g.items.map((c) => (
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
