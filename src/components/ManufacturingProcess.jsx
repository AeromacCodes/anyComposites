import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function ManufacturingProcess({ onOpenQuote }) {
  const steps = [
    {
      num: "01",
      title: "Fiber Matrix Architecture & FEA",
      desc: "Anisotropic stacking sequence calculation based on structural load cases. Finite Element Analysis (FEA) models stress distribution before cutting a single fiber."
    },
    {
      num: "02",
      title: "Cleanroom Prepreg Precision Layup",
      desc: "Laser projection guided ply alignment in an ISO Class 8 cleanroom environment with controlled temperature and humidity to prevent particulate contamination."
    },
    {
      num: "03",
      title: "Autoclave & RTM Consolidation",
      desc: "High-pressure thermal curing at 180°C and 7-bar pressure to guarantee zero-void consolidation and maximum inter-laminar shear strength (ILSS)."
    },
    {
      num: "04",
      title: "5-Axis CNC & Ultrasonic NDT Testing",
      desc: "Diamond-coated tool CNC milling and abrasive waterjet cutting down to ±0.02mm, followed by 100% phased-array ultrasonic non-destructive flaw inspection."
    }
  ];

  return (
    <section id="manufacturing" className="section-wrap">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '44px' }}>
          <div className="section-tag">
            <span>[ 07 // MANUFACTURING & QUALITY ASSURANCE ]</span>
          </div>
          <h2 className="section-title">
            The Science of <span style={{ color: 'var(--accent-blue-bright)' }}>Zero-Defect</span> Consolidation.
          </h2>
          <p className="section-desc">
            AeroMac Dynamics operates precision autoclave curing, resin infusion, and multi-axis CNC machining centers in Navi Mumbai.
          </p>
        </div>

        {/* 2-Column Split: Process Steps vs Industrial Media */}
        <div className="infra-split-layout">
          
          {/* Left: 4-Step Linear Pipeline */}
          <div className="process-steps-vertical">
            {steps.map((st, idx) => (
              <div key={idx} className="step-card blueprint-crosshair">
                <div className="step-number-badge">{st.num}</div>
                <div className="step-content-col">
                  <h4>{st.title}</h4>
                  <p>{st.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Autoclave Media Card */}
          <div className="infra-media-stack blueprint-crosshair">
            <img
              src="/images/square_autoclave.jpg"
              alt="Industrial High-Pressure Composite Autoclave Chamber"
              className="infra-main-image"
            />
            <div className="infra-caption-card">
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--accent-cyan)' }}>
                  EQUIPMENT SPEC // AUTOCLAVE CHAMBER
                </div>
                <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600 }}>
                  Navi Mumbai Facility // Thermal Cycle: 180°C @ 7-Bar
                </div>
              </div>

              <button
                onClick={onOpenQuote}
                className="btn btn-cyan"
                style={{ padding: '8px 14px', fontSize: '11px' }}
              >
                <span>Audit Plant</span>
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
