import React from 'react';

export default function QuoteSection() {
  return (
    <section className="section" style={{ padding: '80px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '820px' }}>
          <div style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 2.1rem)',
            fontWeight: 500,
            lineHeight: 1.35,
            color: '#ffffff',
            marginBottom: '28px',
            letterSpacing: '-0.02em'
          }}>
            “In our facility, accuracy means uptime.{' '}
            <span style={{ color: 'var(--text-secondary)' }}>
              ANY COMPOSITES gives us the confidence of sub-millimeter precision before assembly commences. Fewer surprises, predictable production.”
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '3px solid var(--accent-blue)', paddingLeft: '16px' }}>
            <div>
              <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>AeroMac Dynamics Engineering Review</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Advanced Composites Quality Assurance Board</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
