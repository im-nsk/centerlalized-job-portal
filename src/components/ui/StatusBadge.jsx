import { getStatus } from '../../utils/helpers.js';
import { Pill } from './Pill.jsx';

export function StatusBadge({ statusId }) {
  const s = getStatus(statusId);
  return <Pill color={s.color} bg={s.bg}>{s.label}</Pill>;
}
