import React from 'react';

export default function CyferAvatar({ size = 40, pulse = true }) {
  return (
    <div
      className="relative shrink-0 rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(155deg, #2f6f6b 0%, #14302b 65%)',
      }}
    >
      <span
        className={'absolute inset-0 rounded-full ' + (pulse ? 'cyfer-pulse' : '')}
        style={{ background: 'radial-gradient(circle at 35% 30%, rgba(221,154,46,0.55), transparent 60%)' }}
      />
      <span
        className="relative font-display text-mist"
        style={{ fontSize: size * 0.42, lineHeight: 1 }}
      >
        C
      </span>
    </div>
  );
}
