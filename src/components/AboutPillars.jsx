import React from 'react';
import { ShieldCheck, Zap, Crosshair, Award } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

export default function AboutPillars() {
  const pillars = [
    {
      index: "01",
      title: "QUALITY",
      desc: "Committed to the highest standards in every process. Complete material traceability from raw carbon tow to autoclave-cured laminate.",
      icon: ShieldCheck
    },
    {
      index: "02",
      title: "INNOVATION",
      desc: "Continuously developing lighter, stronger, and thermally stable composite solutions through proprietary resin matrix formulations.",
      icon: Zap
    },
    {
      index: "03",
      title: "CUSTOMER FOCUS",
      desc: "Engineering collaboration from design concept to final qualification. We tailor fiber layups directly to your load profiles.",
      icon: Crosshair
    },
    {
      index: "04",
      title: "RELIABILITY",
      desc: "Delivering consistent, repeatable performance with rigorous ultrasonic non-destructive testing (NDT) on every production run.",
      icon: Award
    }
  ];

  return (
    <section id="about" className="section-wrap">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="section-tag">
            <span>[ 03 // PHILOSOPHY & VALUES ]</span>
          </div>

          <h2 className="section-title">
            Built on Innovation. <br />
            <span style={{ color: 'var(--accent-cyan)' }}>Focused on Performance.</span>
          </h2>

          <p className="section-desc">
            {companyData.about.description} Headquartered in Navi Mumbai, we partner with defense contractors, aerospace engineers, and advanced industrial manufacturers.
          </p>
        </div>

        {/* 4-Column Values Grid */}
        <div className="values-4col-grid">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="value-card blueprint-crosshair">
                <div className="value-card-index">[ {item.index} // PILLAR ]</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: 'rgba(28, 100, 242, 0.1)',
                    border: '1px solid var(--border-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)'
                  }}>
                    <Icon size={18} />
                  </div>
                  <div className="value-card-title">{item.title}</div>
                </div>
                <p className="value-card-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
