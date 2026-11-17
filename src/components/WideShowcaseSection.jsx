import React from 'react';
import { Activity, Cpu, ShieldCheck } from 'lucide-react';

export default function WideShowcaseSection() {
  return (
    <section style={{ padding: '60px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div className="matrix-banner">
          
          <div className="matrix-banner-content">
            <div className="badge-indicator">
              <span className="badge-dot" />
              <span className="badge-label">HIGH-MODULUS COMPOSITE SYSTEM</span>
            </div>

            <h2 className="title-lg" style={{ marginBottom: '16px' }}>
              THE ANY-CFRP MATRIX
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Industrial workflows often conceal subtle inefficiencies. The ANY-CFRP matrix eliminates micro-deviations before they escalate into structural fatigue, delivering maximum stiffness at one-fifth the weight of high-grade steel.
            </p>

            <div className="matrix-pill-group">
              <div className="matrix-pill">
                <Activity size={16} style={{ color: 'var(--accent-blue)' }} />
                <span>DRIFT COMPATIBLE</span>
              </div>

              <div className="matrix-pill">
                <Cpu size={16} style={{ color: 'var(--accent-blue)' }} />
                <span>CLOSED-LOOP PROCESS</span>
              </div>

              <div className="matrix-pill">
                <ShieldCheck size={16} style={{ color: 'var(--accent-blue)' }} />
                <span>VARIANCE DETECTION</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
