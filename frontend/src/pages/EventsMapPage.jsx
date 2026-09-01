import React, { useMemo, useState } from 'react';
import { MapPin, List, Map as MapIcon } from 'lucide-react';
import CyferBar from '../components/CyferBar.jsx';
import { TYPE_STYLES, PRODUCT_TAGS } from '../data.js';

const UPINGTON = { lat: -28.4478, lng: 21.2561 };

function mapEmbedUrl(lat, lng, spread = 0.02) {
  const bbox = [lng - spread, lat - spread, lng + spread, lat + spread].join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export default function EventsMapPage({ events }) {
  const upcoming = useMemo(
    () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
    [events]
  );
  const [selectedId, setSelectedId] = useState(upcoming[0]?.id ?? null);
  const [mobileView, setMobileView] = useState('list');

  const selected = upcoming.find(e => e.id === selectedId) || upcoming[0];
  const center = selected?.lat != null ? { lat: selected.lat, lng: selected.lng } : UPINGTON;

  return (
    <div>
      <CyferBar
        greeting="Events & map"
        subline={upcoming.length ? `${upcoming.length} on the schedule — tap one to see it on the map.` : 'Nothing scheduled yet.'}
      />

      {/* Mobile view toggle */}
      <div className="md:hidden flex px-4 gap-2 mb-3">
        <button
          onClick={() => setMobileView('list')}
          className={'flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border ' + (mobileView === 'list' ? 'bg-ink text-mist border-ink' : 'border-mist-dim text-ink-soft')}
        >
          <List size={15} /> List
        </button>
        <button
          onClick={() => setMobileView('map')}
          className={'flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border ' + (mobileView === 'map' ? 'bg-ink text-mist border-ink' : 'border-mist-dim text-ink-soft')}
        >
          <MapIcon size={15} /> Map
        </button>
      </div>

      <div className="md:flex md:h-[calc(100vh-96px)]">
        {/* List */}
        <div className={'md:w-[380px] md:shrink-0 md:overflow-y-auto md:border-r border-mist-dim px-4 md:px-5 pb-8 ' + (mobileView === 'map' ? 'hidden md:block' : 'block')}>
          <div className="space-y-2">
            {upcoming.length === 0 && (
              <p className="text-sm text-ink-soft">No events yet — add one from the Calendar tab.</p>
            )}
            {upcoming.map(e => {
              const style = TYPE_STYLES[e.type];
              const product = PRODUCT_TAGS.find(p => p.id === e.product);
              const isSelected = e.id === selected?.id;
              const dateLabel = new Date(e.date + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
              return (
                <button
                  key={e.id}
                  onClick={() => { setSelectedId(e.id); setMobileView('map'); }}
                  className={
                    'w-full text-left p-3 rounded-xl ring-1 transition-shadow ' +
                    style.bg + ' ' + (isSelected ? 'ring-2 ring-ink' : style.ring)
                  }
                >
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full text-ink bg-white/60">{dateLabel}</span>
                    <span className={'text-xs font-medium px-2 py-0.5 rounded-full bg-white/60 ' + style.text}>{style.label}</span>
                    {product && <span className="text-xs font-medium px-2 py-0.5 rounded-full text-ink bg-white/60">{product.label}</span>}
                  </div>
                  <p className="font-medium text-sm text-ink">{e.title}</p>
                  {e.location && (
                    <p className="text-xs text-ink-soft flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {e.location}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className={'flex-1 min-h-[320px] md:min-h-0 ' + (mobileView === 'list' ? 'hidden md:block' : 'block')}>
          {selected ? (
            <div className="h-full flex flex-col">
              <iframe
                title="Event location"
                className="w-full flex-1 min-h-[320px] border-0"
                src={mapEmbedUrl(center.lat, center.lng)}
              />
              <div className="px-4 py-3 bg-paper border-t border-mist-dim">
                <p className="text-sm font-medium text-ink">{selected.title}</p>
                {selected.location && <p className="text-xs text-ink-soft mt-0.5">{selected.location}</p>}
                {selected.lat == null && (
                  <p className="text-xs text-ink-soft/70 mt-1">No exact pin saved — showing Upington.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-ink-soft px-6 text-center">
              Add an event to see it on the map.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
