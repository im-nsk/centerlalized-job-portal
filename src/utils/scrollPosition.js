const SCROLL_KEY = 'jcc_scroll_positions';
const TAB_KEY = 'jcc_active_tab';

export function saveScrollPosition(tab, scrollTop) {
  try {
    const stored = JSON.parse(sessionStorage.getItem(SCROLL_KEY) || '{}');
    stored[tab] = scrollTop;
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify(stored));
  } catch { /* quota / private mode */ }
}

export function getScrollPosition(tab) {
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

export function captureScrollFromElement(el, tab) {
  if (el && tab) saveScrollPosition(tab, el.scrollTop);
}
