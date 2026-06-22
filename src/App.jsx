import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useStorage } from './utils/storage.js';
import { isSupabaseConfigured } from './lib/supabase.js';
import { SYNC_STATUS } from './utils/syncStatus.js';
import { useCompanyFilters } from './hooks/useCompanyFilters.js';
import { getActiveTab, saveActiveTab } from './utils/scrollPosition.js';
import { registerScrollContext } from './utils/externalNav.js';
import { useScrollRestore } from './hooks/useScrollRestore.js';
import { GlobalStyles } from './components/ui/GlobalStyles.jsx';
import { Toast } from './components/ui/Toast.jsx';
import { LoadingSpinner } from './components/ui/LoadingSpinner.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import ConfigErrorScreen from './components/ConfigErrorScreen.jsx';
import LoadErrorScreen from './components/LoadErrorScreen.jsx';
import SyncErrorBanner from './components/SyncErrorBanner.jsx';
import SessionExpiredModal from './components/SessionExpiredModal.jsx';
import Sidebar from './components/Sidebar.jsx';
import GlobalSearch from './components/GlobalSearch.jsx';
import Dashboard from './components/Dashboard.jsx';
import CompanyTable from './components/CompanyTable.jsx';
import PipelineView from './components/PipelineView.jsx';
import PrepView from './components/PrepView.jsx';
import TemplatesView from './components/TemplatesView.jsx';
import SettingsView from './components/SettingsView.jsx';
import NotesModal from './components/NotesModal.jsx';
import AddCompanyModal from './components/AddCompanyModal.jsx';
import { Menu, Search } from 'lucide-react';

const TAB_LABELS = {
  dashboard: 'Dashboard',
  companies: 'Companies',
  pipeline: 'Pipeline',
  prep: 'Prep',
  templates: 'Templates',
  settings: 'Settings',
};

export default function App() {
  if (!isSupabaseConfigured()) {
    return <ConfigErrorScreen/>;
  }

  return <AppShell/>;
}

