import { useEffect, useRef, useState } from 'react';
import './SiteNavbar.css';

/*
  Koenigsegg-style navigation:
  - no background: name on the left, two-line menu toggle on the right
  - hides on scroll down, returns on scroll up
  - toggle opens a full-screen menu
*/

const menuLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About us', href: '#about-us' },
  { label: 'Sectors', href: '#capabilities' },
];

const sectorLinks = [
  { label: 'Aerospace', href: '#sector-aerospace' },
  { label: 'UAV & Defence', href: '#sector-uav-defence' },
  { label: 'Automotive', href: '#sector-automotive' },
  { label: 'Medical', href: '#sector-medical' },
  { label: 'Sports', href: '#sector-sports' },
];

export default function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - lastY.current) > 6) {
        setHidden(y > lastY.current && y > 160);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const navClass = ['ac-nav', hidden && !open ? 'is-hidden' : '', scrolled ? 'is-scrolled' : '', open ? 'is-open' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={navClass}>
        <a href="#home" className="ac-nav__brand" onClick={close} aria-label="Any Composites home">
          anycomposites
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="ac-nav__toggle"
          aria-expanded={open}
          aria-controls="ac-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </header>

      <div id="ac-menu" className={`ac-menu ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={open ? undefined : ''}>
        <div className="ac-menu__inner">
          <nav className="ac-menu__primary" aria-label="Main">
            {menuLinks.map((link, i) => (
              <a key={link.label} href={link.href} onClick={close} style={{ '--i': i }}>
                {link.label}
              </a>
            ))}
            <ol className="ac-menu__subs">
              {sectorLinks.map((s, i) => (
                <li key={s.href}>
                  <a href={s.href} onClick={close} style={{ '--i': menuLinks.length + i }}>
                    <span aria-hidden="true">{i + 1}.</span> {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </>
  );
}
