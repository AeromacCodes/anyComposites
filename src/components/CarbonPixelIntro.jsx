import { useEffect, useRef, useState } from 'react';
import './CarbonPixelIntro.css';

/*
  Pixel carbon-fibre intro.
  Every pixel is one fibre tow with soft rounded shading, so the weave reads as
  carbon without any moving highlight. Tows alternate in a 2x2 twill. Phases:
    load     - pixels pop in at random positions until the weave is complete
    hold     - the finished weave stays for a beat
    dissolve - pixels drop out at random, revealing the page
  Plays once per session; skipped for reduced motion.
*/

const BUILD_MS = 1000;
const HOLD_MS = 250;
const DISSOLVE_MS = 650;
const TOTAL_MS = BUILD_MS + HOLD_MS + DISSOLVE_MS;
const SESSION_KEY = 'ac-intro-seen';

function shouldPlay() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return window.sessionStorage.getItem(SESSION_KEY) !== '1';
  } catch {
    return true;
  }
}

// One tow, pre-rendered: rounded shading across the tow + faint fibre lines along it
function makeTow(size, dpr, horizontal) {
  const px = Math.round(size * dpr);
  const tile = document.createElement('canvas');
  tile.width = px;
  tile.height = px;
  const g = tile.getContext('2d');

  const grad = horizontal ? g.createLinearGradient(0, 0, 0, px) : g.createLinearGradient(0, 0, px, 0);
  const edge = horizontal ? 'rgb(22,23,26)' : 'rgb(12,13,15)';
  const mid = horizontal ? 'rgb(46,48,53)' : 'rgb(24,25,29)';
  grad.addColorStop(0, edge);
  grad.addColorStop(0.5, mid);
  grad.addColorStop(1, edge);
  g.fillStyle = grad;
  g.fillRect(0, 0, px, px);

  // one faint fibre line along the tow
  const at = Math.round(px * 0.38);
  g.fillStyle = 'rgba(255,255,255,0.05)';
  if (horizontal) g.fillRect(0, at, px, Math.max(1, Math.round(dpr * 0.5)));
  else g.fillRect(at, 0, Math.max(1, Math.round(dpr * 0.5)), px);

  // seam between tows
  g.fillStyle = 'rgba(0,0,0,0.4)';
  g.fillRect(px - dpr, 0, dpr, px);
  g.fillRect(0, px - dpr, px, dpr);
  return tile;
}

// small deterministic hash -> 0..1
function rand(i, j, seed) {
  const s = Math.sin(i * 127.1 + j * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

export default function CarbonPixelIntro({ onComplete }) {
  const [play] = useState(shouldPlay);
  const [done, setDone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const canvasRef = useRef(null);
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  useEffect(() => {
    if (!play) {
      const t = window.setTimeout(() => doneRef.current?.(), 120);
      return () => window.clearTimeout(t);
    }

    try { window.sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const cell = W < 700 ? 16 : 24;
    const towH = makeTow(cell, dpr, true);
    const towV = makeTow(cell, dpr, false);
    const cols = Math.ceil(W / cell) + 1;
    const rows = Math.ceil(H / cell) + 1;

    // Precompute per-pixel data
    const cells = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        cells.push({
          x: c * cell,
          y: r * cell,
          horizontal: (c + r) % 4 < 2, // 2x2 twill
          appear: rand(c, r, 1) * 0.98, // random load order
          vanish: rand(c, r, 2) * 0.98, // random drop-out order
        });
      }
    }

    let raf;
    let notified = false;
    const t0 = performance.now();

    const draw = (now) => {
      const t = now - t0;
      ctx.clearRect(0, 0, W, H);

      const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
      const buildP = ease(Math.min(1, t / BUILD_MS));
      const dissolveP = ease(Math.max(0, Math.min(1, (t - BUILD_MS - HOLD_MS) / DISSOLVE_MS)));

      for (let k = 0; k < cells.length; k += 1) {
        const p = cells[k];
        if (buildP < p.appear) continue;
        if (dissolveP > p.vanish) continue;
        ctx.drawImage(p.horizontal ? towH : towV, p.x, p.y, cell, cell);
      }

      if (!notified && t >= BUILD_MS + HOLD_MS) {
        notified = true;
        setLeaving(true);
        root.style.overflow = prevOverflow;
        doneRef.current?.();
      }

      if (t < TOTAL_MS) raf = requestAnimationFrame(draw);
      else setDone(true);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      root.style.overflow = prevOverflow;
    };
  }, [play]);

  if (!play || done) return null;

  return (
    <div className={`cpx ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <canvas ref={canvasRef} className="cpx__canvas" />
    </div>
  );
}
