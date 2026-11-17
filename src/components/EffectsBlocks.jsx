import React from 'react';

// Hero Hardware Centerpiece (Pure SVG & CSS 3D Mechanical Block)
export function HardwareCenterpieceBlock() {
  return (
    <div className="relative w-full max-w-2xl mx-auto py-8 flex flex-col items-center justify-center">
      {/* 3D Wireframe Hardware SVG Structure */}
      <svg
        viewBox="0 0 600 320"
        className="w-full h-auto max-h-[300px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f2430" />
            <stop offset="50%" stopColor="#0d1017" />
            <stop offset="100%" stopColor="#161b26" />
          </linearGradient>

          <linearGradient id="blueGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#888888" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          <pattern id="carbonPattern" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill="#0c0e14" />
            <path d="M0 6L6 0L12 6L6 12Z" fill="#151924" opacity="0.8" />
            <path d="M6 0L12 6L6 12L0 6Z" fill="#1b202e" opacity="0.4" />
          </pattern>
        </defs>

        {/* Outer Structural Plate */}
        <polygon
          points="80,260 220,60 380,60 520,260 460,260 360,110 240,110 140,260"
          fill="url(#carbonPattern)"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Inner Cutouts & Machined Pockets */}
        <polygon
          points="160,240 245,130 290,130 205,240"
          fill="#06070a"
          stroke="#ffffff"
          strokeWidth="1"
          strokeOpacity="0.25"
        />

        <polygon
          points="395,240 310,130 355,130 440,240"
          fill="#06070a"
          stroke="#ffffff"
          strokeWidth="1"
          strokeOpacity="0.25"
        />

        {/* Precision Bushings & Fasteners */}
        <circle cx="100" cy="245" r="16" fill="url(#metalGrad)" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="100" cy="245" r="8" fill="#06070a" stroke="#ffffff" strokeWidth="1" />

        <circle cx="500" cy="245" r="16" fill="url(#metalGrad)" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="500" cy="245" r="8" fill="#06070a" stroke="#ffffff" strokeWidth="1" />

        <circle cx="230" cy="80" r="14" fill="url(#metalGrad)" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="230" cy="80" r="6" fill="#06070a" />

        <circle cx="370" cy="80" r="14" fill="url(#metalGrad)" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="370" cy="80" r="6" fill="#06070a" />

        {/* Dimension Alignment Lines & Measurements */}
        <line x1="80" y1="280" x2="520" y2="280" stroke="#888888" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="80" y1="275" x2="80" y2="285" stroke="#ffffff" strokeWidth="1" />
        <line x1="520" y1="275" x2="520" y2="285" stroke="#ffffff" strokeWidth="1" />
        <text x="300" y="295" fill="#ffffff" fontSize="10" fontFamily="monospace" textAnchor="middle" letterSpacing="1">
          500.00 mm [±0.02 TOLERANCE]
        </text>

        {/* Laser Inspection Path */}
        <path d="M 60 180 L 540 180" stroke="url(#blueGlowGrad)" strokeWidth="1.5" strokeDasharray="8 8">
          <animate attributeName="stroke-dashoffset" from="0" to="32" dur="2s" repeatCount="indefinite" />
        </path>

        {/* Status Callout Pill */}
        <rect x="235" y="180" width="130" height="22" rx="4" fill="#0d1017" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.4" />
        <text x="300" y="195" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle">
          CFRP MATRIX V4.2
        </text>
      </svg>

      {/* Pure CSS Studio Floor Reflection Shadow */}
      <div className="w-3/4 h-4 bg-black/80 blur-lg rounded-full -mt-2" />
    </div>
  );
}

