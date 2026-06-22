import { Loader2 } from 'lucide-react';
import { SYNC_STATUS, formatLastSaved } from '../utils/syncStatus.js';

const STATUS_CONFIG = {
  [SYNC_STATUS.SAVING]: {
    color: '#D97706',
    label: 'Saving…',
    pulse: true,
  },
  [SYNC_STATUS.SAVED]: {
    color: '#10B981',
    label: 'Saved',
    pulse: false,
  },
  [SYNC_STATUS.ERROR]: {
    color: '#DC2626',
    label: 'Sync error',
    pulse: false,
  },
  [SYNC_STATUS.IDLE]: {
    color: '#94A3B8',
    label: 'Ready',
    pulse: false,
  },
};

export default function SyncStatusIndicator({ syncStatus, lastSavedAt }) {
  const config = STATUS_CONFIG[syncStatus] || STATUS_CONFIG[SYNC_STATUS.IDLE];
  const savedHint = syncStatus === SYNC_STATUS.SAVED && lastSavedAt
    ? formatLastSaved(lastSavedAt)
    : null;

  return (
    <div
      style={{ fontSize: 11, color: 'var(--ink-4)' }}
      aria-live="polite"
      aria-atomic="true"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {syncStatus === SYNC_STATUS.SAVING ? (
          <Loader2 size={11} className="jcc-spin-icon" style={{ color: config.color }}/>
        ) : (
          <div style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: config.color,
            flexShrink: 0,
            animation: config.pulse ? 'jccPulse 1.2s ease-in-out infinite' : undefined,
          }}/>
        )}
        <span style={{ color: syncStatus === SYNC_STATUS.ERROR ? '#DC2626' : 'var(--ink-4)' }}>
          {config.label}
          {savedHint && (
            <span style={{ color: 'var(--ink-4)' }}> · {savedHint}</span>
          )}
        </span>
      </div>
    </div>
  );
}
