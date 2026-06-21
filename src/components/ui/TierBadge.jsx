import { getTier } from '../../utils/helpers.js';
import { Pill } from './Pill.jsx';

export function TierBadge({ tierId }) {
  const t = getTier(tierId);
  return <Pill color={t.accent} bg="#F8FAFC" border="#E2E8F0">{t.short}</Pill>;
}
