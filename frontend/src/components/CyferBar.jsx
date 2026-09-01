import React from 'react';
import CyferAvatar from './CyferAvatar.jsx';

export default function CyferBar({ greeting, subline }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-6">
      <CyferAvatar size={44} />
      <div className="min-w-0">
        <p className="font-display text-lg md:text-xl text-ink leading-tight truncate">{greeting}</p>
        {subline && <p className="text-sm text-ink-soft leading-snug">{subline}</p>}
      </div>
    </div>
  );
}
