import { captureScrollFromElement } from './scrollPosition.js';

let getScrollEl = null;
let getActiveTab = null;

/** Register main scroll container + active tab getter (called once from App). */
export function registerScrollContext(scrollElGetter, tabGetter) {
  getScrollEl = scrollElGetter;
  getActiveTab = tabGetter;
}

/** Open URL in new tab and preserve current scroll position for return navigation. */
export function openExternalUrl(url) {
  if (url) {
    const el = getScrollEl?.();
    const tab = getActiveTab?.();
    captureScrollFromElement(el, tab);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
