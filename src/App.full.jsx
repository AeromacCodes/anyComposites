import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SpecClearSection from './components/SpecClearSection';
import AboutPillars from './components/AboutPillars';
import SectorsGrid from './components/SectorsGrid';
import ProductsSection from './components/ProductsSection';
import EstimatorSection from './components/EstimatorSection';
import ManufacturingProcess from './components/ManufacturingProcess';
import FacilitiesContact from './components/FacilitiesContact';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import { X, CheckCircle2, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState(null);

  return (
    <div className="site-root-wrapper">
      
      {/* 1. Webflow Hardware Sticky Header */}
      <Navbar onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* 2. Section 01: Hero (Value Proposition, Hardware Showcase & Baseline Metrics) */}
      <Hero onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* 3. Section 02: Specification Architecture (Philosophy, ±0.02mm & Staggered Visuals) */}
      <SpecClearSection onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* 4. Section 03: Philosophy & 4 Core Values (Quality, Innovation, Focus, Reliability) */}
      <AboutPillars />

      {/* 5. Section 04: Sector Directory (The 8 Industry Sectors from PDF) */}
      <SectorsGrid onSelectCapability={(cap) => setSelectedCapability(cap)} />

      {/* 6. Section 05: Product Architecture (Sheets, Tubes, 5-Axis CNC Parts) */}
      <ProductsSection onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* 7. Section 06: Interactive Spec & Weight Estimator (vs Aluminum & Steel) */}
      <EstimatorSection onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* 8. Section 07: Manufacturing Infrastructure & Quality Control (Autoclave & NDT) */}
      <ManufacturingProcess onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* 9. Section 08: Dual Navi Mumbai Facilities & Technical RFP Form */}
      <FacilitiesContact />

      {/* 10. Technical Footer */}
      <Footer onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* Quote & RFP Request Dialog */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />

      {/* Capability Specification Detail Modal */}
      {selectedCapability && (
        <div className="modal-overlay-backdrop" onClick={() => setSelectedCapability(null)}>
          <div className="modal-content-box blueprint-crosshair" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedCapability(null)}
              className="modal-close-btn"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--accent-cyan)'
              }}>
                {selectedCapability.id}
              </span>
              <div>
                <span className="section-tag" style={{ margin: 0, padding: '2px 8px', fontSize: '9.5px' }}>
                  {selectedCapability.badge}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                  {selectedCapability.title}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--text-medium)', marginBottom: '20px', lineHeight: '1.6' }}>
              {selectedCapability.short}
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-hairline)',
              borderRadius: '8px',
              padding: '16px 20px',
              marginBottom: '24px'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-blue-bright)',
                marginBottom: '10px',
                fontWeight: 700
              }}>
                ENGINEERING SPECIFICATIONS & COMPLIANCE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedCapability.specs.map((sp, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-high)' }}>
                    <CheckCircle2 size={15} style={{ color: 'var(--accent-cyan)' }} />
                    <span>{sp}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCapability(null);
                setQuoteModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <span>Request Quote For This Sector</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
