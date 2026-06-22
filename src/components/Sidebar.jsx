import {
  LayoutDashboard, Building2, KanbanSquare, GraduationCap, MessageSquareText,
  Settings as SettingsIcon, Search, Bell, Zap, X,
} from 'lucide-react';
import { cls } from '../utils/helpers.js';
import RoleFocusSelector from './RoleFocusSelector.jsx';
import SyncStatusIndicator from './SyncStatusIndicator.jsx';

function NavItem({ id, icon: Icon, label, count, tab, setTab, onNavigate }) {
  const handleClick = () => {
    setTab(id);
    onNavigate?.();
  };
  return (
    <div className={cls('jcc-sidebar-item', tab === id && 'active')} onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
      <Icon size={15}/>
      <span style={{ flex: 1 }}>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="jcc-num" style={{ fontSize: 11, color: tab === id ? 'var(--primary)' : 'var(--ink-4)' }}>{count}</span>
      )}
    </div>
  );
}

export default function Sidebar({
  tab, setTab, state, setState, followupsDue, interviewsActive, onShowSearch,
  onOpenFollowUpQueue, mobileOpen, onCloseMobile, syncStatus, lastSavedAt,
}) {
  const prefs = state.searchPreferences || { roleFocus: 'data_plus_ai', smartSearchMode: true };

  const setSearchPreferences = (next) => {
    setState((s) => ({ ...s, searchPreferences: next }));
  };

  return (
    <aside className={cls('jcc-sidebar', mobileOpen && 'jcc-sidebar--open')} aria-label="Main navigation">
      <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid var(--hairline)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>
            <Zap size={14} color="white" strokeWidth={2.5}/>
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing:'-0.01em' }}>Command Center</div>
            <div style={{ fontSize: 10.5, color:'var(--ink-4)', letterSpacing:'.04em', textTransform:'uppercase' }}>Job Search</div>
          </div>
        </div>
        <button
          type="button"
          className={cls('jcc-btn jcc-btn-ghost jcc-btn-sm', mobileOpen && 'jcc-show-mobile')}
          onClick={onCloseMobile}
          aria-label="Close menu"
        >
          <X size={16}/>
        </button>
      </div>

      <div style={{ padding:'12px 12px 4px' }}>
        <button type="button" className="jcc-search-trigger" onClick={onShowSearch}>
          <Search size={13}/>
          <span style={{ flex: 1, textAlign:'left' }}>Search companies…</span>
          <span className="jcc-kbd jcc-hide-mobile">⌘K</span>
        </button>
      </div>

      <nav style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap: 1, flex: 1, overflowY: 'auto' }}>
        <NavItem id="dashboard"  icon={LayoutDashboard}  label="Dashboard" tab={tab} setTab={setTab} onNavigate={onCloseMobile}/>
        <NavItem id="companies"  icon={Building2}        label="Companies"  count={state.companies.length} tab={tab} setTab={setTab} onNavigate={onCloseMobile}/>
        <NavItem id="pipeline"   icon={KanbanSquare}     label="Pipeline"   count={interviewsActive} tab={tab} setTab={setTab} onNavigate={onCloseMobile}/>
        <NavItem id="prep"       icon={GraduationCap}    label="Prep"       count={state.starStories.length} tab={tab} setTab={setTab} onNavigate={onCloseMobile}/>
        <NavItem id="templates"  icon={MessageSquareText} label="Templates"  count={state.templates.length} tab={tab} setTab={setTab} onNavigate={onCloseMobile}/>

        <div style={{ height: 8 }}/>
        <RoleFocusSelector preferences={prefs} onChange={setSearchPreferences} />

        <div style={{ height: 14 }}/>
        <div style={{ fontSize: 10.5, fontWeight: 600, color:'var(--ink-4)', textTransform:'uppercase', letterSpacing:'.05em', padding:'4px 10px 6px' }}>Account</div>
        <NavItem id="settings"  icon={SettingsIcon} label="Settings" tab={tab} setTab={setTab} onNavigate={onCloseMobile}/>

        {followupsDue > 0 && (
          <div style={{ marginTop:'auto', padding: 12, marginBottom: 6 }}>
            <div onClick={() => { onOpenFollowUpQueue?.(); setTab('companies'); onCloseMobile?.(); }} className="jcc-card-interactive" style={{
              background:'#FEF3C7', borderRadius: 9, padding: 12,
              border:'1px solid #FDE68A', transition: 'transform .12s'
            }}>
              <div style={{ display:'flex', alignItems:'center', gap: 6, marginBottom: 4 }}>
                <Bell size={12} style={{ color:'#D97706' }}/>
                <span style={{ fontSize: 11.5, fontWeight: 600, color:'#92400E' }}>Follow-ups due</span>
              </div>
              <div style={{ fontSize: 11.5, color:'#78350F' }}>
                <strong className="jcc-num">{followupsDue}</strong> compan{followupsDue===1?'y':'ies'} need attention.
              </div>
            </div>
          </div>
        )}
      </nav>

      <div style={{ padding:'12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))', borderTop:'1px solid var(--hairline)' }}>
        <SyncStatusIndicator syncStatus={syncStatus} lastSavedAt={lastSavedAt}/>
      </div>
    </aside>
  );
}
