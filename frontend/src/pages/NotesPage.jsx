import React, { useState } from 'react';
import { Plus, Trash2, Pin, X } from 'lucide-react';
import CyferBar from '../components/CyferBar.jsx';
import { PRODUCT_TAGS, notesEmptyLine } from '../data.js';

export default function NotesPage({ notes, onAdd, onRemove, onTogglePin }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', tag: '' });
  const [formError, setFormError] = useState('');

  function submit() {
    if (!form.body.trim()) { setFormError('Write something first'); return; }
    setFormError('');
    onAdd({
      id: 'note-' + Date.now(),
      title: form.title.trim(),
      body: form.body.trim(),
      tag: form.tag || null,
      pinned: false,
      createdAt: Date.now(),
    });
    setForm({ title: '', body: '', tag: '' });
    setShowForm(false);
  }

  const sorted = [...notes].sort((a, b) => (b.pinned - a.pinned) || (b.createdAt - a.createdAt));

  return (
    <div>
      <CyferBar
        greeting="Personal notes"
        subline="Things worth remembering, in your own words."
      />

      <div className="px-4 md:px-6 pb-10 max-w-2xl">
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-mist-dim hover:bg-paper"
          >
            <Plus size={16} /> Add note
          </button>
        </div>

        {showForm && (
          <div className="mb-4 p-4 rounded-xl border border-mist-dim bg-paper">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">New note</span>
              <button onClick={() => setShowForm(false)} aria-label="Close"><X size={16} /></button>
            </div>
            <input
              className="w-full mb-2 px-3 py-2 rounded-lg border border-mist-dim text-sm bg-white"
              placeholder="Title (optional)"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full mb-2 px-3 py-2 rounded-lg border border-mist-dim text-sm bg-white"
              placeholder="What's on your mind?"
              rows={3}
              value={form.body}
              onChange={e => { setForm({ ...form, body: e.target.value }); if (formError) setFormError(''); }}
            />
            <select
              className="w-full mb-2 px-3 py-2 rounded-lg border border-mist-dim text-sm bg-white"
              value={form.tag}
              onChange={e => setForm({ ...form, tag: e.target.value })}
            >
              <option value="">No tag</option>
              {PRODUCT_TAGS.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            {formError && <p className="text-sm text-rose mb-2">{formError}</p>}
            <button onClick={submit} className="px-4 py-2 rounded-lg bg-ink text-mist text-sm font-medium">Save note</button>
          </div>
        )}

        <div className="space-y-2">
          {sorted.length === 0 && !showForm && (
            <p className="text-sm text-ink-soft">{notesEmptyLine()}</p>
          )}
          {sorted.map(n => {
            const tag = PRODUCT_TAGS.find(p => p.id === n.tag);
            return (
              <div key={n.id} className="p-3 rounded-xl border border-mist-dim bg-paper">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {tag && <span className="text-xs font-medium px-2 py-0.5 rounded-full text-ink bg-mist">{tag.label}</span>}
                      <span className="text-xs text-ink-soft">
                        {new Date(n.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    {n.title && <p className="font-medium text-sm text-ink">{n.title}</p>}
                    <p className="text-sm text-ink-soft mt-0.5 whitespace-pre-wrap">{n.body}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onTogglePin(n.id)}
                      aria-label={n.pinned ? 'Unpin note' : 'Pin note'}
                      className={n.pinned ? 'text-marigold' : 'text-ink-soft/60 hover:text-marigold'}
                    >
                      <Pin size={14} fill={n.pinned ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={() => onRemove(n.id)} aria-label="Delete note" className="text-ink-soft/60 hover:text-rose">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
