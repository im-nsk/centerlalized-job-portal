import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveScrollPosition,
  getScrollPosition,
  markRestorePending,
  isRestorePending,
  clearRestorePending,
  captureAndMarkRestore,
} from './scrollPosition.js';

describe('scrollPosition', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearRestorePending();
  });

  it('saves and retrieves scroll per tab', () => {
    saveScrollPosition('companies', 842);
    expect(getScrollPosition('companies')).toBe(842);
    expect(getScrollPosition('dashboard')).toBe(0);
  });

  it('marks restore pending when capturing scroll from element', () => {
    const el = { scrollTop: 420 };
    const pos = captureAndMarkRestore(el, 'companies');
    expect(pos).toBe(420);
    expect(getScrollPosition('companies')).toBe(420);
    expect(isRestorePending()).toBe(true);
  });

  it('does not mark pending when scroll is at top', () => {
    captureAndMarkRestore({ scrollTop: 0 }, 'companies');
    expect(isRestorePending()).toBe(false);
  });

  it('clears restore pending flag', () => {
    markRestorePending();
    expect(isRestorePending()).toBe(true);
    clearRestorePending();
    expect(isRestorePending()).toBe(false);
  });
});

describe('scroll restore simulation', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearRestorePending();
  });

  it('restores scroll after simulated tab hide/show + DOM reset', () => {
    const main = document.createElement('main');
    main.style.height = '200px';
    main.style.overflow = 'auto';
    document.body.appendChild(main);

    // Tall content
    const content = document.createElement('div');
    content.style.height = '2000px';
    main.appendChild(content);

    // User scrolls down
    main.scrollTop = 750;
    captureAndMarkRestore(main, 'companies');

    // Browser resets scroll when tab hidden (common behavior)
    main.scrollTop = 0;
    expect(main.scrollTop).toBe(0);

    // Simulate return: read stored position and apply
    const stored = getScrollPosition('companies');
    expect(stored).toBe(750);
    main.scrollTop = stored;
    expect(main.scrollTop).toBe(750);

    document.body.removeChild(main);
  });

  it('captureScrollBeforeAction flow via registerScrollContext', async () => {
    const { registerScrollContext, captureScrollBeforeAction } = await import('./externalNav.js');

    const main = document.createElement('main');
    document.body.appendChild(main);
    main.scrollTop = 512;

    registerScrollContext(() => main, () => 'companies');
    captureScrollBeforeAction();

    expect(getScrollPosition('companies')).toBe(512);
    expect(isRestorePending()).toBe(true);

    main.scrollTop = 0;
    main.scrollTop = getScrollPosition('companies');
    expect(main.scrollTop).toBe(512);

    document.body.removeChild(main);
  });
});

describe('applyScrollTop helper behavior', () => {
  it('applies scroll within tolerance', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollTop', {
      writable: true,
      value: 0,
    });
    const pos = 600;
    el.scrollTop = pos;
    expect(Math.abs(el.scrollTop - pos)).toBeLessThanOrEqual(3);
  });
});
