import { Car, Cross, Plane, ShieldCheck, Trophy, Instagram, Linkedin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { companyData } from './data/anyCompositesData';
import AboutPage from './AboutPage';
import SectorPage from './SectorPage';
import CareersPage from './CareersPage';
import SiteNavbar from './components/SiteNavbar';
import CookieConsent from './components/CookieConsent';
import ScrambleText from './components/ScrambleText';
import CarbonPixelIntro from './components/CarbonPixelIntro';
import HeroForge from './components/HeroForge';
import OurWork from './components/OurWork';
import ProcessSteps from './components/ProcessSteps';
import PixelReveal from './components/PixelReveal';

const sectors = [
  {
    id: 'aerospace',
    number: '01',
    name: 'AEROSPACE',
    tagline: 'UAV & AIRFRAME STRUCTURES',
    image: '/images/sector-aerospace.jpg',
    fallback: '/images/aerospace_uav.jpg',
    heading: 'LIGHTWEIGHT BY DESIGN. STRONG BY ENGINEERING.',
    description: 'High-performance composite structures engineered for unmanned systems and aerospace applications where strength, stiffness and reliability are mission critical.',
    capabilities: [
      'Fixed Wing & VTOL Monocoque Airframes',
      'High-Modulus Carbon Fiber Wing Spars',
      'Ultra-Light Aerodynamic Control Surfaces',
      'Internal Rib Structures & Weight Optimization'
    ],
    route: '#sector-aerospace'
  },
  {
    id: 'uav-defence',
    number: '02',
    name: 'UAV & DEFENCE',
    tagline: 'TACTICAL & SURVEILLANCE SYSTEMS',
    image: '/images/sector-uav-defence.jpg',
    imagePosition: '72% center',
    fallback: '/images/precision_composite_hardware.jpg',
    heading: 'ENGINEERED FOR EXTREME MISSION DEMANDS.',
    description: 'Advanced composite solutions for unmanned tactical systems, high-altitude surveillance, and ruggedized hardware built to withstand extreme environmental stress.',
    capabilities: [
      'Multi-Rotor Heavy-Lift Carbon Tubes & Arms',
      'Precision CNC Milled Carbon Fiber Plates',
      'Impact-Resistant Payload Mounts & Pods',
      'RF-Transparent Radomes & Enclosures'
    ],
    route: '#sector-uav-defence'
  },
  {
    id: 'automotive',
    number: '03',
    name: 'AUTOMOTIVE',
    tagline: 'MOTORSPORT & HIGH-PERFORMANCE MOBILITY',
    image: '/images/sector-automotive.jpg',
    fallback: '/images/hero_carbon_weave.jpg',
    heading: 'RACE-PROVEN RIGIDITY WITH WEIGHT REDUCTION.',
    description: 'Performance-driven CFRP components delivering maximum structural efficiency, low unsprung mass, and flawless cosmetic weaves for supercars and next-gen mobility.',
    capabilities: [
      'Monocoque Chassis Stiffeners & Structural Tubs',
      'Aerodynamic Front Splitters & Rear Diffusers',
      'Prepreg Carbon Fiber Exterior Body Shells',
      'Vibration-Damped Performance Hardware'
    ],
    route: '#sector-automotive'
  },
  {
    id: 'medical',
    number: '04',
    name: 'MEDICAL',
    tagline: 'PROSTHETICS & PRECISION BIOMEDICAL',
    image: '/images/sector-medical.jpg',
    fallback: '/images/portrait_composite_part.jpg',
    heading: 'BIO-COMPATIBLE & ERGONOMIC PRECISION.',
    description: 'Ultra-lightweight composites custom-tailored for dynamic prosthetics, surgical robotic arms, and medical imaging structures requiring X-ray radiolucency and fatigue durability.',
    capabilities: [
      'Dynamic Energy Return Prosthetic Running Blades',
      'X-Ray Radiolucent Patient Positioning Plates',
      'Ergonomic, Ultra-Light Surgical Robotics Arms',
      'Custom Biocompatible Orthotic Shells'
    ],
    route: '#sector-medical'
  },
  {
    id: 'sports',
    number: '05',
    name: 'SPORTS',
    tagline: 'ELITE ATHLETIC & RACING SYSTEMS',
    image: '/images/sector-sports.jpg',
    fallback: '/images/custom_sheets_tubes.jpg',
    heading: 'PRECISION, STIFFNESS & COMPETITIVE POWER.',
    description: 'Precision sporting composites delivering maximum energy transfer, structural resilience, and vibration damping for competitive athletes and high-performance equipment.',
    capabilities: [
      'High-Torsion Racket & Paddle Structural Cores',
      'Ultra-Rigid Competition Field Hockey Shafts',
      'Aerodynamic Bicycle Frames, Forks & Seat Posts',
      'Racing Boat Hydrodynamic Paddles & Oars'
    ],
    route: '#sector-sports'
  }
];

const products = [
  ['01', 'CFRP SHEETS', 'Twill / Plain Weave|Matte / Gloss Finish|Custom Thickness Options|Structural Grade', '/images/hero_carbon_weave.jpg'],
  ['02', 'GFRP SHEETS', 'Plain Weave|Corrosion Resistant|Custom Thickness Options|Lightweight & Durable', '/images/custom_sheets_tubes.jpg'],
  ['03', 'CFRP TUBES', 'ROUND / SQUARE / RECTANGULAR / HOLLOW|OD / ID Options|Variable Wall Thickness|High Rigidity|Lightweight Structures', '/images/precision_composite_hardware.jpg'],
  ['04', 'CFRP RODS', 'FULL / SOLID|Multiple Diameters|High Strength|Low Weight|Precision Tolerance', '/images/square_autoclave.jpg'],
  ['05', 'CNC CUT CFRP SHEETS', 'High Precision Cutting|Complex Geometries|Tight Tolerances|Custom Designs', '/images/custom_sheets_tubes.jpg'],
  ['06', 'COMPOSITE CONNECTORS', 'Lightweight Integration|Multi-Angle Configurations|Corrosion Resistant|Custom Solutions', '/images/portrait_composite_part.jpg'],
];

const KEEP_UPPER = new Set(['UAV', 'CNC', 'CFRP', 'GFRP', 'VTOL', 'RF']);
const titleCase = (text) => text.toLowerCase().replace(/[a-z]+/g, (w) => (KEEP_UPPER.has(w.toUpperCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)));
const sentenceCase = (text) => text.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (m, pre, c) => pre + c.toUpperCase());

