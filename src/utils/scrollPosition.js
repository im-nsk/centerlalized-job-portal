const SCROLL_KEY = 'jcc_scroll_positions';
const TAB_KEY = 'jcc_active_tab';
const RESTORE_PENDING_KEY = 'jcc_restore_pending';

export function saveScrollPosition(tab, scrollTop) {
  if (!tab || scrollTop < 0) return;
  try {
    const stored = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}');
    stored[tab] = scrollTop;
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(stored));
  } catch { /* quota / private mode */ }
}

export function getScrollPosition(tab) {
  if (!tab) return 0;
  try {
    const stored = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}');
    return stored[tab] ?? 0;
  } catch {
    return 0;
  }
}

export function saveActiveTab(tab) {
  try {
    sessionStorage.setItem(TAB_KEY, tab);
  } catch { /* ignore */ }
}

export function getActiveTab() {
  try {
    return sessionStorage.getItem(TAB_KEY);
  } catch {
    return null;
  }
}

/** Mark that we expect scroll to be restored after external navigation or content mutation. */
export function markRestorePending() {
  try {
    sessionStorage.setItem(RESTORE_PENDING_KEY, String(Date.now()));
  } catch { /* ignore */ }
}

export function isRestorePending() {
  try {
    return sessionStorage.getItem(RESTORE_PENDING_KEY) != null;
  } catch {
    return false;
  }
}

export function clearRestorePending() {
  try {
    sessionStorage.removeItem(RESTORE_PENDING_KEY);
  } catch { /* ignore */ }
}

export function captureScrollFromElement(el, tab) {
  if (!el || !tab) return 0;
  const scrollTop = el.scrollTop;
  saveScrollPosition(tab, scrollTop);
  return scrollTop;
}

export function captureAndMarkRestore(el, tab) {
  const scrollTop = captureScrollFromElement(el, tab);
  if (scrollTop > 0) markRestorePending();
  return scrollTop;
}
