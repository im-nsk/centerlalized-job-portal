import { useState } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';
import {
  ACTIVITY_TYPES,
  MANUAL_ACTIVITY_OPTIONS,
} from '../data/activityTypes.js';
import {
  getActivityMeta,
  sortActivitiesNewestFirst,
  addManualActivity,
  removeActivity,
} from '../utils/activityLog.js';
import { fmtDate, todayISO } from '../utils/helpers.js';
import { Field } from './ui/Field.jsx';

export default function ActivityTimeline({
  company,
  onUpdate,
  compact = false,
  maxItems,
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: 'recruiter_contacted',
    date: todayISO(),
    note: '',
  });

  const activities = sortActivitiesNewestFirst(company.activityLog || []);
  const visible = maxItems ? activities.slice(0, maxItems) : activities;

  const submitManual = () => {
    if (!form.type) return;
    const next = addManualActivity(company, {
      type: form.type,
      note: form.note,
      date: form.date,
    });
    onUpdate(next);
    setForm({ type: 'recruiter_contacted', date: todayISO(), note: '' });
    setShowForm(false);
  };

  const handleRemove = (id, manual) => {
    if (!manual && !confirm('Remove this activity entry?')) return;
    onUpdate(removeActivity(company, id));
  };

  return (
    <div>
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Activity timeline</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
              {activities.length} event{activities.length !== 1 ? 's' : ''} · newest first
            </div>
          </div>
          <button
            type="button"
            className="jcc-btn jcc-btn-sm jcc-btn-primary"
            onClick={() => setShowForm((v) => !v)}
          >
            <Plus size={13}/> Add entry
          </button>
        </div>
      )}

      {showForm && !compact && (
        <div className="jcc-card" style={{ padding: 14, marginBottom: 16, background: 'var(--surface-2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="jcc-form-row-2">
              <Field label="Activity type">
                <select
                  className="jcc-input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {MANUAL_ACTIVITY_OPTIONS.map((id) => (
                    <option key={id} value={id}>{ACTIVITY_TYPES[id].label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Date">
                <input
                  type="date"
                  className="jcc-input"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Details" hint="Optional — who you spoke to, context, next steps">
              <textarea
                className="jcc-input"
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="e.g. Emailed recruiter Sarah — awaiting loop schedule"
              />
            </Field>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="jcc-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="button" className="jcc-btn jcc-btn-primary" onClick={submitManual}>Save entry</button>
            </div>
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <div style={{
          padding: compact ? '16px 0' : '32px 20px',
          textAlign: 'center',
          color: 'var(--ink-3)',
          fontSize: 13,
          border: compact ? 'none' : '1px dashed var(--hairline)',
          borderRadius: 10,
        }}>
          <Clock size={20} style={{ color: 'var(--ink-4)', marginBottom: 8 }}/>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>No activity yet</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-4)' }}>
            Status changes and applications are logged automatically. Add manual entries for outreach and follow-ups.
          </div>
        </div>
      ) : (
        <div className="jcc-timeline">
          {visible.map((item, index) => {
            const meta = getActivityMeta(item.type);
            const isLast = index === visible.length - 1;
            return (
              <div key={item.id} className="jcc-timeline-item">
                <div className="jcc-timeline-rail">
                  <div
                    className="jcc-timeline-dot"
                    style={{ background: meta.bg, borderColor: meta.color }}
                  />
                  {!isLast && <div className="jcc-timeline-line"/>}
                </div>
                <div className="jcc-timeline-body" style={{ paddingBottom: isLast ? 0 : 16 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: meta.color,
                        }}>
                          {item.title || meta.label}
                        </span>
                        {item.manual && (
                          <span style={{
                            fontSize: 10,
                            fontWeight: 500,
                            color: 'var(--ink-4)',
                            background: 'var(--surface-3)',
                            padding: '1px 6px',
                            borderRadius: 4,
                          }}>
                            Manual
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={10}/>
                        {fmtDate(item.date)}
                      </div>
                      {item.note && (
                        <div style={{
                          fontSize: 13,
                          color: 'var(--ink-2)',
                          marginTop: 8,
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap',
                        }}>
                          {item.note}
                        </div>
                      )}
                    </div>
                    {!compact && item.manual && (
                      <button
                        type="button"
                        className="jcc-btn jcc-btn-ghost jcc-btn-sm"
                        onClick={() => handleRemove(item.id, true)}
                        aria-label="Remove entry"
                        style={{ padding: 4, flexShrink: 0 }}
                      >
                        <Trash2 size={13} style={{ color: 'var(--ink-4)' }}/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {compact && activities.length > (maxItems || 0) && (
        <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 8 }}>
          +{activities.length - maxItems} more in Activity tab
        </div>
      )}
    </div>
  );
}
