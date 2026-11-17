import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { companyData } from '../data/anyCompositesData';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#0a0a0c] border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-end">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-3">
              ABOUT ANY COMPOSITES
            </span>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-sans leading-tight">
              Built on Innovation.<br />
              Focused on Performance.
            </h2>
          </div>
          <div className="lg:col-span-5 text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
            {companyData.about.description}
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {companyData.about.whoWeAre.map((item, idx) => (
            <div
              key={idx}
              className="swiss-card flex flex-col justify-between min-h-[220px] group"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-2xl font-bold text-white/30 group-hover:text-white transition-colors">
                  0{idx + 1}
                </span>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  {item.title}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2 font-sans">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="line-divider mb-16" />

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Mission */}
          <div className="swiss-card p-10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-4">
                {companyData.purpose.mission.title}
              </span>
              <h3 className="text-2xl font-bold text-white mb-4">
                Empowering Industry with Advanced Composites
              </h3>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                {companyData.purpose.mission.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Target: Global Composites Excellence</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Vision */}
          <div className="swiss-card p-10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block mb-4">
                {companyData.purpose.vision.title}
              </span>
              <h3 className="text-2xl font-bold text-white mb-4">
                India's Premier Composites Engineering Partner
              </h3>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                {companyData.purpose.vision.description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Target: Industry Leadership</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
