import { ArrowUpRight } from 'lucide-react';
import { animate, stagger } from 'animejs';
import { useEffect, useRef } from 'react';
import SiteNavbar from './components/SiteNavbar';
import CookieConsent from './components/CookieConsent';

const sectorData = {
  aerospace: {
    label: '01 // UAV & AEROSPACE',
    title: <>UAV AND<br /><em>AEROSPACE</em><br />STRUCTURES.</>,
    statement: <>LIGHTWEIGHT BY DESIGN.<br />STRONG BY ENGINEERING.</>,
    intro: 'High-performance composite structures engineered for unmanned systems and aerospace applications where strength, stiffness and reliability are mission critical.',
    image: '/images/aerospace_uav.jpg',
    solutions: [
      ['FIXED WING STRUCTURES', 'Wings|Fuselage|Tail Assemblies|Wing Spars|Aerodynamic Shells'],
      ['VTOL STRUCTURES', 'Monocoque Frames|Integrated Composite Bodies|Structural Arms|Payload Structures'],
      ['MULTIROTOR SYSTEMS', 'Tubes & Arms|CNC Carbon Plates|Landing Structures|Payload Mounts'],
      ['ADVANCED AEROSTRUCTURES', 'Lightweight Panels|Structural Reinforcements|Internal Rib Structures|Weight Optimized Assemblies']
    ],
    advantages: [
      { title: 'ULTRA LIGHTWEIGHT', description: 'Better endurance. Higher payload capacity.' },
      { title: 'HIGH STRENGTH', description: 'Impact resistant. Built for extreme operating environments.' },
      { title: 'PRECISION ENGINEERED', description: 'Tight tolerances (±0.05mm). Perfect fit and finish.' },
      { title: 'AERODYNAMIC OPTIMIZATION', description: 'Optimized shapes. Reduced aerodynamic drag.' },
      { title: 'CUSTOMIZABLE MATRIX', description: 'Application specific prepreg and autoclave solutions.' }
    ]
  },
  'uav-defence': {
    label: '02 // UAV & DEFENCE',
    title: <>UAV &amp;<br /><em>DEFENCE</em><br />SYSTEMS.</>,
    statement: <>TACTICAL RESILIENCE.<br />MISSION-CRITICAL PERFORMANCE.</>,
    intro: 'Advanced composite solutions for unmanned tactical systems, high-altitude surveillance, and ruggedized hardware built to withstand extreme environmental stress.',
    image: '/images/precision_composite_hardware.jpg',
    solutions: [
      ['TACTICAL AIRFRAMES', 'Long-Endurance Wings|Ruggedized Fuselage|Composite Enclosures'],
      ['SURVEILLANCE & RADOMES', 'RF-Transparent Radomes|Low-Loss Dielectric Panels|Electromagnetic Enclosures'],
      ['PAYLOAD HARDWARE', 'Heavy-Lift Multirotor Arms|Precision Milled CNC Plates|Payload Pods'],
      ['PROTECTIVE ENCLOSURES', 'Ballistic & Impact Shrouds|EMP Shielding Composites|Hermetic Housings']
    ],
    advantages: [
      { title: 'MIL-SPEC DURABILITY', description: 'Ruggedized composite matrix for extreme tactical demands.' },
      { title: 'RF TRANSPARENCY', description: 'Engineered resin systems for radar and communications systems.' },
      { title: 'PRECISION CNC MACHINING', description: 'Tight mechanical tolerances on 5-axis milled carbon components.' },
      { title: 'WEIGHT MINIMIZATION', description: 'Maximizes flight time, battery efficiency, and payload capacity.' },
      { title: 'ENVIRONMENTAL RESISTANCE', description: 'Impervious to saltwater, UV degradation, and thermal shock.' }
    ]
  },
  automotive: {
    label: '03 // AUTOMOTIVE',
    title: <>AUTOMOTIVE &amp;<br /><em>MOBILITY.</em></>,
    statement: <>ENGINEERED FOR THE ROAD.<br />DESIGNED FOR PERFORMANCE.</>,
    intro: 'High-performance composite solutions that deliver superior strength, reduced weight, and exceptional aesthetics for supercars and next-gen mobility.',
    image: '/images/sector-automotive.jpg',
    solutions: [
      ['EXTERIOR BODY PANELS', 'Lightweight Hoods & Roofs|Aerodynamic Surfaces|Impact Resistance|Flawless Class-A Weaves'],
      ['INTERIOR COMPONENTS', 'Prepreg Dash & Console Trim|Structural Seat Shells|Ergonomic Design|Gloss & Matte Finishes'],
      ['PERFORMANCE HARDWARE', 'Aerodynamic Front Splitters|Rear Wings & Diffusers|Chassis Bracing|Suspension Arms'],
      ['MOTORCYCLE COMPONENTS', 'Monocoque Bodywork|Fairings & Fenders|Vibration-Damped Brackets|Exhaust Heat Shields'],
      ['PROTECTIVE EQUIPMENT', 'Crash Absorbing Structures|Structural Battery Enclosures|Thermal Insulation']
    ],
    advantages: [
      { title: 'AERODYNAMIC EFFICIENCY', description: 'Wind-tunnel tested contour precision and reduced drag.' },
      { title: 'CLASS-A COSMETIC FINISH', description: 'Mirror-depth gloss or satin clear coats over flawless 3K weave.' },
      { title: 'STRUCTURAL STIFFNESS', description: 'High flexural rigidity with dramatic unsprung weight reduction.' },
      { title: 'BESPOKE MANUFACTURING', description: 'From prototype tooling to serialized autoclave production.' }
    ]
  },
  medical: {
    label: '04 // MEDICAL',
    title: <>MEDICAL<br /><em>COMPOSITES.</em></>,
    statement: <>CUSTOM COMPOSITES.<br />FOR ADVANCED MEDICAL DEVICES.</>,
    intro: 'Custom composites for high-performance prosthetics, surgical robotic arms, and advanced diagnostic medical imaging devices.',
    image: '/images/portrait_composite_part.jpg',
    solutions: [
      ['PROSTHETIC SYSTEMS', 'Dynamic Energy-Return Running Blades|High-Stiffness Pylons|Custom Orthotic Sockets'],
      ['SURGICAL ROBOTICS', 'Lightweight Robotic Arms|Vibration-Free Extremities|High-Precision Manipulators'],
      ['DIAGNOSTIC IMAGING', 'X-Ray Radiolucent Patient Beds|Targeting Plates|CT Headrests & Supports'],
      ['BIOMEDICAL INSTRUMENTS', 'Autoclave-Sterilizable Instrument Handles|Lightweight Mobile Cart Frames']
    ],
    advantages: [
      { title: 'BIOCOMPATIBLE SURFACES', description: 'Certified inert resin systems safe for skin contact.' },
      { title: 'X-RAY RADIOLUCENCY', description: 'Zero attenuation and artifact-free imaging under X-rays & CT.' },
      { title: 'ERGONOMIC LIGHT WEIGHT', description: 'Dramatically reduces patient fatigue and robotic inertia.' },
      { title: 'FATIGUE LONGEVITY', description: 'Millions of load cycles without mechanical degradation.' }
    ]
  },
  sports: {
    label: '05 // SPORTS',
    title: <>HIGH-PERFORMANCE<br /><em>SPORTING SYSTEMS.</em></>,
    statement: <>ENGINEERED FOR<br />PEAK PERFORMANCE.</>,
    intro: 'Advanced composite solutions that deliver the ideal balance of strength, lightweight design and precision for championship athletic performance.',
    image: '/images/custom_sheets_tubes.jpg',
    solutions: [
      ['RACKET & PADDLE SPORTS', 'Competition Tennis & Squash Frames|Carbon Fiber Pickleball Paddles|High-Spin Cores'],
      ['HOCKEY EQUIPMENT', 'Field Hockey Sticks|Composite Shafts|Optimized Flex Points|Impact Protection'],
      ['CYCLING COMPONENTS', 'Monocoque Bike Frames|Aerodynamic Forks|Seat Posts|Wheel Rims & Handlebars'],
      ['WATER SPORTS', 'Hydrodynamic Racing Paddles|Kayak Oars|Foil Masts & Fuselages|Hull Reinforcements'],
      ['CUSTOM SPORTS PRODUCTS', 'OEM Manufacturing|Athletic Footwear Plates|Precision Helmets']
    ],
    advantages: [
      { title: 'HIGH STIFFNESS-TO-WEIGHT', description: 'Maximizes athletic energy transfer with minimum dead weight.' },
      { title: 'TUNED FLEX CHARACTERISTICS', description: 'Custom fiber layups calibrated for precise flex profiles.' },
      { title: 'VIBRATION DAMPING', description: 'Absorbs high-frequency impact shocks, protecting joints.' },
      { title: 'CORROSION RESISTANCE', description: 'Unaffected by sweat, moisture, UV rays, or chlorinated water.' }
    ]
  }
};

