import React from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Layers, Cpu } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

export default function Hero({ onOpenQuote }) {
  return (
    <section id="home" className="wix-split-hero">
      
      {/* Left 50% Column: Architectural Narrative & Actions */}
      <div className="wix-hero-left">
        <div className="wix-hero-left-inner">
          
          <div className="section-tag">
            <span className="status-pulse-dot" style={{ background: 'var(--accent-cyan)' }} />
            <span>AeroMac Dynamics // Advanced Composites</span>
          </div>

          <h1 className="wix-hero-title">
            Advanced composites for <br />
            <span style={{ color: 'var(--accent-blue-bright)' }}>Advanced Composites.</span>
          </h1>

          <p className="wix-hero-desc">
            {companyData.heroSubtitle} From first article to repeat manufacture, we help engineering teams turn demanding structures into production-ready parts.
          </p>

          <div className="wix-hero-btn-row">
            <button onClick={onOpenQuote} className="btn btn-primary">
              <span>Request a Quote</span>
              <ArrowUpRight size={15} />
            </button>

            <a href="#sectors" className="btn btn-ghost">
              <span>Explore capabilities</span>
            </a>

            <a href="#estimator" className="btn btn-ghost">
              <span>Spec Estimator</span>
            </a>
          </div>

          {/* Micro Specs Bar */}
          <div className="wix-hero-specs-strip">
            <div className="hero-bullet-item">
              <CheckCircle2 size={15} style={{ color: 'var(--accent-cyan)' }} />
              <span>Autoclave 180°C / 7 Bar Prepreg</span>
            </div>
            <div className="hero-bullet-item">
              <CheckCircle2 size={15} style={{ color: 'var(--accent-cyan)' }} />
              <span>Micro-Tolerance (±0.02mm CNC)</span>
            </div>
            <div className="hero-bullet-item">
              <CheckCircle2 size={15} style={{ color: 'var(--accent-cyan)' }} />
              <span>100% Ultrasonic NDT Inspected</span>
            </div>
            <div className="hero-bullet-item">
              <CheckCircle2 size={15} style={{ color: 'var(--accent-cyan)' }} />
              <span>Custom 1K / 3K / 12K Weaves</span>
            </div>
          </div>

          {/* 4-Quadrant Baseline Metric Strip */}
          <div className="wix-hero-metrics-grid">
            <div className="baseline-cell">
              <div className="baseline-number">
                ±0.02<span className="unit">mm</span>
              </div>
              <div className="baseline-label">Precision Tolerance</div>
              <div className="baseline-desc">5-Axis CNC Waterjet & Micro-Milling</div>
            </div>

            <div className="baseline-cell">
              <div className="baseline-number">
                100<span className="unit">% NDT</span>
              </div>
              <div className="baseline-label">Quality Assurance</div>
              <div className="baseline-desc">Ultrasonic Defect & Delamination Scan</div>
            </div>

            <div className="baseline-cell">
              <div className="baseline-number">
                5<span className="unit">x</span>
              </div>
              <div className="baseline-label">Strength-to-Weight</div>
              <div className="baseline-desc">Higher tensile strength than structural steel</div>
            </div>

            <div className="baseline-cell">
              <div className="baseline-number">
                180<span className="unit">°C / 7 Bar</span>
              </div>
              <div className="baseline-label">Autoclave Consolidation</div>
              <div className="baseline-desc">Zero-void structural prepreg curing</div>
            </div>
          </div>

        </div>
      </div>

      {/* Right 50% Column: Full-Bleed High-Impact Imagery with Overlay Card */}
      <div className="wix-hero-right">
        <div className="wix-hero-right-img-wrap">
          <img
            src="/images/precision_composite_hardware.jpg"
            alt="Advanced Composite Component Engineering"
            className="wix-hero-right-img"
          />
          <div className="wix-hero-right-gradient" />

          {/* Floating Hardware Metadata Card */}
          <div className="wix-floating-card blueprint-crosshair">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={15} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: '#ffffff', letterSpacing: '0.08em' }}>
                  FEATURED HARDWARE // AEROSPACE BRACKET
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: 'var(--accent-emerald)' }}>
                ● 100% NDT PASS
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div className="hero-spec-pill">
                <div className="hero-spec-pill-label">TENSILE STRENGTH</div>
                <div className="hero-spec-pill-val">3,500 MPa</div>
              </div>
              <div className="hero-spec-pill">
                <div className="hero-spec-pill-label">DENSITY</div>
                <div className="hero-spec-pill-val">1.55 g/cm³</div>
              </div>
              <div className="hero-spec-pill">
                <div className="hero-spec-pill-label">TOLERANCE</div>
                <div className="hero-spec-pill-val">±0.02mm</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
