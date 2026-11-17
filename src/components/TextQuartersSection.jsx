import React from 'react';

export default function TextQuartersSection() {
  return (
    <section className="section padding-assymetrical bg-[#080808] border-b border-white/10">
      <div className="main-container">
        <div className="text-grid-quarters">
          
          <div className="text-grid-item">
            <div className="text-white">Autoclave & RTM Facilities</div>
            <div className="muted-text text-sm font-normal">
              High-pressure curing chambers for aerospace and military grade composites
            </div>
          </div>

          <div className="text-grid-item">
            <div className="text-white">Prototype Validation</div>
            <div className="muted-text text-sm font-normal">
              Controlled testing environments for early-stage CFRP components against benchmarks
            </div>
          </div>

          <div className="text-grid-item">
            <div className="text-white">Multi-Site Plants</div>
            <div className="muted-text text-sm font-normal">
              AeroMac Dynamics facilities in Navi Mumbai MIDC Turbhe requiring strict standardization
            </div>
          </div>

          <div className="text-grid-item">
            <div className="text-white">100% QA Checkpoints</div>
            <div className="muted-text text-sm font-normal">
              Structured NDT ultrasonic inspection points to confirm every part meets specifications
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
