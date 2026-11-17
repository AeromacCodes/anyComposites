import React, { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

export default function CapabilitiesCaseGrid({ onSelectCapability }) {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', 'Aerospace & Defense', 'Mass Transit', 'Clean Energy', 'Healthcare', 'Robotics', 'Industrial'];

  const filtered = activeCategory === 'ALL'
    ? companyData.capabilities
    : companyData.capabilities.filter(c => c.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory === 'ALL');

  return (
    <section id="capabilities" className="section">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header-split">
          <div>
            <div className="badge-indicator">
              <span className="badge-dot" />
              <span className="badge-label">CORE SECTORS</span>
            </div>
            <h2 className="title-lg">
              Engineered. Manufactured. Delivered.
            </h2>
          </div>

          <p className="section-header-desc">
            Advanced composite solutions engineered for mission-critical aerospace, defense, marine, and high-precision industrial applications.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '36px' }}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className="btn btn-ghost"
              style={{
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                border: activeCategory === cat ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                background: activeCategory === cat ? 'var(--accent-blue-subtle)' : 'var(--bg-card)',
                color: activeCategory === cat ? '#ffffff' : 'var(--text-secondary)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 8-Card Capabilities Grid */}
        <div className="capabilities-grid">
          {filtered.map((cap) => (
            <div
              key={cap.id}
              onClick={() => onSelectCapability(cap)}
              className="capability-card"
            >
              <div>
                <div className="card-top-meta">
                  <span className="card-num">{cap.id}</span>
                  <span className="card-badge">{cap.badge}</span>
                </div>

                <h3 className="card-title">{cap.title}</h3>
                <p className="card-desc">{cap.short}</p>
              </div>

              <div>
                <div className="card-specs">
                  {cap.specs.map((spec, i) => (
                    <div key={i} className="card-spec-item">
                      <Check size={12} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="card-action-link">
                  <span>VIEW SPEC SHEET</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
