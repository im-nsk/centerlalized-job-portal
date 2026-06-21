import { useState, useEffect, useMemo, useCallback } from 'react';
import { useStorage } from './utils/storage.js';
import { GlobalStyles } from './components/ui/GlobalStyles.jsx';
import { Toast } from './components/ui/Toast.jsx';
import LoginScreen from './components/LoginScreen.jsx';
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

export default function App() {
  const {
    state, setState, loaded, authReady, user, signInWithGoogle, signOut,
  } = useStorage();
  const [tab, setTab] = useState('dashboard');
  const [openCompanyId, setOpenCompanyId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');
  const [globalQuery, setGlobalQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
      if (e.key === 'Escape') { setShowSearch(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

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

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setToast('Signed out');
    } catch (e) {
      setToast('Sign out failed');
    }
  }, [signOut]);

  if (!authReady) {
    return (
      <div className="jcc" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--surface-2)' }}>
        <GlobalStyles/>
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

  if (!loaded || !state) {
    return (
      <div className="jcc" style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--surface-2)' }}>
        <GlobalStyles/>
        <div style={{ fontSize: 13, color:'var(--ink-3)' }}>Loading your data…</div>
      </div>
    );
  }

  return (
    <div className="jcc" style={{ height:'100vh', display:'flex', overflow:'hidden', background:'var(--surface-2)' }}>
      <GlobalStyles/>

      <Sidebar
        tab={tab}
        setTab={setTab}
        state={state}
        setState={setState}
        followupsDue={followupsDue}
        interviewsActive={interviewsActive}
        onShowSearch={() => setShowSearch(true)}
      />

      <main className="jcc-scroll" style={{ flex: 1, overflow:'auto', background:'var(--surface-2)' }}>
        {tab === 'dashboard'  && <Dashboard state={state} onJump={setTab} onOpenCompany={setOpenCompanyId}/>}
        {tab === 'companies'  && <CompanyTable state={state} setState={setState} onOpenCompany={setOpenCompanyId} onAddCompany={() => setShowAdd(true)} onToast={setToast}/>}
        {tab === 'pipeline'   && <PipelineView state={state} setState={setState} onOpenCompany={setOpenCompanyId}/>}
        {tab === 'prep'       && <PrepView state={state} setState={setState}/>}
        {tab === 'templates'  && <TemplatesView state={state} setState={setState} onToast={setToast}/>}
        {tab === 'settings'   && <SettingsView state={state} setState={setState} onToast={setToast} user={user} onSignOut={handleSignOut}/>}
      </main>

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
  );
}
