import { useEffect, useRef, useState } from 'react';
import './ProcessSteps.css';

/*
  Four process steps, stacked vertically and linked by a centre line.
  Step 1: image left / text right, step 2: flipped, and so on.
  As you scroll, the line fills, each step's marker lights up when reached,
  and each step reveals (image wipes in, text rises) when it enters view.
  Each step has its own image slot (public/images/process-*.jpg);
  until that file exists, the fallback image is shown.
*/

const STEPS = [
  {
    title: 'Design & Engineering',
    description: 'Advanced CAD, CAE, and simulation-driven design for high-performance composite solutions.',
    points: ['CAD & CAE modelling', 'Laminate & structural simulation', 'Design for manufacture', 'Tooling & mould design'],
    image: '/images/process-design.jpg',
    fallback: '/images/hero_carbon_weave.jpg',
  },
  {
    title: 'Advanced Manufacturing',
    description: 'Layup, infusion, prepreg, and autoclave moulding for consistent, high-strength parts.',
    points: ['Precision hand layup', 'Vacuum infusion & RTM', 'Prepreg processing', 'Autoclave curing'],
    image: '/images/process-manufacturing.jpg',
    fallback: '/images/square_autoclave.jpg',
  },
  {
    title: 'Precision Machining',
    description: 'CNC machining, trimming, and drilling for tight tolerances and perfect finishing.',
    points: ['5-axis CNC machining', 'Waterjet cutting', 'Trimming & drilling', 'Bonding & assembly'],
    image: '/images/process-machining.jpg',
    fallback: '/images/precision_composite_hardware.jpg',
  },
  {
    title: 'Quality Assurance',
    description: 'Rigorous testing and inspection to ensure consistent quality and performance.',
    points: ['Ultrasonic NDT inspection', 'CMM dimensional checks', 'Mechanical testing', 'Full material traceability'],
    image: '/images/process-quality.jpg',
    fallback: '/images/portrait_composite_part.jpg',
  },
];

export default function ProcessSteps() {
  const listRef = useRef(null);
  const [seen, setSeen] = useState(() => STEPS.map(() => false));
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const rows = Array.from(list.children).filter((el) => el.classList.contains('pst-row'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const mid = window.innerHeight * 0.55;
      const box = list.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (mid - box.top) / box.height));
      list.style.setProperty('--pst-progress', progress.toFixed(4));

      let last = -1;
      const nextSeen = rows.map((row, i) => {
        const r = row.getBoundingClientRect();
        if (r.top + r.height / 2 <= mid) last = i;
        return r.top < window.innerHeight * 0.85;
      });
      setReached(last);
      setSeen((prev) => (prev.every((v, i) => v === (v || nextSeen[i])) ? prev : prev.map((v, i) => v || nextSeen[i])));
    };

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ol className="pst" ref={listRef}>
      {STEPS.map((step, i) => (
        <li
          key={step.title}
          className={`pst-row ${i % 2 ? 'is-flipped' : ''} ${seen[i] ? 'is-in' : ''} ${i <= reached ? 'is-reached' : ''}`}
        >
          <div className="pst-media">
            <img
              src={step.image}
              alt={step.title}
              onError={(e) => { if (!e.currentTarget.src.endsWith(step.fallback)) e.currentTarget.src = step.fallback; }}
            />
          </div>
          <div className="pst-copy">
            <span className="pst-step">Step {String(i + 1).padStart(2, '0')}</span>
            <h4>{step.title}</h4>
            <p>{step.description}</p>
            <ul>
              {step.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
