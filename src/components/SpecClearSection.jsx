import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function SpecClearSection({ onOpenQuote }) {
  return (
    <section className="section-wrap">
      <div className="container">
        
        <div className="spec-philosophy-grid">
          
          {/* Left Column: Core Philosophy & Tolerance Box */}
          <div>
            <div className="section-tag">
              <span>[ 02 // SPECIFICATION ARCHITECTURE ]</span>
            </div>

            <h2 className="section-title">
              We make design specifications <br />
              <span style={{ color: 'var(--accent-blue-bright)' }}>clear from the start.</span>
            </h2>

            <p className="section-desc">
              ANY COMPOSITES removes uncertainty by defining fiber orientations, resin matrices, ply stacking schedules, and manufacturing tolerances before production begins.
            </p>

            {/* Tolerance Highlight Box */}
            <div className="tolerance-highlight-box blueprint-crosshair">
              <div className="tolerance-number">±0.02mm</div>
              <div className="tolerance-label">PRECISION MANUFACTURING TOLERANCE</div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Achieved via closed-loop 5-axis CNC diamond tooling and laser-calibrated coordinate measuring machines (CMM).
              </p>
            </div>

            <button onClick={onOpenQuote} className="btn btn-ghost">
              <span>Request Specification Clearances</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Right Column: Staggered Image Pair */}
          <div className="staggered-images-wrap blueprint-crosshair">
            <div className="staggered-img-card">
              <img
                src="/images/portrait_composite_part.jpg"
                alt="CNC Machined Carbon Fiber Structural Bracket"
              />
            </div>
            <div className="staggered-img-card offset">
              <img
                src="/images/aerospace_uav.jpg"
                alt="Aerospace UAV Carbon Composite Structure"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
