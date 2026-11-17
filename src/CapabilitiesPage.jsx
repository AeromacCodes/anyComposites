import { Car, Cross, Menu, Plane, ShieldCheck, Trophy, X } from 'lucide-react';
import { useState } from 'react';

const sectors = [
  ['AEROSPACE', 'Lightweight structures for aircraft components and systems.', Plane, '/images/aerospace_uav.jpg'],
  ['UAV & DEFENCE', 'Advanced composite solutions for unmanned systems and tactical applications.', ShieldCheck, '/images/precision_composite_hardware.jpg'],
  ['AUTOMOTIVE', 'Performance-driven composites for high-performance and next-gen mobility.', Car, '/images/hero_carbon_weave.jpg'],
  ['MEDICAL', 'Custom composites for prosthetics and advanced medical devices.', Cross, '/images/portrait_composite_part.jpg'],
  ['SPORTS', 'Engineered for precision, strength and competitive performance.', Trophy, '/images/custom_sheets_tubes.jpg'],
];

export default function CapabilitiesPage() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <div className="capabilities-page">
    <header className="pdf-nav"><a href="#home" className="pdf-brand" onClick={close}><span className="pdf-logo">A</span><span className="pdf-brand-copy">ANY COMPOSITES<small>ADVANCED MATERIALS</small></span></a><nav className={open ? 'pdf-links open' : 'pdf-links'}><a href="#about-us" onClick={close}>ABOUT US</a><a href="#capabilities" className="active" onClick={close}>CAPABILITIES</a><a href="#products" onClick={close}>PRODUCTS</a></nav><a className="pdf-nav-contact" href="#contact">CONTACT US</a><button className="pdf-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X size={21} /> : <Menu size={22} />}</button></header>
    <main><section className="capabilities-hero"><div><span>WHAT WE DO</span><h1>ENGINEERED<br /><em>ACROSS</em><br />INDUSTRIES.</h1><p>High-performance composite solutions engineered to meet the unique demands of the world&apos;s most challenging applications.</p></div></section><section className="sector-section"><span>INDUSTRIES WE SERVE</span><div className="sector-grid">{sectors.map(([name, description, Icon, image]) => <a href={`#sector-${name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-')}`} key={name}><img src={image} alt="" /><div><Icon aria-hidden="true" /><h2>{name}</h2><p>{description}</p><b>EXPLORE SECTOR →</b></div></a>)}</div></section></main>
  </div>;
}
