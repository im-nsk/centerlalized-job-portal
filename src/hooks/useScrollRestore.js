import { useEffect, useRef } from 'react';
import { getScrollPosition, saveScrollPosition } from '../utils/scrollPosition.js';

/**
 * Persists and restores main-content scroll per tab.
 * Handles return from external tabs (visibility + bfcache pageshow).
 */
export function useScrollRestore(mainRef, tab) {
  const tabRef = useRef(tab);
  tabRef.current = tab;

  // Restore when tab changes
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const pos = getScrollPosition(tab);
    requestAnimationFrame(() => {
      if (mainRef.current) mainRef.current.scrollTop = pos;
    });
  }, [tab, mainRef]);

  // Debounced save while scrolling
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    let timer;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => saveScrollPosition(tabRef.current, el.scrollTop), 80);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener('scroll', onScroll);
    };
  }, [mainRef, tab]);

  // Restore when user returns from another browser tab / bfcache
  useEffect(() => {
    const restore = () => {
      const el = mainRef.current;
      if (!el) return;
      const pos = getScrollPosition(tabRef.current);
      requestAnimationFrame(() => { el.scrollTop = pos; });
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') restore();
    };
    window.addEventListener('pageshow', restore);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pageshow', restore);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [mainRef]);
}
