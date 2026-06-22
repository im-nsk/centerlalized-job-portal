/** Sync lifecycle states exposed to the UI */
export const SYNC_STATUS = {
  IDLE: 'idle',
  SAVING: 'saving',
  SAVED: 'saved',
  ERROR: 'error',
};

export function isAuthError(error) {
  if (!error) return false;
  const msg = (error.message || '').toLowerCase();
  const status = error.status ?? error.statusCode;
  const code = String(error.code ?? '');
  return (
    status === 401 ||
    status === 403 ||
    code === '401' ||
    code === '403' ||
    code === 'PGRST301' ||
    msg.includes('jwt') ||
    msg.includes('session') ||
    msg.includes('not authenticated') ||
    msg.includes('invalid claim') ||
    error.name === 'AuthSessionMissingError'
  );
}

export function formatLastSaved(isoOrMs) {
  if (!isoOrMs) return null;
  const d = typeof isoOrMs === 'number' ? new Date(isoOrMs) : new Date(isoOrMs);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
