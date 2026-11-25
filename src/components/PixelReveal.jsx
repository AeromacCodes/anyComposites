import { useMemo } from 'react';

/*
  Dark pixel grid laid over an image; each cell disappears at a random
  moment, so the image "loads" in random pixel blocks. Remount (key) to replay.
*/
const COLS = 14;
const ROWS = 14;
const DURATION = 0.9; // seconds over which cells drop out

export default function PixelReveal() {
  const delays = useMemo(
    () => Array.from({ length: COLS * ROWS }, () => (Math.random() * DURATION).toFixed(3)),
    []
  );

  return (
    <span className="px-reveal" aria-hidden="true" style={{ '--px-cols': COLS, '--px-rows': ROWS }}>
      {delays.map((d, i) => (
        <span key={i} style={{ animationDelay: `${d}s` }} />
      ))}
    </span>
  );
}
