import { describe, it, expect } from 'vitest';
import { isAuthError, SYNC_STATUS, formatLastSaved } from './syncStatus.js';

describe('isAuthError', () => {
  it('detects 401 status', () => {
    expect(isAuthError({ status: 401, message: 'Unauthorized' })).toBe(true);
  });

  it('detects jwt in message', () => {
    expect(isAuthError({ message: 'JWT expired' })).toBe(true);
    expect(isAuthError({ message: 'invalid JWT' })).toBe(true);
  });

  it('returns false for network errors', () => {
    expect(isAuthError({ message: 'Failed to fetch' })).toBe(false);
  });
});

describe('formatLastSaved', () => {
  it('returns just now for recent saves', () => {
    expect(formatLastSaved(Date.now() - 5000)).toBe('just now');
  });
});

describe('SYNC_STATUS', () => {
  it('has expected states', () => {
    expect(SYNC_STATUS.SAVING).toBe('saving');
    expect(SYNC_STATUS.SAVED).toBe('saved');
    expect(SYNC_STATUS.ERROR).toBe('error');
  });
});
