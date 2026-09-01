import React, { useEffect, useState } from 'react';
import NavShell from './components/NavShell.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import EventsMapPage from './pages/EventsMapPage.jsx';
import NotesPage from './pages/NotesPage.jsx';
import { EVENTS_KEY, NOTES_KEY, loadEvents, loadNotes } from './data.js';

function App() {
  const [tab, setTab] = useState('calendar');
  const [events, setEvents] = useState(loadEvents);
  const [notes, setNotes] = useState(loadNotes);

  useEffect(() => {
    try { localStorage.setItem(EVENTS_KEY, JSON.stringify(events)); } catch { /* storage unavailable */ }
  }, [events]);

  useEffect(() => {
    try { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); } catch { /* storage unavailable */ }
  }, [notes]);

  function addEvent(e) { setEvents(prev => [...prev, e]); }
  function removeEvent(id) { setEvents(prev => prev.filter(e => e.id !== id)); }

  function addNote(n) { setNotes(prev => [...prev, n]); }
  function removeNote(id) { setNotes(prev => prev.filter(n => n.id !== id)); }
  function toggleNotePin(id) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  }

  return (
    <NavShell active={tab} onChange={setTab}>
      {tab === 'calendar' && <CalendarPage events={events} onAdd={addEvent} onRemove={removeEvent} />}
      {tab === 'events' && <EventsMapPage events={events} />}
      {tab === 'notes' && <NotesPage notes={notes} onAdd={addNote} onRemove={removeNote} onTogglePin={toggleNotePin} />}
    </NavShell>
  );
}

export default App;
