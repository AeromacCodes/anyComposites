import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

const FlowCard = ({ cap, isCenter, onSelectCapability }) => {
  return (
    <div
      className={`sector-card blueprint-crosshair flow-card-transition ${isCenter ? 'flow-card-center' : 'flow-card-dim'}`}
      style={{
        width: '320px',
        flexShrink: 0,
        scrollSnapAlign: 'center',
      }}
    >
      <div className="sector-card-top" style={{ position: 'relative', zIndex: 10 }}>
        <div className="sector-card-meta">
          <span className="sector-id-pill">[ {cap.id} ]</span>
          <span className="sector-badge">{cap.badge}</span>
        </div>

        <h3 className="sector-card-title">{cap.title}</h3>
        <p className="sector-card-desc">{cap.short}</p>

        <div className="sector-spec-tags">
          {cap.specs.map((spec, sIdx) => (
            <div key={sIdx} className="sector-spec-tag">
              <CheckCircle2 size={13} />
              <span>{spec}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sector-card-footer" style={{ position: 'relative', zIndex: 10 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
          {cap.category}
        </span>
        <button
          onClick={() => onSelectCapability(cap)}
          className="sector-action-link"
        >
          <span>View Specs</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default function SectorsGrid({ onSelectCapability }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [centerId, setCenterId] = useState(null);
  const observerRef = useRef(null);
  
  const filterTabs = [
    { id: 'ALL', label: 'All Sectors (08)' },
    { id: 'Aerospace & Defense', label: 'Aerospace & Defense' },
    { id: 'Defense & Maritime', label: 'Maritime & Radomes' },
    { id: 'Mass Transit', label: 'Rail & Transit' },
    { id: 'Robotics', label: 'Robotics & Medical' }
  ];

  const filteredCapabilities = companyData.capabilities.filter(cap => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'Robotics') {
      return cap.category === 'Advanced Robotics' || cap.category === 'Healthcare Technology';
    }
    return cap.category === activeFilter;
  });

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      // Find the most visible card in the center
      let maxRatio = 0;
      let maxId = null;
      entries.forEach(entry => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          maxId = entry.target.dataset.id;
        }
      });
      if (maxId) {
        setCenterId(maxId);
      }
    }, {
      root: document.querySelector('.sectors-flow-track'),
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: '0px -40% 0px -40%'
    });

    const cards = document.querySelectorAll('.flow-card-transition');
    cards.forEach(card => observerRef.current.observe(card));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [filteredCapabilities]);

  return (
    <section id="sectors" style={{ position: 'relative', padding: '90px 0' }}>
      <div className="container" style={{ paddingBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="section-tag">
            <span>[ 04 // SECTOR DIRECTORY ]</span>
          </div>
          <h2 className="section-title">
            Engineered for <span style={{ color: 'var(--accent-blue-bright)' }}>High-Stress</span> Environments.
          </h2>
        </div>

        <div className="sectors-filter-tabs" style={{ marginTop: '24px' }}>
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`filter-tab-pill ${activeFilter === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sectors-flow-container">
        <div className="sectors-flow-track">
          {/* Empty spacer to allow centering first card */}
          <div style={{ width: 'calc(50vw - 160px)', flexShrink: 0 }}></div>
          
          {filteredCapabilities.map((cap) => (
            <div data-id={cap.id} key={cap.id} className="flow-card-transition" style={{ scrollSnapAlign: 'center' }}>
               <FlowCard 
                cap={cap} 
                isCenter={centerId === cap.id}
                onSelectCapability={onSelectCapability}
              />
            </div>
          ))}

          {/* Empty spacer to allow centering last card */}
          <div style={{ width: 'calc(50vw - 160px)', flexShrink: 0 }}></div>
        </div>
      </div>
    </section>
  );
}
