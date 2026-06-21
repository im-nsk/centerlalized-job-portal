import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { defaultState } from '../data/companies.js';
import {
  normalizeState,
  isProfileStateEmpty,
  resolveInitialState,
  markLocalStateMigrated,
} from './stateMigration.js';

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
  const saveTimer = useRef(null);
  const skipSave = useRef(true);
  const userIdRef = useRef(null);

  const loadProfileForUser = useCallback(async (sessionUser) => {
    skipSave.current = true;
    setLoaded(false);

    try {
      let remoteState = await fetchProfile(sessionUser.id);

      if (remoteState && !isProfileStateEmpty(remoteState)) {
        setState(normalizeState(remoteState));
      } else {
        const initial = resolveInitialState(remoteState);
        await upsertProfile(sessionUser.id, sessionUser.email, initial);
        if (initial !== defaultState()) markLocalStateMigrated();
        setState(initial);
      }
    } catch (e) {
      console.error('Profile load failed', e);
      const fallback = resolveInitialState(null);
      setState(fallback);
      try {
        await upsertProfile(sessionUser.id, sessionUser.email, fallback);
      } catch (saveErr) {
        console.error('Profile bootstrap failed', saveErr);
      }
    } finally {
      skipSave.current = false;
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      userIdRef.current = u?.id ?? null;

      if (u) {
        loadProfileForUser(u);
      } else {
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
    if (skipSave.current || !loaded || !state || !user) return;

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await upsertProfile(user.id, user.email, state);
      } catch (e) {
        console.error('Save failed', e);
      }
    }, 300);

    return () => clearTimeout(saveTimer.current);
  }, [state, loaded, user]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    skipSave.current = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setState(null);
    setLoaded(true);
  }, []);

  return {
    state,
    setState,
    loaded,
    authReady,
    user,
    signInWithGoogle,
    signOut,
  };
}
