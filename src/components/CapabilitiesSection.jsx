import React, { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';
import { CapabilitySchematicBlock } from './EffectsBlocks';

export default function CapabilitiesSection({ onSelectCapability }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const categories = ['ALL', 'Aerospace & Defense', 'Mass Transit', 'Clean Energy', 'Healthcare', 'Robotics', 'Industrial'];

  const filteredCapabilities = activeFilter === 'ALL'
    ? companyData.capabilities
    : companyData.capabilities.filter(c => c.category.toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter === 'ALL');

  return (
    <section id="capabilities" className="py-24 bg-[#0a0a0c] border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-3">
              OUR CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
              Engineered. Manufactured. Delivered.
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md font-sans">
            Advanced composite solutions engineered for 8 mission-critical industries.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#121316] text-slate-400 border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 8 Sector Cards Grid with Raw Schematic Vector Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {filteredCapabilities.map((cap) => (
            <div
              key={cap.id}
              onClick={() => onSelectCapability(cap)}
              className="swiss-card flex flex-col justify-between p-6 cursor-pointer group hover:border-white/40"
            >
              <div>
                {/* Top Meta Bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-white/40 group-hover:text-white transition-colors">
                    {cap.id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] uppercase font-semibold border border-white/20">
                    {cap.badge}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-white transition-colors mb-3 font-sans">
                  {cap.title}
                </h3>

                {/* Raw Wireframe Schematic Block */}
                <div className="mb-4">
                  <CapabilitySchematicBlock id={cap.id} title={cap.category} />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
                  {cap.short}
                </p>
              </div>

              {/* Specs Bullets */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                {cap.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <Check className="w-3 h-3 text-white shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
                
                <div className="mt-4 pt-2 flex items-center justify-between text-xs font-mono text-white font-semibold group-hover:translate-x-1 transition-transform">
                  <span>VIEW SPEC SHEET</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
