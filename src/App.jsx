import { Car, Cross, Plane, ShieldCheck, Trophy, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { companyData } from './data/anyCompositesData';
import AboutPage from './AboutPage';
import SectorPage from './SectorPage';
import CareersPage from './CareersPage';

const industries = [
  ['AEROSPACE', 'Lightweight structures for aircraft components and systems.', Plane, '/images/aerospace_uav.jpg'],
  ['UAV & DEFENCE', 'Advanced composite solutions for unmanned systems and tactical applications.', ShieldCheck, '/images/aerospace_uav.jpg'],
  ['AUTOMOTIVE', 'Performance-driven composites for high-performance and next-gen mobility.', Car, '/images/precision_composite_hardware.jpg'],
  ['MEDICAL', 'Custom composites for prosthetics and advanced medical devices.', Cross, '/images/portrait_composite_part.jpg'],
  ['SPORTS', 'Engineered for precision, strength and competitive performance.', Trophy, '/images/custom_sheets_tubes.jpg'],
];
const products = [
  ['01', 'CFRP SHEETS', 'Twill / Plain Weave|Matte / Gloss Finish|Custom Thickness Options|Structural Grade', '/images/custom_sheets_tubes.jpg'],
  ['02', 'GFRP SHEETS', 'Plain Weave|Corrosion Resistant|Custom Thickness Options|Lightweight & Durable', '/images/custom_sheets_tubes.jpg'],
  ['03', 'CFRP TUBES', 'ROUND / SQUARE / RECTANGULAR / HOLLOW|OD / ID Options|Variable Wall Thickness|High Rigidity|Lightweight Structures', '/images/precision_composite_hardware.jpg'],
  ['04', 'CFRP RODS', 'FULL / SOLID|Multiple Diameters|High Strength|Low Weight|Precision Tolerance', '/images/precision_composite_hardware.jpg'],
  ['05', 'CNC CUT CFRP SHEETS', 'High Precision Cutting|Complex Geometries|Tight Tolerances|Custom Designs', '/images/custom_sheets_tubes.jpg'],
  ['06', 'COMPOSITE CONNECTORS', 'Lightweight Integration|Multi-Angle Configurations|Corrosion Resistant|Custom Solutions', '/images/portrait_composite_part.jpg'],
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState(() => window.location.hash);
  useEffect(() => { const updateRoute = () => setRoute(window.location.hash); window.addEventListener('hashchange', updateRoute); return () => window.removeEventListener('hashchange', updateRoute); }, []);
  const closeMenu = () => setMenuOpen(false);
  if (route === '#about-us') return <AboutPage />;
  if (route === '#careers') return <CareersPage />;
  if (route.startsWith('#sector-')) return <SectorPage sector={route.slice(8)} />;
  return <div className="pdf-site">
    <header className="pdf-nav">
      <a href="#home" className="pdf-brand" onClick={closeMenu}><span className="pdf-logo">A</span><span className="pdf-brand-copy">ANY COMPOSITES<small>ADVANCED MATERIALS</small></span></a>
      <nav className={menuOpen ? 'pdf-links open' : 'pdf-links'}>
        <a href="#about-us" onClick={closeMenu}>ABOUT US</a><div className="pdf-capabilities-menu"><button type="button">CAPABILITIES</button><div className="pdf-capabilities-dropdown"><a href="#sector-aerospace" onClick={closeMenu}>AEROSPACE</a><a href="#sector-uav-defence" onClick={closeMenu}>UAV &amp; DEFENCE</a><a href="#sector-automotive" onClick={closeMenu}>AUTOMOTIVE</a><a href="#sector-medical" onClick={closeMenu}>MEDICAL</a><a href="#sector-sports" onClick={closeMenu}>SPORTS</a></div></div><a href="#products" onClick={closeMenu}>PRODUCTS</a><a href="#careers" onClick={closeMenu}>CAREERS</a>
      </nav>
      <a className="pdf-nav-contact" href="#contact">CONTACT US</a>
      <button className="pdf-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X size={21} /> : <Menu size={22} />}</button>
    </header>
    <main>
      <section id="home" className="pdf-hero"><div className="pdf-hero-inner"><p className="pdf-kicker">WEAVING</p><h1>IDEAS<br />INTO<br /><em>SHAPES</em></h1><p className="pdf-description">ADVANCED COMPOSITE MANUFACTURING SOLUTIONS FOR HIGH-PERFORMANCE INDUSTRIES.</p></div></section>
      <section id="about" className="pdf-intro"><span>ABOUT ANY COMPOSITES</span><h2>Built to perform.<br /><em>Engineered to advance.</em></h2><p>We deliver advanced CFRP and GFRP solutions through precision engineering, quality manufacturing and customer focus.</p></section>
      <section id="capabilities" className="pdf-capabilities"><div><span>WHAT WE DO</span><h2>ENGINEERED<br /><em>ACROSS</em><br />INDUSTRIES.</h2></div><p className="pdf-capabilities-description">High-performance composite solutions engineered to meet the unique demands of the world&apos;s most challenging applications.</p><div className="pdf-industries"><span>INDUSTRIES WE SERVE</span><div className="pdf-industry-grid">{industries.map(([name, description, Icon, image]) => <article className="pdf-industry-card" key={name}><img src={image} alt="" /><div><Icon aria-hidden="true" /><h3>{name}</h3><p>{description}</p></div></article>)}</div></div></section>
      <section id="products" className="pdf-products"><div className="pdf-products-heading"><div><span>04 | STANDARD PRODUCTS</span><h2>STANDARD<br /><em>PRODUCTS.</em></h2><p>High-performance composite materials engineered for strength, precision and reliability.</p></div></div><div className="pdf-product-grid">{products.map(([number, name, features, image]) => <article className="pdf-product-card" key={name}><img src={image} alt="" /><div><b>{number}</b><h3>{name}</h3>{features.split('|').map(feature => <p key={feature}>{feature}</p>)}</div></article>)}</div><p className="pdf-products-footer">ENGINEERED TO <em>PERFORM.</em> BUILT TO <em>LAST.</em></p></section>
      <section id="contact" className="pdf-contact"><div className="contact-intro"><span>CONTACT US</span><h2>LET&apos;S BUILD<br /><em>WHAT&apos;S NEXT.</em></h2><p>Discuss your next composite program with our engineering and manufacturing team.</p><a className="contact-email" href={`mailto:${companyData.contact.email}`}>{companyData.contact.email}</a></div><div className="contact-details"><div><b>CALL US</b><a href={`tel:${companyData.contact.phone.replaceAll(' ', '')}`}>{companyData.contact.phone}</a><p>{companyData.contact.hours}</p></div><div><b>HEADQUARTERS</b><p>{companyData.contact.hq.company}</p><p>{companyData.contact.hq.address}</p></div><div><b>MANUFACTURING PLANT</b><p>{companyData.contact.plant.company}</p><p>{companyData.contact.plant.address}</p></div></div></section>
    </main>
  </div>;
}
