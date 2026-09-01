export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export const EVENTS_KEY = 'cyfer-events';
export const NOTES_KEY = 'cyfer-notes';

export const TYPE_STYLES = {
  networking: { label: 'Networking event', dot: 'bg-marigold', bg: 'bg-marigold-soft', text: 'text-ink', ring: 'ring-marigold/40' },
  farmer: { label: 'Community / hotspot visit', dot: 'bg-teal', bg: 'bg-teal-soft', text: 'text-ink', ring: 'ring-teal/40' },
  client: { label: 'Client meeting', dot: 'bg-sky', bg: 'bg-sky-soft', text: 'text-ink', ring: 'ring-sky/40' },
  personal: { label: 'Personal', dot: 'bg-rose', bg: 'bg-rose-soft', text: 'text-ink', ring: 'ring-rose/40' },
};

// General product-line tags for a Sanlam retail advisor's book of business.
// Kept broad on purpose — edit to match the exact product set you sell.
export const PRODUCT_TAGS = [
  { id: 'life', label: 'Life cover' },
  { id: 'funeral', label: 'Funeral cover' },
  { id: 'will', label: 'Will writing' },
  { id: 'medical', label: 'Medical aid / gap cover' },
  { id: 'invest', label: 'Savings & investment' },
  { id: 'retirement', label: 'Retirement annuity' },
];

// Approximate Upington coordinates — nudge these to the real pin for each stop.
const UPINGTON = { lat: -28.4478, lng: 21.2561 };

export const SEED_EVENTS = [
  {
    id: 'seed-1',
    date: isoIn(9),
    title: 'BNI Grow Your Business Network',
    location: 'Desert Palace Hotel and Casino, Upington',
    type: 'networking',
    product: 'invest',
    notes: '08:00–10:00. Business networking launch event for the Northern Cape — good spot to open conversations with small business owners about retirement and investment cover.',
    lat: UPINGTON.lat + 0.004,
    lng: UPINGTON.lng + 0.006,
    curated: true,
  },
];

export const SEED_NOTES = [
  {
    id: 'note-seed-1',
    title: 'Client follow-ups this week',
    body: 'Two families still need to sign off on beneficiary nominations before their will drafts can be finalised. Chase before Friday.',
    tag: 'will',
    pinned: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
  },
];

function isoIn(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toKey(d.getFullYear(), d.getMonth(), d.getDate());
}

export function toKey(y, m, d) {
  return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}

export function loadEvents() {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : SEED_EVENTS;
  } catch {
    return SEED_EVENTS;
  }
}

export function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : SEED_NOTES;
  } catch {
    return SEED_NOTES;
  }
}

// --- Cyfer's voice -----------------------------------------------------
// Small, deterministic personality logic — no external calls, just enough
// variation that Cyfer reads like she's paying attention to your day.

const MORNING_LINES = [
  "Morning. Let's see what today's carrying.",
  "Up and at it — here's the shape of your day.",
  "Good morning. Coffee first, then the calendar.",
];
const AFTERNOON_LINES = [
  "Afternoon check-in — here's where things stand.",
  "Halfway through. Here's what's still ahead.",
];
const EVENING_LINES = [
  "Evening. Good time to plan tomorrow while it's fresh.",
  "Winding down — want to get ahead of tomorrow?",
];

export function greetingLine() {
  const hour = new Date().getHours();
  const pool = hour < 12 ? MORNING_LINES : hour < 17 ? AFTERNOON_LINES : EVENING_LINES;
  const dayIndex = new Date().getDate();
  return pool[dayIndex % pool.length];
}

export function dayStatusLine(count) {
  if (count === 0) return "Nothing on the books yet — a good day to prep or prospect.";
  if (count === 1) return "One stop today. Make it count.";
  if (count <= 3) return `${count} stops today. Tight but doable.`;
  return `${count} stops today — busy one. Pace yourself between visits.`;
}

export function notesEmptyLine() {
  const lines = [
    "Nothing written down yet. If a client mentioned it, it's worth keeping.",
    "Empty page. Jot down what you don't want to forget by Friday.",
  ];
  return lines[new Date().getDate() % lines.length];
}
