import React from 'react';
import { Layers, Cylinder, Cog, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

export default function ProductsSection({ onOpenQuote }) {
  const productIcons = [Layers, Cylinder, Cog];

  return (
    <section id="products" className="section-wrap">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div className="section-tag">
            <span>[ 05 // PRODUCT ARCHITECTURE ]</span>
          </div>
          <h2 className="section-title">
            Standard & Bespoke <span style={{ color: 'var(--accent-cyan)' }}>Composite Hardware</span>.
          </h2>
          <p className="section-desc">
            From raw composite plates and structural tubes to full 5-axis CNC finished hardware assemblies, our manufacturing lines deliver aerospace-grade consistency.
          </p>
        </div>

        {/* 3-Column Product Cards */}
        <div className="products-3col-grid">
          {companyData.products.map((prod, idx) => {
            const Icon = productIcons[idx] || Layers;
            return (
              <div key={prod.id} className="product-item-card blueprint-crosshair">
                <div>
                  <div className="product-header-icon">
                    <Icon size={22} />
                  </div>
                  <h3 className="product-card-title">{prod.title}</h3>
                  <p className="product-card-sub">{prod.subtitle}</p>

                  <ul className="product-features-list">
                    {prod.features.map((feat, fIdx) => (
                      <li key={fIdx}>
                        <CheckCircle2 size={15} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={onOpenQuote}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <span>Request Custom Spec</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
