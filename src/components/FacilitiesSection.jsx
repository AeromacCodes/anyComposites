import React from 'react';
import { Phone, Mail, Globe, Clock, Building, Factory, ArrowUpRight } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

export default function FacilitiesSection({ onOpenQuote }) {
  return (
    <section id="contact" className="section">
      <div className="container">
        
        {/* Header */}
        <div className="section-header-split">
          <div>
            <div className="badge-indicator">
              <span className="badge-dot" />
              <span className="badge-label">GET IN TOUCH</span>
            </div>
            <h2 className="title-lg">
              Let's Build the Future Together.
            </h2>
          </div>

          <p className="section-header-desc">
            Headquartered in Navi Mumbai with dedicated precision engineering facilities, strategically positioned to serve domestic and international programs.
          </p>
        </div>

        {/* Contact Quick Strip */}
        <div className="contact-meta-strip">
          <a href={`tel:${companyData.contact.phone.replace(/\s+/g, '')}`} className="contact-meta-card">
            <div className="stat-icon-wrapper">
              <Phone size={16} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PHONE</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>{companyData.contact.phone}</div>
            </div>
          </a>

          <a href={`mailto:${companyData.contact.email}`} className="contact-meta-card">
            <div className="stat-icon-wrapper">
              <Mail size={16} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>EMAIL</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis' }}>{companyData.contact.email}</div>
            </div>
          </a>

          <a href={`https://${companyData.contact.website}`} target="_blank" rel="noopener noreferrer" className="contact-meta-card">
            <div className="stat-icon-wrapper">
              <Globe size={16} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PORTAL</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>{companyData.contact.website}</div>
            </div>
          </a>

          <div className="contact-meta-card">
            <div className="stat-icon-wrapper">
              <Clock size={16} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>HOURS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, color: '#ffffff' }}>10:00 AM – 7:00 PM IST</div>
            </div>
          </div>
        </div>

        {/* Dual Facility Cards */}
        <div className="facilities-grid">
          {/* Corporate Headquarters */}
          <div className="facility-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-blue-subtle)',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building size={22} />
              </div>

              <div>
                <span className="card-badge" style={{ fontSize: '0.65rem' }}>CORPORATE HEADQUARTERS</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                  {companyData.contact.hq.name}
                </h3>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              <div style={{ fontWeight: 600, color: '#ffffff' }}>{companyData.contact.hq.company}</div>
              <div>{companyData.contact.hq.address}</div>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-blue)' }}>
              Location: Navi Mumbai, Maharashtra 400705
            </div>
          </div>

          {/* Manufacturing Plant */}
          <div className="facility-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 210, 255, 0.1)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Factory size={22} />
              </div>

              <div>
                <span className="card-badge" style={{ fontSize: '0.65rem', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--accent-cyan)', borderColor: 'rgba(0, 210, 255, 0.2)' }}>PRODUCTION FACILITY</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                  {companyData.contact.plant.name}
                </h3>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              <div style={{ fontWeight: 600, color: '#ffffff' }}>{companyData.contact.plant.company}</div>
              <div>{companyData.contact.plant.address}</div>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
              Industrial Zone: Turbhe MIDC Hub
            </div>
          </div>
        </div>

        {/* Bottom Project Inquiry CTA Banner */}
        <div style={{
          marginTop: '48px',
          padding: '48px 36px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '20px'
        }}>
          <h3 className="title-md">
            Have a custom composite requirement or tender specification?
          </h3>
          <p style={{ maxWidth: '640px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Partner with ANY COMPOSITES for reliable, high-stiffness composite engineering that accelerates program timelines.
          </p>
          <button onClick={onOpenQuote} className="btn btn-primary">
            <span>Start a Project Consultation</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
