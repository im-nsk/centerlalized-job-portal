import { LogIn } from 'lucide-react';

export default function SessionExpiredModal({ onSignIn, onDismiss }) {
  return (
    <div className="jcc-modal-overlay" style={{ zIndex: 300, alignItems: 'center' }}>
      <div
        className="jcc-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '24px 24px 8px' }}>
          <h2 id="session-expired-title" style={{ fontSize: 17, fontWeight: 600, margin: '0 0 8px' }}>
            Session expired
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--ink-3)', margin: 0, lineHeight: 1.5 }}>
            Your sign-in session has expired. Sign in again to continue syncing your job search data to the cloud.
          </p>
        </div>
        <div style={{
          padding: '16px 24px 20px',
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end',
          borderTop: '1px solid var(--hairline)',
          background: 'var(--surface-2)',
        }}>
          {onDismiss && (
            <button type="button" className="jcc-btn" onClick={onDismiss}>
              Continue offline
            </button>
          )}
          <button type="button" className="jcc-btn jcc-btn-primary" onClick={onSignIn}>
            <LogIn size={14}/> Sign in again
          </button>
        </div>
      </div>
    </div>
  );
}
