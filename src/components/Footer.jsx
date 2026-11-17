import React from 'react';
import { Hexagon, ArrowUpRight } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

export default function Footer({ onOpenQuote }) {
  return (
    <footer className="site-footer">
      <div className="container">
        
        <div className="footer-top-grid">
          
          {/* Col 1: Brand & Identity */}
          <div>
            <div className="brand-wrapper" style={{ marginBottom: '16px' }}>
              <div className="brand-logo-icon">
                <Hexagon size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="brand-title">
                  ANY <span>COMPOSITES</span>
                </div>
                <div className="brand-subtitle">
                  ADVANCED CFRP & GFRP
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-medium)', lineHeight: '1.6', marginBottom: '20px', maxWidth: '320px' }}>
              Manufactured by <strong>{companyData.legalName}</strong>. Engineering high-performance composite hardware for mission-critical aerospace, defense, and industrial applications.
            </p>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)' }}>
              HQ & Plant: MIDC Turbhe, Navi Mumbai, India
            </div>
          </div>

          {/* Col 2: Sectors */}
          <div>
            <div className="footer-col-title">SECTORS</div>
            <ul className="footer-links-list">
              <li><a href="#sectors">UAV & Aerospace</a></li>
              <li><a href="#sectors">Marine & Radomes</a></li>
              <li><a href="#sectors">High-Speed Rail</a></li>
              <li><a href="#sectors">Wind Energy</a></li>
              <li><a href="#sectors">Medical Devices</a></li>
              <li><a href="#sectors">Industrial Robotics</a></li>
            </ul>
          </div>

          {/* Col 3: Products & Tools */}
          <div>
            <div className="footer-col-title">PRODUCTS & CAD</div>
            <ul className="footer-links-list">
              <li><a href="#products">Custom CFRP Sheets</a></li>
              <li><a href="#products">Structural Carbon Tubes</a></li>
              <li><a href="#products">5-Axis CNC Finished Parts</a></li>
              <li><a href="#estimator">Weight & Volume Estimator</a></li>
              <li><a href="#manufacturing">Autoclave Cleanroom</a></li>
              <li><a href="#manufacturing">Ultrasonic NDT Testing</a></li>
            </ul>
          </div>

          {/* Col 4: Quick Inquiries */}
          <div>
            <div className="footer-col-title">SPECIFICATION INQUIRY</div>
            <p style={{ fontSize: '13px', color: 'var(--text-medium)', marginBottom: '16px', lineHeight: '1.5' }}>
              Directly request engineering documentation, CAD clearances, and quotes from our technical staff.
            </p>
            <button
              onClick={onOpenQuote}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <span>Request a Quote</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} ANY COMPOSITES // AeroMac Dynamics Private Limited. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>MIL-SPEC & AS9100 STANDARDS</span>
            <span>NAVI MUMBAI, MAHARASHTRA</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
