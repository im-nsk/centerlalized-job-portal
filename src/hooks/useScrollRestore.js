import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import {
  getScrollPosition,
  saveScrollPosition,
  isRestorePending,
  clearRestorePending,
} from '../utils/scrollPosition.js';

const RESTORE_DELAYS_MS = [0, 16, 32, 64, 120, 250, 500];

function applyScrollTop(el, pos) {
  if (!el || pos <= 0) return false;
  el.scrollTop = pos;
  return Math.abs(el.scrollTop - pos) <= 3;
}

/**
 * Persists and restores main-content scroll per tab.
 * Handles return from external tabs, React re-renders after setState, and bfcache.
 */
export function useScrollRestore(mainRef, tab) {
  const tabRef = useRef(tab);
  const liveScrollRef = useRef(0);
  const restoreTimersRef = useRef([]);
  tabRef.current = tab;

  const readPosition = useCallback(() => {
    const fromDom = mainRef.current?.scrollTop ?? 0;
    const fromStore = getScrollPosition(tabRef.current);
    const pos = Math.max(fromDom, liveScrollRef.current, fromStore);
    liveScrollRef.current = pos;
    return pos;
  }, [mainRef]);

  const saveNow = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    liveScrollRef.current = el.scrollTop;
    saveScrollPosition(tabRef.current, el.scrollTop);
  }, [mainRef]);

  const clearRestoreTimers = useCallback(() => {
    restoreTimersRef.current.forEach(clearTimeout);
    restoreTimersRef.current = [];
  }, []);

  const restoreOnce = useCallback(() => {
    const el = mainRef.current;
    if (!el) return false;
    const pos = readPosition();
    if (pos <= 0) return true;
    return applyScrollTop(el, pos);
  }, [mainRef, readPosition]);

  const scheduleRestore = useCallback((reason = 'unknown') => {
    if (!isRestorePending() && liveScrollRef.current <= 0 && getScrollPosition(tabRef.current) <= 0) {
      return;
    }

    clearRestoreTimers();

    const run = () => {
      const ok = restoreOnce();
      if (ok) clearRestorePending();
      return ok;
    };

    // Double rAF — after layout + paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        run();
      });
    });

    RESTORE_DELAYS_MS.forEach((delay) => {
      const id = setTimeout(() => {
        if (run() && delay > 0) clearRestoreTimers();
      }, delay);
      restoreTimersRef.current.push(id);
    });

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[scroll-restore] scheduled', reason, { tab: tabRef.current, pos: readPosition() });
    }
  }, [clearRestoreTimers, readPosition, restoreOnce]);

  // Disable browser automatic scroll restoration (conflicts with our container scroll)
  useEffect(() => {
    if (!('scrollRestoration' in history)) return undefined;
    const prev = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    return () => { history.scrollRestoration = prev; };
  }, []);

  // Track scroll — mirror to ref immediately; debounce sessionStorage writes
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return undefined;
    let timer;
    const onScroll = () => {
      liveScrollRef.current = el.scrollTop;
      clearTimeout(timer);
      timer = setTimeout(() => saveScrollPosition(tabRef.current, el.scrollTop), 80);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener('scroll', onScroll);
    };
  }, [mainRef, tab]);

  // Persist scroll before the tab loses focus or is hidden
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') saveNow();
    };
    const onPageHide = () => saveNow();
    const onBlur = () => saveNow();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('blur', onBlur);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('blur', onBlur);
    };
  }, [saveNow]);

  // Restore when in-app tab changes
  useLayoutEffect(() => {
    liveScrollRef.current = getScrollPosition(tab);
    scheduleRestore('tab-change');
  }, [tab, scheduleRestore]);

  // Restore when returning from another browser tab / bfcache / window focus
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      liveScrollRef.current = Math.max(liveScrollRef.current, getScrollPosition(tabRef.current));
      scheduleRestore('visibility-visible');
    };
    const onPageShow = (e) => {
      if (e.persisted) {
        liveScrollRef.current = getScrollPosition(tabRef.current);
      }
      scheduleRestore('pageshow');
    };
    const onFocus = () => scheduleRestore('window-focus');

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('focus', onFocus);
    };
  }, [scheduleRestore]);

  // After React re-renders (e.g. setState after View Roles), re-apply scroll if pending
  useLayoutEffect(() => {
    if (isRestorePending()) restoreOnce();
  });

  useEffect(() => clearRestoreTimers, [clearRestoreTimers]);
}
