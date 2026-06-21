import {
  LayoutDashboard, Building2, KanbanSquare, GraduationCap, MessageSquareText,
  Settings as SettingsIcon, Search, Bell, Zap,
} from 'lucide-react';
import { cls } from '../utils/helpers.js';
import RoleFocusSelector from './RoleFocusSelector.jsx';

function NavItem({ id, icon: Icon, label, count, tab, setTab }) {
  return (
    <div className={cls('jcc-sidebar-item', tab === id && 'active')} onClick={() => setTab(id)}>
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
}) {
  const prefs = state.searchPreferences || { roleFocus: 'data_plus_ai', smartSearchMode: true };

  const setSearchPreferences = (next) => {
    setState((s) => ({ ...s, searchPreferences: next }));
  };

  return (
    <aside style={{ width: 232, flexShrink: 0, background:'var(--surface)', borderRight:'1px solid var(--hairline)', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid var(--hairline)' }}>
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
      </div>

      <div style={{ padding:'12px 12px 4px' }}>
        <button onClick={onShowSearch} style={{
          width:'100%', display:'flex', alignItems:'center', gap: 8,
          padding:'7px 10px', borderRadius: 7, border:'1px solid var(--hairline)',
          background:'var(--surface-2)', color:'var(--ink-3)', fontSize: 12.5,
          cursor:'pointer', transition:'all .12s', fontFamily:'inherit'
        }} onMouseEnter={e => e.currentTarget.style.borderColor='#CBD5E1'}
           onMouseLeave={e => e.currentTarget.style.borderColor='var(--hairline)'}>
          <Search size={13}/>
          <span style={{ flex: 1, textAlign:'left' }}>Search companies…</span>
          <span className="jcc-kbd">⌘K</span>
        </button>
      </div>

      <nav style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap: 1, flex: 1 }}>
        <NavItem id="dashboard"  icon={LayoutDashboard}  label="Dashboard" tab={tab} setTab={setTab}/>
        <NavItem id="companies"  icon={Building2}        label="Companies"  count={state.companies.length} tab={tab} setTab={setTab}/>
        <NavItem id="pipeline"   icon={KanbanSquare}     label="Pipeline"   count={interviewsActive} tab={tab} setTab={setTab}/>
        <NavItem id="prep"       icon={GraduationCap}    label="Prep"       count={state.starStories.length} tab={tab} setTab={setTab}/>
        <NavItem id="templates"  icon={MessageSquareText} label="Templates"  count={state.templates.length} tab={tab} setTab={setTab}/>

        <div style={{ height: 8 }}/>
        <RoleFocusSelector preferences={prefs} onChange={setSearchPreferences} />

        <div style={{ height: 14 }}/>
        <div style={{ fontSize: 10.5, fontWeight: 600, color:'var(--ink-4)', textTransform:'uppercase', letterSpacing:'.05em', padding:'4px 10px 6px' }}>Account</div>
        <NavItem id="settings"  icon={SettingsIcon} label="Settings" tab={tab} setTab={setTab}/>

        {followupsDue > 0 && (
          <div style={{ marginTop:'auto', padding: 12, marginBottom: 6 }}>
            <div onClick={() => setTab('pipeline')} style={{
              background:'#FEF3C7', borderRadius: 9, padding: 12, cursor:'pointer',
              border:'1px solid #FDE68A'
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

      <div style={{ padding:'12px 16px', borderTop:'1px solid var(--hairline)', fontSize: 11, color:'var(--ink-4)' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius:'50%', background:'#10B981' }}/>
          Synced to cloud
        </div>
      </div>
    </aside>
  );
}
