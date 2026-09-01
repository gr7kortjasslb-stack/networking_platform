import React from 'react';
import { CalendarDays, MapPinned, NotebookPen } from 'lucide-react';
import CyferAvatar from './CyferAvatar.jsx';

const TABS = [
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'events', label: 'Events & Map', icon: MapPinned },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
];

export default function NavShell({ active, onChange, children }) {
  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 border-r border-mist-dim bg-paper">
        <div className="flex items-center gap-2.5 px-5 py-6">
          <CyferAvatar size={36} pulse={false} />
          <div>
            <p className="font-display text-base text-ink leading-none">Cyfer</p>
            <p className="text-xs text-ink-soft mt-0.5">Your day planner</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ' +
                  (isActive ? 'bg-teal-soft text-ink' : 'text-ink-soft hover:bg-mist')
                }
              >
                <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <p className="px-5 py-4 text-xs text-ink-soft/80 border-t border-mist-dim">
          Mag Fam Proserve Group
        </p>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-paper border-t border-mist-dim flex items-stretch z-20">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={
                'flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium ' +
                (isActive ? 'text-teal' : 'text-ink-soft')
              }
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              {tab.label === 'Events & Map' ? 'Events' : tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
