import { AlertCircle, RefreshCw } from 'lucide-react';

export default function SyncErrorBanner({ message, onRetry, retrying = false }) {
  if (!message) return null;

  return (
    <div className="jcc-sync-banner" role="alert">
      <div className="jcc-sync-banner-inner">
        <AlertCircle size={16} style={{ flexShrink: 0, color: '#DC2626' }}/>
        <span className="jcc-sync-banner-text">{message}</span>
        {onRetry && (
          <button
            type="button"
            className="jcc-btn jcc-btn-sm"
            onClick={onRetry}
            disabled={retrying}
            style={{ flexShrink: 0, marginLeft: 'auto' }}
          >
            {retrying ? <RefreshCw size={13} className="jcc-spin-icon"/> : <RefreshCw size={13}/>}
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
