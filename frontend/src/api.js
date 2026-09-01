const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${options.method || 'GET'} ${path} failed: ${res.status} ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getEvents: () => request('/events'),
  createEvent: event => request('/events', { method: 'POST', body: JSON.stringify(event) }),
  deleteEvent: id => request(`/events/${id}`, { method: 'DELETE' }),

  getNotes: () => request('/notes'),
  createNote: note => request('/notes', { method: 'POST', body: JSON.stringify(note) }),
  updateNote: (id, patch) => request(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteNote: id => request(`/notes/${id}`, { method: 'DELETE' }),
};
