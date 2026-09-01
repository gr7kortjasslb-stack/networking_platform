import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, MapPin, X } from 'lucide-react';
import CyferBar from '../components/CyferBar.jsx';
import { MONTH_NAMES, DAY_NAMES, TYPE_STYLES, PRODUCT_TAGS, toKey, greetingLine, dayStatusLine } from '../data.js';

export default function CalendarPage({ events, onAdd, onRemove }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toKey(today.getFullYear(), today.getMonth(), today.getDate()));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', location: '', type: 'client', product: '', notes: '' });
  const [formError, setFormError] = useState('');

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function changeMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  function submit() {
    if (!form.title.trim()) { setFormError('Give it a title first'); return; }
    setFormError('');
    onAdd({
      id: 'e-' + Date.now(),
      date: selectedDate,
      title: form.title.trim(),
      location: form.location.trim(),
      type: form.type,
      product: form.product || null,
      notes: form.notes.trim(),
      curated: false,
    });
    setForm({ title: '', location: '', type: 'client', product: '', notes: '' });
    setShowForm(false);
  }

  const dayEvents = eventsByDate[selectedDate] || [];
  const selectedDateObj = new Date(selectedDate + 'T00:00:00');
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div>
      <CyferBar greeting={greetingLine()} subline={dayStatusLine((eventsByDate[todayKey] || []).length)} />

      <div className="px-4 md:px-6 pb-10 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-semibold text-ink">Calendar</h1>
          <div className="flex items-center gap-1.5">
            <button onClick={() => changeMonth(-1)} aria-label="Previous month" className="p-1.5 rounded-lg hover:bg-mist-dim">
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium w-32 text-center">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button onClick={() => changeMonth(1)} aria-label="Next month" className="p-1.5 rounded-lg hover:bg-mist-dim">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-xs text-ink-soft text-center py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-6">
          {cells.map((d, i) => {
            if (d === null) return <div key={'blank-' + i} />;
            const key = toKey(viewYear, viewMonth, d);
            const dayList = eventsByDate[key] || [];
            const isSelected = key === selectedDate;
            const isToday = key === todayKey;
            return (
              <button
                key={key}
                onClick={() => setSelectedDate(key)}
                className={
                  'aspect-square rounded-xl border text-sm flex flex-col items-center justify-start pt-1.5 gap-0.5 transition-colors ' +
                  (isSelected ? 'border-ink bg-ink text-mist' : 'border-mist-dim hover:border-teal/60 bg-paper')
                }
              >
                <span className={isToday && !isSelected ? 'font-semibold text-marigold' : ''}>{d}</span>
                <div className="flex gap-0.5">
                  {dayList.slice(0, 3).map(e => (
                    <span key={e.id} className={'w-1.5 h-1.5 rounded-full ' + TYPE_STYLES[e.type].dot} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-ink">
            {selectedDateObj.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          <button
            onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-mist-dim hover:bg-paper"
          >
            <Plus size={16} /> Add event
          </button>
        </div>

        {showForm && (
          <div className="mb-4 p-4 rounded-xl border border-mist-dim bg-paper">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">New event</span>
              <button onClick={() => setShowForm(false)} aria-label="Close"><X size={16} /></button>
            </div>
            <input
              className="w-full mb-2 px-3 py-2 rounded-lg border border-mist-dim text-sm bg-white"
              placeholder="Title"
              value={form.title}
              onChange={e => { setForm({ ...form, title: e.target.value }); if (formError) setFormError(''); }}
            />
            <input
              className="w-full mb-2 px-3 py-2 rounded-lg border border-mist-dim text-sm bg-white"
              placeholder="Location"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select
                className="px-3 py-2 rounded-lg border border-mist-dim text-sm bg-white"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                {Object.entries(TYPE_STYLES).map(([key, s]) => (
                  <option key={key} value={key}>{s.label}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 rounded-lg border border-mist-dim text-sm bg-white"
                value={form.product}
                onChange={e => setForm({ ...form, product: e.target.value })}
              >
                <option value="">No product tag</option>
                {PRODUCT_TAGS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <textarea
              className="w-full mb-2 px-3 py-2 rounded-lg border border-mist-dim text-sm bg-white"
              placeholder="Notes"
              rows={2}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
            {formError && <p className="text-sm text-rose mb-2">{formError}</p>}
            <button onClick={submit} className="px-4 py-2 rounded-lg bg-ink text-mist text-sm font-medium">Save event</button>
          </div>
        )}

        <div className="space-y-2">
          {dayEvents.length === 0 && !showForm && (
            <p className="text-sm text-ink-soft">Nothing planned for this day.</p>
          )}
          {dayEvents.map(e => {
            const style = TYPE_STYLES[e.type];
            const product = PRODUCT_TAGS.find(p => p.id === e.product);
            return (
              <div key={e.id} className={'p-3 rounded-xl border-none ring-1 ' + style.ring + ' ' + style.bg}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={'text-xs font-medium px-2 py-0.5 rounded-full ' + style.text + ' bg-white/60'}>
                        {style.label}
                      </span>
                      {product && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full text-ink bg-white/60">
                          {product.label}
                        </span>
                      )}
                      {e.curated && <span className="text-xs text-ink-soft">suggested</span>}
                    </div>
                    <p className="font-medium text-sm text-ink">{e.title}</p>
                    {e.location && (
                      <p className="text-xs text-ink-soft flex items-center gap-1 mt-0.5">
                        <MapPin size={12} /> {e.location}
                      </p>
                    )}
                    {e.notes && <p className="text-xs text-ink-soft mt-1">{e.notes}</p>}
                  </div>
                  <button onClick={() => onRemove(e.id)} aria-label="Remove event" className="text-ink-soft/60 hover:text-rose shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
