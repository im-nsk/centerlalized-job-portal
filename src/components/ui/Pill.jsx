import { cls } from '../../utils/helpers.js';

export function Pill({ children, color, bg, border, className }) {
  return (
    <span className={cls('jcc-pill', className)} style={{ color, background: bg, border: border ? `1px solid ${border}` : 'none' }}>
      {children}
    </span>
  );
}
