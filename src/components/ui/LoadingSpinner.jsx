export function LoadingSpinner({ size = 16, className = '' }) {
  return (
    <span
      className={`jcc-spinner ${className}`.trim()}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}
