import React, { useState } from 'react';
import { Calculator, ArrowUpRight } from 'lucide-react';

export default function EstimatorSection({ onOpenQuote }) {
  const [componentType, setComponentType] = useState('plate');
  const [lengthMm, setLengthMm] = useState(500);
  const [widthMm, setWidthMm] = useState(300);
  const [thicknessMm, setThicknessMm] = useState(3.0);
  const [tubeOdMm, setTubeOdMm] = useState(50);
  const [tubeWallMm, setTubeWallMm] = useState(2.0);

  // Density values (g/cm³)
  const DENSITY_CFRP = 1.55;
  const DENSITY_ALUMINUM = 2.70;
  const DENSITY_STEEL = 7.85;

  let cfrpWeight = 0;
  let aluWeight = 0;
  let steelWeight = 0;

  if (componentType === 'plate') {
    const volumeCm3 = (lengthMm * widthMm * thicknessMm) / 1000;
    cfrpWeight = volumeCm3 * DENSITY_CFRP;
    aluWeight = volumeCm3 * DENSITY_ALUMINUM;
    steelWeight = volumeCm3 * DENSITY_STEEL;
  } else {
    const rOuter = tubeOdMm / 2;
    const rInner = Math.max(0, rOuter - tubeWallMm);
    const volumeMm3 = Math.PI * (Math.pow(rOuter, 2) - Math.pow(rInner, 2)) * lengthMm;
    const volumeCm3 = volumeMm3 / 1000;
    cfrpWeight = volumeCm3 * DENSITY_CFRP;
    aluWeight = volumeCm3 * DENSITY_ALUMINUM;
    steelWeight = volumeCm3 * DENSITY_STEEL;
  }

  const weightSavingsAlu = Math.round(((aluWeight - cfrpWeight) / aluWeight) * 100);
  const weightSavingsSteel = Math.round(((steelWeight - cfrpWeight) / steelWeight) * 100);

  return (
    <section id="estimator" className="section-wrap">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div className="section-tag">
            <span>[ 06 // SPECIFICATION ESTIMATOR ]</span>
          </div>
          <h2 className="section-title">
            Calculate Weight Savings <span style={{ color: 'var(--accent-blue-bright)' }}>in Real Time</span>.
          </h2>
          <p className="section-desc">
            Input component dimensions to calculate structural weight and evaluate mass reduction compared to conventional metallic alloys.
          </p>
        </div>

        {/* Estimator Blueprint Panel */}
        <div className="estimator-blueprint-panel blueprint-crosshair">
          <div className="estimator-inner-grid">
            
            {/* Input Controls */}
            <div className="estimator-inputs-col">
              <div className="calc-field-wrap">
                <label className="calc-label">Select Component Geometry</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setComponentType('plate')}
                    className={`btn ${componentType === 'plate' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: 1, padding: '10px' }}
                  >
                    Custom Plate
                  </button>
                  <button
                    onClick={() => setComponentType('tube')}
                    className={`btn ${componentType === 'tube' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: 1, padding: '10px' }}
                  >
                    Structural Tube
                  </button>
                </div>
              </div>

              {componentType === 'plate' ? (
                <div className="input-row-flex">
                  <div className="calc-field-wrap">
                    <label className="calc-label">Length (mm)</label>
                    <input
                      type="number"
                      value={lengthMm}
                      onChange={(e) => setLengthMm(Number(e.target.value))}
                      className="calc-input"
                      min="10"
                      max="3000"
                    />
                  </div>

                  <div className="calc-field-wrap">
                    <label className="calc-label">Width (mm)</label>
                    <input
                      type="number"
                      value={widthMm}
                      onChange={(e) => setWidthMm(Number(e.target.value))}
                      className="calc-input"
                      min="10"
                      max="1500"
                    />
                  </div>

                  <div className="calc-field-wrap">
                    <label className="calc-label">Thickness (mm)</label>
                    <input
                      type="number"
                      value={thicknessMm}
                      onChange={(e) => setThicknessMm(Number(e.target.value))}
                      step="0.5"
                      className="calc-input"
                      min="0.5"
                      max="50"
                    />
                  </div>
                </div>
              ) : (
                <div className="input-row-flex">
                  <div className="calc-field-wrap">
                    <label className="calc-label">Tube Length (mm)</label>
                    <input
                      type="number"
                      value={lengthMm}
                      onChange={(e) => setLengthMm(Number(e.target.value))}
                      className="calc-input"
                      min="10"
                      max="3000"
                    />
                  </div>

                  <div className="calc-field-wrap">
                    <label className="calc-label">Outer Dia OD (mm)</label>
                    <input
                      type="number"
                      value={tubeOdMm}
                      onChange={(e) => setTubeOdMm(Number(e.target.value))}
                      className="calc-input"
                      min="4"
                      max="300"
                    />
                  </div>

                  <div className="calc-field-wrap">
                    <label className="calc-label">Wall Thickness (mm)</label>
                    <input
                      type="number"
                      value={tubeWallMm}
                      onChange={(e) => setTubeWallMm(Number(e.target.value))}
                      step="0.5"
                      className="calc-input"
                      min="0.5"
                      max="25"
                    />
                  </div>
                </div>
              )}

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                *Calculations assume 60% fiber volume aerospace-grade carbon prepreg matrix (density 1.55 g/cm³).
              </div>
            </div>

            {/* Calculated Output Readout */}
            <div className="estimator-output-box">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                ESTIMATED COMPOSITE WEIGHT
              </div>

              <div className="output-weight-big">
                <span className="weight-huge-num">
                  {cfrpWeight < 1000 ? Math.round(cfrpWeight) : (cfrpWeight / 1000).toFixed(2)}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--accent-cyan)' }}>
                  {cfrpWeight < 1000 ? 'Grams' : 'Kg'}
                </span>
              </div>

              {/* Weight Comparison Progress Bars */}
              <div className="weight-comparison-bars">
                <div className="comp-bar-item">
                  <div className="comp-bar-meta">
                    <span>ANY-CFRP (1.55 g/cm³)</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      {Math.round(cfrpWeight)} g (Baseline)
                    </span>
                  </div>
                  <div className="comp-bar-track">
                    <div className="comp-bar-fill" style={{ width: '30%', background: 'var(--accent-cyan)' }} />
                  </div>
                </div>

                <div className="comp-bar-item">
                  <div className="comp-bar-meta">
                    <span>Aluminum 6061-T6 (2.70 g/cm³)</span>
                    <span style={{ color: '#f59e0b' }}>
                      {Math.round(aluWeight)} g (-{weightSavingsAlu}% lighter)
                    </span>
                  </div>
                  <div className="comp-bar-track">
                    <div className="comp-bar-fill" style={{ width: '55%', background: '#f59e0b' }} />
                  </div>
                </div>

                <div className="comp-bar-item">
                  <div className="comp-bar-meta">
                    <span>Stainless Steel 316 (7.85 g/cm³)</span>
                    <span style={{ color: '#ef4444' }}>
                      {Math.round(steelWeight)} g (-{weightSavingsSteel}% lighter)
                    </span>
                  </div>
                  <div className="comp-bar-track">
                    <div className="comp-bar-fill" style={{ width: '100%', background: '#ef4444' }} />
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenQuote}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                <span>Request Quote For This Specification</span>
                <ArrowUpRight size={15} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
