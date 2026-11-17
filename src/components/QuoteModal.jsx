import React, { useState } from 'react';
import { X, CheckCircle2, ArrowUpRight, Hexagon } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

export default function QuoteModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    sector: 'Aerospace & Defense',
    productInterest: 'Custom Parts (CNC)',
    details: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay-backdrop" onClick={handleClose}>
      <div className="modal-content-box blueprint-crosshair" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleClose}
          className="modal-close-btn"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '36px 12px' }}>
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
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Request Successfully Queued
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-medium)', marginBottom: '24px', lineHeight: '1.6' }}>
              Thank you, <strong>{formData.name}</strong>. Our engineering leads at {companyData.legalName} in Navi Mumbai have received your composite specifications and will review tolerances within 24 hours.
            </p>
            <button onClick={handleClose} className="btn btn-primary" style={{ margin: '0 auto' }}>
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Hexagon size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)' }}>
                ANY COMPOSITES // TECHNICAL RFP
              </span>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
              Request Spec & Manufacturing Quote
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-medium)', marginBottom: '24px' }}>
              Provide your composite application requirements for aerospace, naval, or industrial production.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group-duo">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label>Company / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AeroDynamics Corp"
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
                    placeholder="anand@company.com"
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
                  <label>Industry Application</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  >
                    <option>Aerospace & Defense</option>
                    <option>UAV & Drone Structures</option>
                    <option>Marine & Radomes</option>
                    <option>Railway & Metro</option>
                    <option>Medical Applications</option>
                    <option>Robotics Components</option>
                    <option>Wind Turbine Blades</option>
                    <option>Industrial & Construction</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Product Line</label>
                  <select
                    value={formData.productInterest}
                    onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                  >
                    <option>Custom Parts (5-Axis CNC)</option>
                    <option>Custom Carbon Fiber Sheets</option>
                    <option>Custom Carbon Fiber Tubes</option>
                    <option>Complete Turnkey Project</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Dimensions, Tolerances & Quantity</label>
                <textarea
                  rows={3}
                  placeholder="Outline dimensions (L x W x H), fiber orientation, resin matrix, or required volume..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                <span>Transmit Specification Request</span>
                <ArrowUpRight size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
