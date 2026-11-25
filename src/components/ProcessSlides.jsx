import { useEffect, useState } from 'react';
import './ProcessSlides.css';

/*
  Image transition through the four process steps.
  Each step has its own image slot (public/images/process-*.jpg);
  until that file exists, the fallback image is shown.
*/

const STEPS = [
  {
    title: 'Design & Engineering',
    description: 'Advanced CAD, CAE, and simulation-driven design for high-performance composite solutions.',
    image: '/images/process-design.jpg',
    fallback: '/images/hero_carbon_weave.jpg',
  },
  {
    title: 'Advanced Manufacturing',
    description: 'Layup, infusion, prepreg, and autoclave molding.',
    image: '/images/process-manufacturing.jpg',
    fallback: '/images/square_autoclave.jpg',
  },
  {
    title: 'Precision Machining',
    description: 'CNC machining, trimming, and drilling for tight tolerances and perfect finishing.',
    image: '/images/process-machining.jpg',
    fallback: '/images/precision_composite_hardware.jpg',
  },
  {
    title: 'Quality Assurance',
    description: 'Rigorous testing and inspection to ensure consistent quality and performance.',
    image: '/images/process-quality.jpg',
    fallback: '/images/portrait_composite_part.jpg',
  },
];

const INTERVAL_MS = 5000;

export default function ProcessSlides() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setActive((i) => (i + 1) % STEPS.length), INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [active]);

  return (
    <div className="ps">
      <div className="ps-stage">
        {STEPS.map((step, i) => (
          <img
            key={step.title}
            src={step.image}
            alt={step.title}
            className={`ps-img ${i === active ? 'is-active' : ''}`}
            onError={(e) => { if (!e.currentTarget.src.endsWith(step.fallback)) e.currentTarget.src = step.fallback; }}
          />
        ))}
        <div className="ps-caption" key={active}>
          <h4>{STEPS[active].title}</h4>
          <p>{STEPS[active].description}</p>
        </div>
      </div>

      <div className="ps-steps">
        {STEPS.map((step, i) => (
          <button
            type="button"
            key={step.title}
            className={`ps-step ${i === active ? 'is-active' : ''}`}
            onClick={() => setActive(i)}
          >
            <span className="ps-step__bar"><span key={i === active ? active : 'idle'} /></span>
            {step.title}
          </button>
        ))}
      </div>
    </div>
  );
}