const coreCapabilities = [
  { title: 'Material Engineering', description: 'Expertise in carbon fiber materials, pre-pregs, resins, and core materials.' },
  { title: 'Design & Engineering', description: 'Advanced CAD, CAE, and simulation-driven design for high-performance composite solutions.' },
  { title: 'Advanced Manufacturing', description: 'State-of-the-art processes including layup, infusion, prepreg, and autoclave molding.' },
  { title: 'Precision Machining', description: 'CNC machining, trimming, and drilling for tight tolerances and perfect finishing.' },
  { title: 'Quality Assurance', description: 'Rigorous testing and inspection to ensure consistent quality and performance.' },
  { title: 'Custom Solutions', description: 'End-to-end support from prototyping to production with tailored composite solutions.' },
];

const deliverables = [
  { title: 'Reduced Weight', description: 'Improve efficiency & performance' },
  { title: 'Enhanced Strength', description: 'Built for safety & durability' },
  { title: 'Better Efficiency', description: 'Optimize performance' },
  { title: 'Cost Optimization', description: 'Long-term value & savings' },
  { title: 'Sustainable Future', description: 'Eco-friendly composite solutions' },
];

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);
  const [heroTextReady, setHeroTextReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [capabilitiesVisible, setCapabilitiesVisible] = useState(false);
  const [productsVisible, setProductsVisible] = useState(false);
  const [activeSector, setActiveSector] = useState(0);
  const capabilitiesRef = useRef(null);
  const productsRef = useRef(null);
  const sectorsRunwayRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const runway = sectorsRunwayRef.current;
      if (!runway) return;

      const rect = runway.getBoundingClientRect();
      const scrollableDistance = runway.offsetHeight - window.innerHeight;
      if (scrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.min(Math.max(currentScroll / scrollableDistance, 0), 0.999);
      const index = Math.floor(progress * sectors.length);

      setActiveSector((prev) => (prev !== index ? index : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectorClick = (index) => {
    setActiveSector(index);
    const runway = sectorsRunwayRef.current;
    if (!runway) return;
    const rect = runway.getBoundingClientRect();
    const runwayTop = window.scrollY + rect.top;
    const scrollableDistance = runway.offsetHeight - window.innerHeight;
    const targetScroll = runwayTop + (index / (sectors.length - 1)) * scrollableDistance;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  useEffect(() => {
    const updateRoute = () => {
      const hash = window.location.hash;
      setRoute(hash);
      if (hash.startsWith('#sector-') || hash === '#about-us' || hash === '#careers') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } else if (hash === '#capabilities') {
        setTimeout(() => {
          const el = document.getElementById('capabilities');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else if (hash) {
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    };
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);
  useEffect(() => {
    const section = capabilitiesRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setCapabilitiesVisible(true); observer.disconnect(); } }, { threshold: 0.18 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const section = productsRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setProductsVisible(true); observer.disconnect(); } }, { threshold: 0.14 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  if (route === '#about-us') return <><AboutPage /><CookieConsent /></>;
  if (route === '#careers') return <><CareersPage /><CookieConsent /></>;
  if (route.startsWith('#sector-')) return <><SectorPage sector={route.slice(8)} /><CookieConsent /></>;
  return <div className="pdf-site">
    <CarbonPixelIntro onComplete={() => setIntroDone(true)} />
    <SiteNavbar />
    <main>
      <section id="home" className="pdf-hero">
        <HeroForge play={introDone} onFinish={() => setHeroTextReady(true)} />
        <div className="pdf-hero-inner">
          <h1 className={`hero-statement ${heroTextReady ? 'is-animated' : ''}`}>
            <div className="line-wrapper">
              <span className="hero-line hero-line-1">
                <ScrambleText play={heroTextReady} segments="Weaving" />
              </span>
            </div>
            <div className="line-wrapper">
              <span className="hero-line hero-line-2">
                <ScrambleText
                  play={heroTextReady}
                  delay={260}
                  segments={[{ text: 'ideas into ' }, { text: 'shapes', as: 'em' }]}
                />
              </span>
            </div>
          </h1>
          <div className={`hero-desc-wrapper ${heroTextReady ? 'is-animated' : ''}`}>
            <p className="pdf-description">
              <span className="hero-desc-line">
                <ScrambleText play={heroTextReady} delay={850} stagger={18} scramble={300} segments="Precision made for" />
              </span>
              <span className="hero-desc-line">
                <ScrambleText play={heroTextReady} delay={1050} stagger={18} scramble={300} segments="high-performance applications." />
              </span>
            </p>
          </div>
        </div>
      </section>
      <section id="capabilities" ref={capabilitiesRef} className={`pdf-capabilities-section ${capabilitiesVisible ? 'is-visible' : ''}`}>
        <div className="capabilities-intro-bar">
          <div className="sectors-lineup" aria-hidden="true">
            <img src="/images/sectors-lineup.png" alt="" />
          </div>
          <div className="capabilities-heading">
            <span className="capabilities-kicker">Sectors</span>
            <h2>ENGINEERED<br /><em>ACROSS</em><br />INDUSTRIES.</h2>
          </div>
          <p className="pdf-capabilities-description">
            High-performance composite solutions engineered to meet the unique demands of the world&apos;s most challenging applications.
          </p>
        </div>

        {/* Pinned scroll runway: sectors update in the exact same frame */}
        <div ref={sectorsRunwayRef} className="sectors-runway">
          <div className="sectors-sticky-stage">
            {/* Ironova-style process layout */}

            <nav className="wp-tabs" aria-label="Sectors">
              {sectors.map((s, index) => (
                <button
                  type="button"
                  key={s.id}
                  className={`wp-tab ${activeSector === index ? 'is-active' : ''}`}
                  onClick={() => handleSectorClick(index)}
                  aria-current={activeSector === index ? 'true' : undefined}
                >
                  <span className="wp-tab__step">Sector {s.number}</span>
                  <span className="wp-tab__name">{titleCase(s.name)}</span>
                </button>
              ))}
            </nav>

            <div className="wp-stage" key={sectors[activeSector].id}>
              <div className="wp-number" aria-hidden="true">{sectors[activeSector].number}</div>
              <div className="wp-name">{titleCase(sectors[activeSector].name)}</div>

              <div className="wp-body">
                <a href={sectors[activeSector].route} className="wp-media" aria-label={`Explore ${titleCase(sectors[activeSector].name)}`}>
                  <img
                    src={sectors[activeSector].image}
                    style={{ objectPosition: sectors[activeSector].imagePosition || 'center' }}
                    alt=""
                    onError={(e) => { const fb = sectors[activeSector].fallback; if (fb && !e.currentTarget.src.endsWith(fb)) e.currentTarget.src = fb; }}
                  />
                  <PixelReveal />
                </a>

                <div className="wp-copy">
                  <div>
                    <h3 className="wp-title">{sentenceCase(sectors[activeSector].heading)}</h3>
                    <p className="wp-desc">{sectors[activeSector].description}</p>
                    <a href={sectors[activeSector].route} className="wp-link">
                      Explore {titleCase(sectors[activeSector].name)} <span aria-hidden="true">→</span>
                    </a>
                  </div>
                  <ul className="wp-tags">
                    {sectors[activeSector].capabilities.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="manufacturing" className="manufacturing-capabilities" aria-labelledby="manufacturing-capabilities-title">
        <div className="manufacturing-capabilities__header">
          <span>Capabilities</span>
          <h2 id="manufacturing-capabilities-title">MANUFACTURING <i>&amp; MACHINE</i> CAPABILITIES</h2>
          <p>End-to-end composite manufacturing and precision machining capabilities to deliver high-performance, reliable, and customized solutions.</p>
        </div>
        <div className="mc-core">
          <h3 className="mc-sub">Our process</h3>
          <ProcessSteps />
        </div>
        <figure className="mc-feature">
          <img src="/images/about-factory-hero.png" alt="Composite manufacturing facility" />
          <figcaption>
            <span>From concept to production</span>
            <p>A wide range of composite materials and engineered components, tailored to the demands of every industry we serve.</p>
          </figcaption>
        </figure>
        <div className="mc-deliver">
          <h3 className="mc-sub">What we deliver</h3>
          <ul>
            {deliverables.map(({ title, description }) => (
              <li key={title}><strong>{title}</strong><span>{description}</span></li>
            ))}
          </ul>
        </div>
      </section>
      <section id="products" ref={productsRef} className={`pdf-products product-catalogue ${productsVisible ? 'is-visible' : ''}`}>
        <header className="product-catalogue-heading"><div><span>Products</span><h2>Standard range</h2></div><p>Carbon and glass fibre sheets, tubes, rods and connectors, supplied to size for prototypes, production runs and machined parts.</p></header>
        <div className="pc-grid">
          {products.map(([number, name, features, image]) => (
            <article className="pc-item" key={name}>
              <a href="#contact" className="pc-media" aria-label={`Request a specification for ${titleCase(name)}`}>
                <img
                  src={`/images/product-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`}
                  alt=""
                  loading="lazy"
                  onError={(e) => { if (!e.currentTarget.src.endsWith(image)) e.currentTarget.src = image; }}
                />
              </a>
              <div className="pc-head"><h3>{titleCase(name)}</h3><span>{number}</span></div>
              <ul className="pc-specs">
                {features.split('|').map((feature) => <li key={feature}>{feature === feature.toUpperCase() ? titleCase(feature) : feature}</li>)}
              </ul>
              <a href="#contact" className="pc-link">Request specification <span aria-hidden="true">→</span></a>
            </article>
          ))}
        </div>
      </section>
      <OurWork />
      <section id="contact" className="pdf-contact">
        <div className="contact-cta-row"><div><span>Contact</span><h2>Have a part<br />in mind?</h2></div><div><p>Tell us about your next composite programme. Our team will help define the right material, process and performance specification.</p><a className="contact-primary" href={`mailto:${companyData.contact.email}`}>Email our engineers <span>→</span></a></div></div>
        <div className="contact-footer-content">
          <form className="footer-enquiry" onSubmit={(event) => event.preventDefault()}><h3>Project enquiry</h3><input type="text" name="name" placeholder="Your name" aria-label="Your name" required /><input type="email" name="email" placeholder="Work email" aria-label="Work email" required /><textarea name="project" placeholder="Project brief" aria-label="Project brief" required /><button type="submit">Send enquiry <span>→</span></button></form>
          <div className="contact-identity"><div className="contact-brand"><span>anycomposites</span></div><p>Advanced composite engineering and manufacturing for high-performance applications.</p><a href={`mailto:${companyData.contact.email}`}>{companyData.contact.email}</a><a href={`tel:${companyData.contact.phone.replaceAll(' ', '')}`}>{companyData.contact.phone}</a></div>
          <div className="footer-quick-links"><div><h3>Company</h3><a href="#about-us">About us</a><a href="#capabilities">Our capabilities</a><a href="#careers">Careers</a><a href="#contact">Contact us</a></div><div><h3>Industries</h3><a href="#sector-aerospace">Aerospace</a><a href="#sector-uav-defence">UAV &amp; Defence</a><a href="#sector-automotive">Automotive</a><a href="#sector-medical">Medical</a><a href="#sector-sports">Sports</a></div></div>
          <div className="contact-social"><div className="social-links"><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={19} /></a><a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={19} /></a></div><address>{companyData.contact.hq.address}</address></div>
        </div>
        <p className="contact-copyright">© {new Date().getFullYear()} {companyData.legalName}. All rights reserved.</p>
      </section>
    </main>
    <CookieConsent />
  </div>;
}