// Capability Vector Schematic Blocks (01 - 08)
export function CapabilitySchematicBlock({ id, title }) {
  return (
    <div className="w-full h-32 bg-[#090b10] rounded-lg border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden group hover:border-white/30 transition-colors">
      <div className="flex justify-between items-center z-10">
        <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">{title}</span>
        <span className="font-mono text-xs text-white/40">{id}</span>
      </div>

      {/* Vector Geometry Schematic Background */}
      <svg className="absolute inset-0 w-full h-full opacity-20 group-hover:opacity-30 transition-opacity" fill="none">
        <pattern id={`grid-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="2 2" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
        
        {/* Dynamic shape based on ID */}
        {id === '01' && <circle cx="80%" cy="50%" r="40" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4" />}
        {id === '02' && <path d="M 50 80 Q 150 20 250 80" stroke="#ffffff" strokeWidth="1.5" />}
        {id === '03' && <rect x="30%" y="30%" width="40%" height="40%" stroke="#ffffff" strokeWidth="1" />}
        {id === '04' && <line x1="20" y1="100" x2="280" y2="20" stroke="#ffffff" strokeWidth="1.5" />}
        {id === '05' && <path d="M 40 60 L 80 60 L 100 30 L 120 90 L 140 60 L 260 60" stroke="#ffffff" strokeWidth="1" />}
        {id === '06' && <polygon points="100,20 180,60 140,110 60,70" stroke="#ffffff" strokeWidth="1" />}
        {id === '07' && <ellipse cx="60%" cy="50%" rx="60" ry="20" stroke="#ffffff" strokeWidth="1" />}
        {id === '08' && <path d="M 30 30 L 250 30 M 30 60 L 250 60 M 30 90 L 250 90" stroke="#ffffff" strokeWidth="0.8" />}
      </svg>

      <div className="z-10 font-mono text-[10px] text-slate-400 flex justify-between items-center">
        <span>CAD // FEA VERIFIED</span>
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
      </div>
    </div>
  );
}

// Product Fiber Weave Wireframe Generator Block
export function ProductWeaveWireframeBlock({ type }) {
  return (
    <div className="w-full h-40 bg-[#07080b] rounded-lg border border-white/10 p-4 relative overflow-hidden flex flex-col justify-between font-mono">
      <div className="flex justify-between text-xs text-slate-400">
        <span>TYPE: {type.toUpperCase()}</span>
        <span>DENSITY: 1.55 g/cm³</span>
      </div>

      {/* Pure CSS Procedural Carbon Weave Simulation */}
      <div className="w-full h-20 rounded bg-[#0f121a] border border-white/5 overflow-hidden relative flex items-center justify-center">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px]" />
        
        {/* Dimension Overlay Callouts */}
        <div className="relative z-10 px-3 py-1 bg-[#06070a] border border-white/20 rounded text-[11px] text-white">
          {type === 'custom-sheets' && '3K TWILL WEAVE // 0.5 - 25.0mm'}
          {type === 'custom-tubes' && 'ROLL-WRAPPED CYLINDER // ±0.05mm OD'}
          {type === 'custom-parts' && '5-AXIS CNC MILLED // CUSTOM INSERTS'}
        </div>
      </div>

      <div className="flex justify-between text-[10px] text-slate-500">
        <span>MATRIX: EPOXY TG 130°C</span>
        <span>NDT: 100% UT PASS</span>
      </div>
    </div>
  );
}

// Facilities Blueprint Map Diagram Block
export function FacilitiesBlueprintMapBlock() {
  return (
    <div className="w-full h-64 bg-[#08090d] rounded-xl border border-white/10 p-6 relative overflow-hidden font-mono flex flex-col justify-between">
      {/* Grid Blueprint Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Map Nodes & Locations */}
      <div className="relative z-10 flex justify-between items-start text-xs text-slate-400">
        <div>
          <span className="text-white font-bold block text-sm">NAVI MUMBAI INDUSTRIAL MAP</span>
          <span>MAHARASHTRA, INDIA</span>
        </div>
        <span className="px-2 py-1 bg-white/10 border border-white/20 rounded text-[10px] text-white">
          COORDINATES: 19.0338° N, 73.0297° E
        </span>
      </div>

      {/* Vector Map Nodes Diagram */}
      <div className="relative z-10 grid grid-cols-2 gap-8 my-auto">
        {/* Node 1: HQ */}
        <div className="p-3 bg-[#0d1017] border border-white/20 rounded flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse shrink-0" />
          <div>
            <div className="text-xs text-white font-bold">HEADQUARTERS</div>
            <div className="text-[10px] text-slate-400">C-94, TTC Industrial Area, Turbhe</div>
          </div>
        </div>

        {/* Node 2: Manufacturing Plant */}
        <div className="p-3 bg-[#0d1017] border border-white/20 rounded flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse shrink-0" />
          <div>
            <div className="text-xs text-white font-bold">MANUFACTURING PLANT</div>
            <div className="text-[10px] text-slate-400">K-12, MIDC Industrial Area, Turbhe</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-between text-[10px] text-slate-500 pt-2 border-t border-white/10">
        <span>OPERATING HOURS: MON - SAT [10:00 AM - 7:00 PM IST]</span>
        <span>STATUS: ACTIVE PRODUCTION</span>
      </div>
    </div>
  );
}
