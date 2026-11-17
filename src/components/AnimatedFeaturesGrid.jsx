import React from 'react';
import { Gauge, ShieldCheck, Layers, Zap, Cpu, RefreshCw, BarChart2, Radio } from 'lucide-react';

export default function AnimatedFeaturesGrid() {
  const items = [
    { icon: Gauge, badge: "tolerance control", title: "±0.02mm Precision", desc: "Sub-millimeter dimension accuracy across all CFRP and GFRP structural components." },
    { icon: ShieldCheck, badge: "ndt verified", title: "100% NDT Inspected", desc: "Ultrasonic C-scan inspection verifying zero interior voids or structural delamination." },
    { icon: Layers, badge: "lightweight matrix", title: "1.55 g/cm³ Density", desc: "5x stronger than high-grade steel at less than one-fifth the structural mass." },
    { icon: Zap, badge: "thermal stability", title: "Near-Zero CTE", desc: "Ultra-low coefficient of thermal expansion along principal carbon fiber axes." },
    { icon: Cpu, badge: "autoclave cured", title: "High-Temp Resin Matrix", desc: "Specialized aerospace epoxy formulations resistant to continuous 280°C environments." },
    { icon: RefreshCw, badge: "traceable supply", title: "Batch Serialized", desc: "Full raw material pedigree and digital manufacturing traceability records." },
    { icon: BarChart2, badge: "5-axis cnc", title: "Complex Geometry", desc: "5-axis high-speed CNC trimming and drilling stations for precision fastener inserts." },
    { icon: Radio, badge: "radome grade", title: "RF Transmissive GFRP", desc: "Dielectric formulations engineered specifically for naval radomes and telemetry domes." }
  ];

  return (
    <section id="specs" className="section">
      <div className="container">
        
        <div className="section-header-split">
          <div>
            <div className="badge-indicator">
              <span className="badge-dot" />
              <span className="badge-label">ENGINEERING SPECIFICATIONS</span>
            </div>
            <h2 className="title-lg">
              Hardware Precision & Standards
            </h2>
          </div>

          <p className="section-header-desc">
            Rigorous manufacturing tolerances, comprehensive non-destructive testing, and certified raw fiber compliance.
          </p>
        </div>

        {/* 8-Card Features Grid */}
        <div className="capabilities-grid">
          {items.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="capability-card" style={{ cursor: 'default' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-blue-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-blue)'
                    }}>
                      <IconComp size={18} />
                    </div>
                    <span className="card-badge" style={{ fontSize: '0.6rem' }}>{item.badge}</span>
                  </div>

                  <h3 className="card-title" style={{ fontSize: '0.95rem' }}>{item.title}</h3>
                  <p className="card-desc" style={{ marginBottom: '0' }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
