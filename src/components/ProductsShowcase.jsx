import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

export default function ProductsShowcase({ onOpenQuote }) {
  const [productType, setProductType] = useState('sheet');
  const [thickness, setThickness] = useState('2.0');
  const [weave, setWeave] = useState('3K Twill');
  const [finish, setFinish] = useState('Glossy');

  // Estimate weight calculation
  const area = 0.5 * 0.5; // 500x500mm
  const density = 1.55; // g/cm3
  const volumeCm3 = area * 100 * (parseFloat(thickness) / 10);
  const estimatedWeightGrams = (volumeCm3 * density).toFixed(1);

  return (
    <section id="products" className="section">
      <div className="container">
        
        {/* Header */}
        <div className="section-header-split">
          <div>
            <div className="badge-indicator">
              <span className="badge-dot" />
              <span className="badge-label">PRODUCT PORTFOLIO</span>
            </div>
            <h2 className="title-lg">
              Quality Materials. Custom Engineered.
            </h2>
          </div>

          <p className="section-header-desc">
            We deliver high-performance carbon fiber sheets, structural tubes, and custom-engineered parts manufactured to exact dimensional tolerances.
          </p>
        </div>

        {/* 3 Core Product Offerings */}
        <div className="products-grid">
          {companyData.products.map((prod) => (
            <div key={prod.id} className="product-card">
              <div>
                <span className="card-badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
                  {prod.title}
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                  {prod.subtitle}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
                  {prod.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={14} style={{ color: 'var(--accent-blue)', marginTop: '2px', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onOpenQuote}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                <span>Request Spec Sheet</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Interactive Composite Spec Configurator */}
        <div className="configurator-panel">
          
          {/* Form Controls */}
          <div>
            <div className="badge-indicator" style={{ marginBottom: '12px' }}>
              <span className="badge-dot" />
              <span className="badge-label">SPECIFICATION ESTIMATOR</span>
            </div>
            <h3 className="title-md" style={{ marginBottom: '8px' }}>
              Composite Density & Weight Calculator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Configure composite laminates, thicknesses, and weave styles to estimate physical specs in real time.
            </p>

            <div className="config-form-grid">
              <div className="form-group">
                <label>Product Format</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="form-select"
                >
                  <option value="sheet">Carbon Fiber Sheet (500x500mm)</option>
                  <option value="tube">Structural Tube (1000mm length)</option>
                  <option value="part">Custom CNC Component</option>
                </select>
              </div>

              <div className="form-group">
                <label>Laminate Thickness</label>
                <select
                  value={thickness}
                  onChange={(e) => setThickness(e.target.value)}
                  className="form-select"
                >
                  <option value="1.0">1.0 mm (Ultra-Thin Ply)</option>
                  <option value="2.0">2.0 mm (Standard Structural)</option>
                  <option value="3.0">3.0 mm (High Load)</option>
                  <option value="5.0">5.0 mm (Reinforced Matrix)</option>
                  <option value="10.0">10.0 mm (Solid Monolithic)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Weave Architecture</label>
                <select
                  value={weave}
                  onChange={(e) => setWeave(e.target.value)}
                  className="form-select"
                >
                  <option value="3K Twill">3K 2x2 Twill Weave</option>
                  <option value="3K Plain">3K Plain Weave</option>
                  <option value="12K Unidirectional">12K Unidirectional Ply</option>
                  <option value="Forged Carbon">Forged Chopped Fiber</option>
                </select>
              </div>

              <div className="form-group">
                <label>Surface Finish</label>
                <select
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  className="form-select"
                >
                  <option value="Glossy">Clear High Gloss (UV Inherent)</option>
                  <option value="Matte">Matte Anti-Reflective</option>
                  <option value="Peel-Ply">Peel-Ply Secondary Bondable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Calculated Output Card */}
          <div className="spec-calc-output">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ESTIMATED COMPONENT MASS
              </div>
              <div className="calc-val-large">
                ~{estimatedWeightGrams} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>grams</span>
              </div>

              <div className="calc-meta-row">
                <span className="text-muted">Target Density:</span>
                <span style={{ color: '#ffffff' }}>1.55 g/cm³</span>
              </div>

              <div className="calc-meta-row">
                <span className="text-muted">Tensile Strength:</span>
                <span style={{ color: 'var(--accent-blue)' }}>4,900 MPa</span>
              </div>

              <div className="calc-meta-row">
                <span className="text-muted">Resin System:</span>
                <span style={{ color: '#ffffff' }}>Epoxy TG 130°C</span>
              </div>

              <div className="calc-meta-row">
                <span className="text-muted">Quality Standard:</span>
                <span style={{ color: '#ffffff' }}>100% UT Inspected</span>
              </div>
            </div>

            <button
              onClick={onOpenQuote}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '24px' }}
            >
              <span>Request Quote for this Spec</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