function AppShell() {
  const {
    state, setState, loaded, authReady, user, loadError,
    syncStatus, syncError, lastSavedAt, sessionExpired,
    signInWithGoogle, signOut, retrySave, retryLoad,
  } = useStorage();
  const { filters, setFilters, applyPreset, clearFilters } = useCompanyFilters();
  const [tab, setTab] = useState(() => getActiveTab() || 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openCompanyId, setOpenCompanyId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');
  const [globalQuery, setGlobalQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [retryingSave, setRetryingSave] = useState(false);
  const [retryingLoad, setRetryingLoad] = useState(false);
  const [sessionModalDismissed, setSessionModalDismissed] = useState(false);
  const mainRef = useRef(null);
  const tabRef = useRef(tab);

  tabRef.current = tab;
  useScrollRestore(mainRef, tab);

  useEffect(() => {
    registerScrollContext(
      () => mainRef.current,
      () => tabRef.current
    );
  }, []);

  useEffect(() => {
    saveActiveTab(tab);
  }, [tab]);

  const navigate = useCallback((nextTab) => {
    setTab(nextTab);
    setSidebarOpen(false);
  }, []);

  const viewCompaniesWithPreset = useCallback((presetKey) => {
    applyPreset(presetKey);
    setTab('companies');
    setSidebarOpen(false);
  }, [applyPreset]);

  const openFollowUpQueue = useCallback(() => {
    applyPreset('followup');
  }, [applyPreset]);

  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  useEffect(() => {
    if (sessionExpired) setSessionModalDismissed(false);
  }, [sessionExpired]);

  const searchResults = useMemo(() => {
    if (!globalQuery || !state) return [];
    const q = globalQuery.toLowerCase();
    return state.companies.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.location||'').toLowerCase().includes(q) ||
      (c.notes||'').toLowerCase().includes(q) ||
      (c.tags||[]).some(t => t.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [globalQuery, state]);

  const openCompany = useMemo(() => {
    if (!state || !openCompanyId) return null;
    return state.companies.find(c => c.id === openCompanyId) ?? null;
  }, [state, openCompanyId]);

  const followupsDue = useMemo(() => {
    if (!state) return 0;
    return state.companies.filter(c =>
      c.followUpDate && new Date(c.followUpDate) <= new Date() &&
      !['offer','rejected','archived'].includes(c.status)
    ).length;
  }, [state]);

  const interviewsActive = useMemo(() => {
    if (!state) return 0;
    return state.companies.filter(c => ['interview_sched','interviewing'].includes(c.status)).length;
  }, [state]);

  const updateCompany = useCallback((next) => {
    setState(s => ({ ...s, companies: s.companies.map(c => c.id === next.id ? next : c) }));
  }, [setState]);

  const deleteCompany = useCallback((id) => {
    setState(s => ({ ...s, companies: s.companies.filter(c => c.id !== id) }));
    setOpenCompanyId(null);
    setToast('Company removed');
  }, [setState]);

  const addCompany = useCallback((c) => {
    setState(s => ({ ...s, companies: [c, ...s.companies] }));
    setToast('Company added');
  }, [setState]);

  const handleSelectSearchCompany = useCallback((id) => {
    setOpenCompanyId(id);
    setShowSearch(false);
    setGlobalQuery('');
  }, []);

  const handleToastDone = useCallback(() => setToast(''), []);

  const handleGoogleSignIn = useCallback(async () => {
    setAuthError('');
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setAuthError(e.message || 'Sign-in failed');
      setSigningIn(false);
    }
  }, [signInWithGoogle]);

  const handleSessionReauth = useCallback(async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setToast(e.message || 'Sign-in failed');
      setSigningIn(false);
    }
  }, [signInWithGoogle]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setToast('Signed out');
    } catch {
      setToast('Sign out failed');
    }
  }, [signOut]);

  const handleRetrySave = useCallback(async () => {
    setRetryingSave(true);
    try {
      const ok = await retrySave();
      if (ok) setToast('Changes saved');
      else if (!sessionExpired) setToast('Save failed — try again');
    } finally {
      setRetryingSave(false);
    }
  }, [retrySave, sessionExpired]);

  const handleRetryLoad = useCallback(async () => {
    setRetryingLoad(true);
    try {
      await retryLoad();
    } finally {
      setRetryingLoad(false);
    }
  }, [retryLoad]);

  const showSyncErrorBanner = syncStatus === SYNC_STATUS.ERROR
    && syncError
    && !sessionExpired;

  if (!authReady) {
    return (
      <div className="jcc" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--surface-2)', flexDirection:'column', gap:12 }}>
        <GlobalStyles/>
        <LoadingSpinner size={22}/>
        <div style={{ fontSize: 13, color:'var(--ink-3)' }}>Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginScreen
        onGoogleSignIn={handleGoogleSignIn}
        error={authError}
        signingIn={signingIn}
      />
    );
  }

  if (!loaded) {
    return (
      <div className="jcc" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--surface-2)', flexDirection:'column', gap:12 }}>
        <GlobalStyles/>
        <LoadingSpinner size={22}/>
        <div style={{ fontSize: 13, color:'var(--ink-3)' }}>Loading your data…</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <LoadErrorScreen
        message={loadError}
        onRetry={handleRetryLoad}
        retrying={retryingLoad}
      />
    );
  }

  if (!state) {
    return (
      <LoadErrorScreen
        message="Your workspace could not be loaded."
        onRetry={handleRetryLoad}
        retrying={retryingLoad}
      />
    );
  }

  return (
    <div className="jcc jcc-app-root">
      <GlobalStyles/>

      {showSyncErrorBanner && (
        <SyncErrorBanner
          message={syncError}
          onRetry={handleRetrySave}
          retrying={retryingSave}
        />
      )}

      {sessionExpired && !sessionModalDismissed && (
        <SessionExpiredModal
          onSignIn={handleSessionReauth}
          onDismiss={() => setSessionModalDismissed(true)}
        />
      )}

      <div className="jcc-app-shell">
      <div
        className={`jcc-sidebar-backdrop ${sidebarOpen ? 'jcc-sidebar-backdrop--visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <Sidebar
        tab={tab}
        setTab={navigate}
        state={state}
        setState={setState}
        followupsDue={followupsDue}
        interviewsActive={interviewsActive}
        onShowSearch={() => { setShowSearch(true); setSidebarOpen(false); }}
        onOpenFollowUpQueue={() => viewCompaniesWithPreset('followup')}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        syncStatus={syncStatus}
        lastSavedAt={lastSavedAt}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
        <header className="jcc-mobile-header">
          <button
            type="button"
            className="jcc-btn jcc-btn-ghost jcc-btn-sm"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18}/>
          </button>
          <span className="jcc-mobile-header-title">{TAB_LABELS[tab] || 'Command Center'}</span>
          <button
            type="button"
            className="jcc-btn jcc-btn-ghost jcc-btn-sm"
            onClick={() => setShowSearch(true)}
            aria-label="Search"
          >
            <Search size={18}/>
          </button>
        </header>

        <main ref={mainRef} className="jcc-main jcc-scroll">
          {tab === 'dashboard'  && <Dashboard state={state} onJump={navigate} onOpenCompany={setOpenCompanyId} onViewCompanies={viewCompaniesWithPreset}/>}
          {tab === 'companies'  && (
            <CompanyTable
              state={state}
              setState={setState}
              onOpenCompany={setOpenCompanyId}
              onAddCompany={() => setShowAdd(true)}
              onToast={setToast}
              filters={filters}
              setFilters={setFilters}
              onClearFilters={clearFilters}
              onOpenFollowUpQueue={openFollowUpQueue}
            />
          )}
          {tab === 'pipeline'   && <PipelineView state={state} setState={setState} onOpenCompany={setOpenCompanyId}/>}
          {tab === 'prep'       && <PrepView state={state} setState={setState}/>}
          {tab === 'templates'  && <TemplatesView state={state} setState={setState} onToast={setToast}/>}
          {tab === 'settings'   && <SettingsView state={state} setState={setState} onToast={setToast} user={user} onSignOut={handleSignOut}/>}
        </main>
      </div>

      {openCompany && (
        <NotesModal company={openCompany} allTags={state.tags}
          searchPreferences={state.searchPreferences}
          onClose={() => setOpenCompanyId(null)}
          onUpdate={updateCompany}
          onDelete={() => deleteCompany(openCompany.id)}
          onToast={setToast}/>
      )}

      {showAdd && <AddCompanyModal onClose={() => setShowAdd(false)} onSave={addCompany}/>}

      <GlobalSearch
        showSearch={showSearch}
        onClose={() => setShowSearch(false)}
        globalQuery={globalQuery}
        setGlobalQuery={setGlobalQuery}
        searchResults={searchResults}
        onSelectCompany={handleSelectSearchCompany}
      />

      <Toast message={toast} onDone={handleToastDone}/>
      </div>
    </div>
  );
}