export default function SectorPage({ sector }) {
  const pageRef = useRef(null);
  const data = sectorData[sector] || sectorData.aerospace;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [sector]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const heroTargets = page.querySelectorAll('.sector-hero-content, .sector-hero-index');
    animate(heroTargets, { opacity: [0, 1], y: [34, 0], delay: stagger(130), duration: 900, ease: 'outExpo' });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const targets = entry.target.querySelectorAll('.sector-section-heading, .sector-solutions-grid article, .sector-advantages-heading, .sector-advantages > div > p');
      animate(targets, { opacity: [0, 1], y: [28, 0], delay: stagger(85), duration: 760, ease: 'outExpo' });
      observer.unobserve(entry.target);
    }), { threshold: 0.18 });
    page.querySelectorAll('.sector-solutions, .sector-advantages').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sector]);

  return (
    <div ref={pageRef} className="sector-page anime-motion">
      <SiteNavbar />
      <main>
        <section className={`sector-hero sector-hero--${sector}`} style={{ '--sector-image': `url(${data.image})` }}>
          <div className="sector-hero-content">
            <span className="sector-hero-badge">{data.label}</span>
            <h1>{data.title}</h1>
            <div className="sector-hero-bottom">
              <h2>{data.statement}</h2>
              <p>{data.intro}</p>
            </div>
            <div className="sector-hero-actions">
              <a href="#contact" className="sector-hero-cta">
                <span>REQUEST SPECIFICATION</span>
                <span className="cta-arrow">↗</span>
              </a>
              <a href="#capabilities" className="sector-hero-back">
                <span>← BACK TO ALL CAPABILITIES</span>
              </a>
            </div>
          </div>
          <p className="sector-hero-index">01 / 0{data.solutions.length}</p>
        </section>

        <section className="sector-solutions">
          <div className="sector-section-heading">
            <span>OUR SOLUTIONS</span>
            <h2>ENGINEERED FOR<br /><em>THE MISSION.</em></h2>
          </div>
          <div className="sector-solutions-grid">
            {data.solutions.map(([name, items], index) => (
              <article key={name}>
                <b>0{index + 1}</b>
                <h3>{name}</h3>
                <div>
                  {items.split('|').map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
                <ArrowUpRight aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="sector-advantages">
          <div className="sector-advantages-heading">
            <span>ENGINEERED ADVANTAGES</span>
            <p>Developed for critical systems where every gram, dimension and detail matters.</p>
          </div>
          <div>
            {data.advantages.map((item, index) => (
              <p key={item.title}>
                <b>0{index + 1}</b>
                <span>
                  {item.title}
                  <small>{item.description}</small>
                </span>
              </p>
            ))}
          </div>
        </section>
      </main>
      <CookieConsent />
    </div>
  );
}
