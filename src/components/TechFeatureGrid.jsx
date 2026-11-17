import React from 'react';
import { Cpu, ShieldCheck, Gauge, Zap, Layers, RefreshCw, BarChart2, Radio } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

export default function TechFeatureGrid() {
  const features = [
    {
      icon: Gauge,
      badge: "tolerance control",
      title: "±0.02mm Precision",
      desc: "Sub-millimeter dimension accuracy across all CFRP/GFRP components."
    },
    {
      icon: ShieldCheck,
      badge: "ndt verified",
      title: "100% NDT Inspected",
      desc: "Ultrasonic C-scan inspection verifying zero interior voids or delamination."
    },
    {
      icon: Layers,
      badge: "lightweight matrix",
      title: "1.55 g/cm³ Density",
      desc: "5x stronger than high-grade steel at less than 1/5th the structural mass."
    },
    {
      icon: Zap,
      badge: "thermal stability",
      title: "Near-Zero CTE",
      desc: "Ultra-low thermal expansion coefficient across carbon fiber axes."
    },
    {
      icon: Cpu,
      badge: "autoclave cured",
      title: "High-Temp Resin Matrix",
      desc: "Specialized epoxy formulations resistant to extreme 280°C environments."
    },
    {
      icon: RefreshCw,
      badge: "traceable supply",
      title: "Batch Serialized",
      desc: "Full material certification and raw fiber traceability for aerospace compliance."
    },
    {
      icon: BarChart2,
      badge: "5-axis cnc",
      title: "Complex Geometry",
      desc: "5-axis CNC trim and drill stations for tight tolerance composite inserts."
    },
    {
      icon: Radio,
      badge: "radome grade",
      title: "RF Transmissive GFRP",
      desc: "Dielectric glass fiber formulations engineered for radar & marine communications."
    }
  ];

  return (
    <section id="tech-specs" className="py-24 bg-[#07080b] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="dot-title">
              <span className="dot pulse" />
              <span className="badge-text">HARDWARE SPECIFICATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
              Precision Engineering Specs.
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md font-sans">
            Every component produced at ANY COMPOSITES adheres to rigorous aerospace, defense, and industrial quality control standard operating procedures.
          </p>
        </div>

        {/* Webflow Hardware Circuit Features Grid */}
        <div className="specs-circuit-grid">
          {features.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <div key={idx} className="specs-circuit-item group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded bg-[#146ef5]/10 text-[#146ef5] border border-[#146ef5]/20 group-hover:scale-110 transition-transform">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="badge-text text-[10px] text-slate-500">{feat.badge}</span>
                </div>

                <h3 className="font-bold text-base text-white mb-2 font-mono group-hover:text-[#146ef5] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {feat.desc}
                </p>

                {/* Circuit Grid Decorative Line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#146ef5]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>

        {/* CPX-9 Style Wide Section Banner from Webflow Hardware Template */}
        <div className="mt-16 relative rounded-2xl overflow-hidden border border-white/10 p-10 bg-gradient-to-r from-[#0b0e17] via-[#0d1220] to-[#0b0e17]">
          <div className="line-horizontal absolute top-0 left-0" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="badge-text mb-2">ADVANCED COMPOSITE MATRIX</div>
              <h3 className="text-3xl font-bold text-white mb-4">The ANY-CFRP High-Modulus Matrix</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
                Engineered to eliminate structural fatigue and thermal drift. Ideal for UAV airframes, satellite structural panels, robotic extremities, and high-rpm carbon drive shafts.
              </p>
              
              <div className="flex flex-wrap gap-4 font-mono text-xs text-slate-300">
                <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#146ef5]" /> High Flexural Rigidity
                </span>
                <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff]" /> Zero Corrosion
                </span>
                <span className="px-3 py-1.5 rounded bg-white/5 border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> UV Protected Finish
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <img
                src="/images/custom_sheets_tubes.jpg"
                alt="Carbon fiber sheets and tubes"
                className="rounded-xl border border-white/10 shadow-2xl object-cover h-48 w-full"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
