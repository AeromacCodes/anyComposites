import { useEffect, useMemo, useRef, useState } from 'react';

/*
  Anduril-style "decode" text reveal.
  Characters appear left → right; each one cycles through random glyphs
  for a short burst before locking into its final character.

  Props:
    segments  – string, or array of { text, className?, as? } (e.g. to wrap a word in <em>)
    play      – start the animation when true
    delay     – ms before the first character starts
    stagger   – ms between each character starting
    scramble  – ms each character spends scrambling before it settles
    tick      – ms between glyph swaps while scrambling
    onDone    – called once all characters have settled
*/
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// match the case of the final character so lowercase text scrambles in lowercase
const randomGlyph = (target) => {
  const g = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  return target && target === target.toLowerCase() && target !== target.toUpperCase() ? g.toLowerCase() : g;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function ScrambleText({
  segments,
  play = true,
  delay = 0,
  stagger = 32,
  scramble = 360,
  tick = 55,
  onDone,
  className = '',
}) {
  const parts = useMemo(
    () => (typeof segments === 'string' ? [{ text: segments }] : segments),
    [segments],
  );
  const fullText = parts.map((p) => p.text).join('');
  const total = fullText.length;

  // elapsed ms: null = not started (all hidden), Infinity = finished
  const [elapsed, setElapsed] = useState(null);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!play) return undefined;

    if (prefersReducedMotion()) {
      setElapsed(Infinity);
      if (!doneRef.current) { doneRef.current = true; onDoneRef.current?.(); }
      return undefined;
    }

    const endTime = delay + (total - 1) * stagger + scramble;
    let raf;
    let start;
    let lastTick = -Infinity;

    const step = (now) => {
      if (start === undefined) start = now;
      const t = now - start;

      if (t >= endTime) {
        setElapsed(Infinity);
        if (!doneRef.current) { doneRef.current = true; onDoneRef.current?.(); }
        return;
      }
      // only re-render on glyph ticks so scrambling doesn't flicker every frame
      if (t - lastTick >= tick) {
        lastTick = t;
        setElapsed(t);
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [play, delay, stagger, scramble, tick, total]);

  const renderChar = (char, globalIndex) => {
    if (char === ' ') return ' ';
    if (elapsed === Infinity) return char;

    const startAt = delay + globalIndex * stagger;
    if (elapsed === null || elapsed < startAt) {
      // not yet reached – keep layout space but stay invisible
      return <span key={globalIndex} className="scramble-char is-hidden">{char}</span>;
    }
    if (elapsed < startAt + scramble) {
      return <span key={globalIndex} className="scramble-char is-scrambling">{randomGlyph(char)}</span>;
    }
    return char;
  };

  let cursor = 0;
  return (
    <span className={`scramble-text ${className}`} aria-label={fullText}>
      <span aria-hidden="true">
        {parts.map((part, pi) => {
          const Tag = part.as || 'span';
          const chars = part.text.split('').map((c) => renderChar(c, cursor++));
          return <Tag key={pi} className={part.className}>{chars}</Tag>;
        })}
      </span>
    </span>
  );
}
