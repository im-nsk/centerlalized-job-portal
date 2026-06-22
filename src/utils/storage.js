import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { defaultState } from '../data/companies.js';
import {
  normalizeState,
  isProfileStateEmpty,
  resolveInitialState,
  markLocalStateMigrated,
} from './stateMigration.js';
import { SYNC_STATUS, isAuthError } from './syncStatus.js';

const SAVE_DEBOUNCE_MS = 300;

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('state')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data?.state ?? null;
}

async function upsertProfile(userId, email, state) {
  const { error } = await supabase.from('profiles').upsert(
    { id: userId, email, state },
    { onConflict: 'id' }
  );
  if (error) throw error;
}

export function useStorage() {
  const [user, setUser] = useState(null);
  const [state, setState] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [syncStatus, setSyncStatus] = useState(SYNC_STATUS.IDLE);
  const [syncError, setSyncError] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const saveTimer = useRef(null);
  const skipSave = useRef(true);
  const userIdRef = useRef(null);
  const stateRef = useRef(null);
  const userRef = useRef(null);
  const saveInFlightRef = useRef(null);
  const pendingFlushRef = useRef(false);
  const sessionExpiredRef = useRef(false);

  stateRef.current = state;
  userRef.current = user;
  sessionExpiredRef.current = sessionExpired;

  const markSessionExpired = useCallback(() => {
    setSessionExpired(true);
    setSyncStatus(SYNC_STATUS.ERROR);
    setSyncError('Your session has expired. Sign in again to sync changes.');
  }, []);

  const performSave = useCallback(async () => {
    const u = userRef.current;
    const data = stateRef.current;
    if (!u || !data || skipSave.current || sessionExpiredRef.current) return false;

    if (saveInFlightRef.current) {
      return saveInFlightRef.current;
    }

    const promise = (async () => {
      setSyncStatus(SYNC_STATUS.SAVING);
      setSyncError(null);
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!sessionData?.session) {
          markSessionExpired();
          return false;
        }

        await upsertProfile(u.id, u.email, data);
        setSyncStatus(SYNC_STATUS.SAVED);
        setLastSavedAt(Date.now());
        setSyncError(null);
        return true;
      } catch (e) {
        console.error('Save failed', e);
        if (isAuthError(e)) markSessionExpired();
        else {
          setSyncStatus(SYNC_STATUS.ERROR);
          setSyncError(e.message || 'Failed to save changes to the cloud.');
        }
        return false;
      } finally {
        saveInFlightRef.current = null;
      }
    })();

    saveInFlightRef.current = promise;
    return promise;
  }, [markSessionExpired]);

  const scheduleSave = useCallback(() => {
    if (skipSave.current || !loaded || !stateRef.current || !userRef.current || sessionExpiredRef.current) return;

    clearTimeout(saveTimer.current);
    setSyncStatus((prev) => (prev === SYNC_STATUS.ERROR ? SYNC_STATUS.ERROR : SYNC_STATUS.SAVING));

    saveTimer.current = setTimeout(() => {
      performSave();
    }, SAVE_DEBOUNCE_MS);
  }, [loaded, performSave]);

  const flushSave = useCallback(async () => {
    if (skipSave.current || !userRef.current || !stateRef.current) return true;
    clearTimeout(saveTimer.current);
    return performSave();
  }, [performSave]);

  const retrySave = useCallback(async () => {
    if (sessionExpiredRef.current) return false;
    setSyncError(null);
    return flushSave();
  }, [flushSave]);

  const loadProfileForUser = useCallback(async (sessionUser) => {
    skipSave.current = true;
    setLoaded(false);
    setLoadError(null);
    setSessionExpired(false);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData?.session) {
        markSessionExpired();
        throw new Error('Your session has expired. Please sign in again.');
      }

      const remoteState = await fetchProfile(sessionUser.id);

      if (remoteState && !isProfileStateEmpty(remoteState)) {
        setState(normalizeState(remoteState));
      } else {
        const initial = resolveInitialState(remoteState);
        await upsertProfile(sessionUser.id, sessionUser.email, initial);
        if (initial !== defaultState()) markLocalStateMigrated();
        setState(initial);
      }

      setLoadError(null);
      setSyncStatus(SYNC_STATUS.SAVED);
      setLastSavedAt(Date.now());
      setSyncError(null);
      skipSave.current = false;
      return true;
    } catch (e) {
      console.error('Profile load failed', e);
      setState(null);
      skipSave.current = true;
      if (isAuthError(e)) {
        markSessionExpired();
        setLoadError('Your session has expired. Please sign in again.');
      } else {
        setLoadError(e.message || 'Could not load your data from the cloud.');
      }
      return false;
    } finally {
      setLoaded(true);
    }
  }, [markSessionExpired]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return undefined;

    let mounted = true;

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      if (error) {
        console.error('Auth session error', error);
        if (isAuthError(error)) setSessionExpired(true);
      }
      const u = session?.user ?? null;
      setUser(u);
      userIdRef.current = u?.id ?? null;
      setAuthReady(true);
      if (u) loadProfileForUser(u);
      else {
        setState(null);
        setLoaded(true);
        skipSave.current = true;
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      userIdRef.current = u?.id ?? null;

      if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
        setSessionExpired(true);
      } else if (event === 'SIGNED_IN' || (event === 'TOKEN_REFRESHED' && session)) {
        setSessionExpired(false);
      }

      if (u) {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          loadProfileForUser(u);
        }
      } else if (event === 'SIGNED_OUT') {
        skipSave.current = true;
        setState(null);
        setLoaded(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfileForUser]);

  useEffect(() => {
    if (sessionExpired) clearTimeout(saveTimer.current);
  }, [sessionExpired]);

  useEffect(() => {
    scheduleSave();
    return () => clearTimeout(saveTimer.current);
  }, [state, loaded, user, scheduleSave]);

  // Flush pending saves before tab hide, refresh, or close
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden' && !pendingFlushRef.current) {
        pendingFlushRef.current = true;
        flushSave().finally(() => { pendingFlushRef.current = false; });
      }
    };
    const onPageHide = () => {
      if (!pendingFlushRef.current) {
        pendingFlushRef.current = true;
        flushSave().finally(() => { pendingFlushRef.current = false; });
      }
    };
    const onBeforeUnload = () => {
      clearTimeout(saveTimer.current);
      if (skipSave.current || !userRef.current || !stateRef.current) return;
      flushSave();
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('beforeunload', onBeforeUnload);
      flushSave();
    };
  }, [flushSave]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    skipSave.current = true;
    clearTimeout(saveTimer.current);
    await flushSave();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setState(null);
    setLoaded(true);
    setSessionExpired(false);
    setSyncStatus(SYNC_STATUS.IDLE);
    setSyncError(null);
  }, [flushSave]);

  const retryLoad = useCallback(async () => {
    const u = userRef.current;
    if (!u) return false;
    return loadProfileForUser(u);
  }, [loadProfileForUser]);

  return {
    state,
    setState,
    loaded,
    authReady,
    user,
    loadError,
    syncStatus,
    syncError,
    lastSavedAt,
    sessionExpired,
    signInWithGoogle,
    signOut,
    retrySave,
    retryLoad,
  };
}
