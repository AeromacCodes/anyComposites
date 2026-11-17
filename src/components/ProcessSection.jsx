import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function ProcessSection({ onOpenQuote }) {
  const steps = [
    { num: "01", title: "Real-Time Fiber Alignment", desc: "Automated ply orientation verification under strict tension control." },
    { num: "02", title: "Autoclave High-Temp Curing", desc: "Computer-controlled thermal & pressure cycles up to 280°C." },
    { num: "03", title: "100% Ultrasonic NDT Inspection", desc: "Non-destructive ultrasonic C-scan ensuring zero delamination or voids." }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="split-grid">
          
          {/* Left Column Steps */}
          <div>
            <h2 className="title-md" style={{ marginBottom: '24px' }}>
              Prototyping is about proof, not assumption.{' '}
              <span className="text-muted">
                ANY COMPOSITES builds and validates early-stage components against defined aerospace benchmarks to guarantee structural reliability.
              </span>
            </h2>

            {/* Process List */}
            <div className="process-list">
              {steps.map((step, idx) => (
                <div key={idx} className="process-item">
                  <div className="laser-line-container" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <div className="laser-beam" style={{ animationDelay: `${idx * 0.7}s` }} />
                  </div>
                  
                  <div className="process-item-header" style={{ paddingTop: '8px' }}>
                    <span className="process-num">{step.num}</span>
                    <span className="process-title">{step.title}</span>
                  </div>
                  <div className="process-desc">{step.desc}</div>
                </div>
              ))}
            </div>

            <button onClick={onOpenQuote} className="btn btn-outline">
              <span>View Process Specifications</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Right Column Process Image */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--border-medium)',
              aspectRatio: '1 / 1',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}>
              <img
                src="/images/square_autoclave.jpg"
                alt="Autoclave Composite Manufacturing Chamber"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              marginTop: '16px'
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.08em', color: '#ffffff', textTransform: 'uppercase' }}>
                NEXT-GENERATION COMPOSITE TESTING FROM DAY 1
              </span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block' }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
