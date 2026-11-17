import React, { useState } from 'react';
import { Hexagon, ArrowUpRight, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenQuote }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-container">
        
        {/* Brand Logo */}
        <a href="#home" className="brand-wrapper">
          <div className="brand-logo-icon">
            <Hexagon size={20} strokeWidth={2} />
          </div>
          <div>
            <div className="brand-title">
              ANY <span>COMPOSITES</span>
            </div>
            <div className="brand-subtitle">
              ADVANCED CFRP & GFRP
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="nav-menu">
          <a href="#home" className="nav-item active">Home</a>
          <a href="#about" className="nav-item">About</a>
          <a href="#sectors" className="nav-item">Sectors</a>
          <a href="#products" className="nav-item">Products</a>
          <a href="#estimator" className="nav-item">Estimator</a>
        </nav>

        {/* Action CTA */}
        <div className="nav-cta-wrap">
          <button onClick={onOpenQuote} className="btn-nav-outline">
            <span>Request a quote</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#about" onClick={() => setMobileMenuOpen(false)} className="nav-item">About</a>
        <a href="#sectors" onClick={() => setMobileMenuOpen(false)} className="nav-item">Sectors</a>
        <a href="#products" onClick={() => setMobileMenuOpen(false)} className="nav-item">Products</a>
        <a href="#estimator" onClick={() => setMobileMenuOpen(false)} className="nav-item">Spec Estimator</a>
        <a href="#manufacturing" onClick={() => setMobileMenuOpen(false)} className="nav-item">Manufacturing</a>
        <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="nav-item">Facilities</a>
        <button
          onClick={() => { setMobileMenuOpen(false); onOpenQuote(); }}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '12px' }}
        >
          <span>Request Spec & Quote</span>
          <ArrowUpRight size={15} />
        </button>
      </div>
    </header>
  );
}
