import React, { useState } from 'react';
import { Building2, Factory, Mail, Phone, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

export default function FacilitiesContact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    sector: 'Aerospace & Defense',
    material: 'Carbon Fiber (CFRP)',
    details: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section-wrap">
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '48px' }}>
          <div className="section-tag">
            <span>[ 08 // NAVI MUMBAI FACILITIES & DIRECT INQUIRY ]</span>
          </div>
          <h2 className="section-title">
            Visit Our Facilities. <span style={{ color: 'var(--accent-blue-bright)' }}>Build With Us.</span>
          </h2>
          <p className="section-desc">
            Connect directly with our engineering team in Navi Mumbai for structural design consultations, rapid prototyping, and volume production quotes.
          </p>
        </div>

        <div className="facilities-split-grid">
          
          {/* Left: Dual Facility Cards & Contact Details */}
          <div>
            
            {/* HQ Card */}
            <div className="facility-card-item blueprint-crosshair">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Building2 size={16} style={{ color: 'var(--accent-cyan)' }} />
                <div className="facility-name">{companyData.contact.hq.name}</div>
              </div>
              <h3 className="facility-company">{companyData.contact.hq.company}</h3>
              <p className="facility-address">{companyData.contact.hq.address}</p>

              <div className="facility-meta-chips">
                <span className="facility-chip">Executive & Engineering HQ</span>
                <span className="facility-chip">CAD / CAM & FEA Lab</span>
                <span className="facility-chip">Client Briefing Center</span>
              </div>
            </div>

            {/* Manufacturing Plant Card */}
            <div className="facility-card-item blueprint-crosshair">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Factory size={16} style={{ color: 'var(--accent-blue-bright)' }} />
                <div className="facility-name">{companyData.contact.plant.name}</div>
              </div>
              <h3 className="facility-company">{companyData.contact.plant.company}</h3>
              <p className="facility-address">{companyData.contact.plant.address}</p>

              <div className="facility-meta-chips">
                <span className="facility-chip">Autoclave Cleanroom Curing</span>
                <span className="facility-chip">5-Axis Waterjet & CNC</span>
                <span className="facility-chip">Ultrasonic NDT Lab</span>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-hairline)',
              borderRadius: '10px',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <Phone size={15} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Direct Line:</span>
                <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{companyData.contact.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <Mail size={15} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Inquiries:</span>
                <span style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{companyData.contact.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <Clock size={15} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Hours:</span>
                <span style={{ color: 'var(--text-medium)', fontSize: '12px' }}>{companyData.contact.hours}</span>
              </div>
            </div>

          </div>

          {/* Right: Technical Request For Proposal (RFP) Form */}
          <div className="rfp-form-card blueprint-crosshair">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--border-hairline)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>Technical RFP Form</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Response within 24 business hours</p>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-emerald)' }}>
                ● DIRECT ROUTE
              </span>
            </div>

            {submitted ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid var(--accent-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: 'var(--accent-emerald)'
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                  Inquiry Received
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-medium)', marginBottom: '24px', lineHeight: '1.6' }}>
                  Thank you. An AeroMac Dynamics application engineer will review your composite specifications and contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-ghost"
                  style={{ margin: '0 auto' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rfp-form">
                <div className="form-group-duo">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Company / Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AeroTech Systems"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-duo">
                  <div className="form-field">
                    <label>Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="rajesh@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label>Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-duo">
                  <div className="form-field">
                    <label>Industry Sector</label>
                    <select
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    >
                      <option>Aerospace & Defense</option>
                      <option>UAV & Drone Systems</option>
                      <option>Marine & Radomes</option>
                      <option>Rail & Mass Transit</option>
                      <option>Industrial Robotics</option>
                      <option>Medical Components</option>
                      <option>Other Custom Hardware</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Material Focus</label>
                    <select
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    >
                      <option>Carbon Fiber (CFRP Prepreg)</option>
                      <option>Glass Fiber (GFRP / S2 Glass)</option>
                      <option>Aramid / Carbon Hybrid</option>
                      <option>Custom Weave / Pultrusion</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label>Project Details & Target Quantities</label>
                  <textarea
                    rows={4}
                    placeholder="Provide dimensions, operational temperatures, load specifications or volume requirements..."
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                  <span>Submit Technical RFP</span>
                  <ArrowUpRight size={16} />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
