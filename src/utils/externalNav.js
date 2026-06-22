import { captureAndMarkRestore } from './scrollPosition.js';

let getScrollEl = null;
let getActiveTab = null;

/** Register main scroll container + active tab getter (called once from App). */
export function registerScrollContext(scrollElGetter, tabGetter) {
  getScrollEl = scrollElGetter;
  getActiveTab = tabGetter;
}

/** Synchronously capture scroll before any async work or navigation. */
export function captureScrollBeforeAction() {
  const el = getScrollEl?.();
  const tab = getActiveTab?.();
  if (el && tab) return captureAndMarkRestore(el, tab);
  return 0;
}

/** Open URL in new tab and preserve current scroll position for return navigation. */
export function openExternalUrl(url) {
  if (!url) return;
  captureScrollBeforeAction();
  window.open(url, '_blank', 'noopener,noreferrer');
}
