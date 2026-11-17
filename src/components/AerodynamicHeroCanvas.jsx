import React, { useEffect, useRef, useState } from 'react';

export default function AerodynamicHeroCanvas() {
  const canvasRef = useRef(null);
  const [telemetry, setTelemetry] = useState({
    velocity: '240.4 m/s',
    reynolds: '1.24 × 10⁶',
    flowState: 'LAMINAR BOUNDARY',
    mach: '0.72'
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    // Mouse tracking for fluid obstacle deflection
    let mouse = {
      x: width * 0.65,
      y: height * 0.45,
      targetX: width * 0.65,
      targetY: height * 0.45,
      radius: 140,
      active: true
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;

      // Update telemetry dynamically based on mouse speed & position
      const vel = Math.round(220 + (mouse.targetX / width) * 60);
      const machVal = (vel / 340).toFixed(2);
      setTelemetry({
        velocity: `${vel}.8 m/s`,
        reynolds: `${(1.1 + (mouse.targetY / height) * 0.4).toFixed(2)} × 10⁶`,
        flowState: mouse.targetX > width * 0.7 ? 'TRANSONIC FLOW' : 'LAMINAR BOUNDARY',
        mach: `M ${machVal}`
      });
    };

    const handleMouseLeave = () => {
      mouse.targetX = width * 0.65;
      mouse.targetY = height * 0.45;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Streamline particle class
    class Streamline {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = init ? Math.random() * width : -20 - Math.random() * 50;
        this.y = Math.random() * height;
        this.speed = 4 + Math.random() * 5;
        this.length = 40 + Math.random() * 90;
        this.alpha = 0.15 + Math.random() * 0.65;
        this.thickness = 1 + Math.random() * 1.5;
        this.colorShift = Math.random(); // 0: electric cyan, 1: cobalt blue
      }

      update() {
        // Calculate distance from mouse cursor obstacle
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Fluid deflection vector (streamlines bend around the obstacle)
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 12;
          const angle = Math.atan2(dy, dx);
          this.y += Math.sin(angle) * force * 0.6;
          this.x += Math.cos(angle) * force * 0.2;
          this.speed = Math.min(this.speed * 1.05, 14); // Accelerate in wake
        } else {
          // Slowly restore natural speed
          this.speed += (6 - this.speed) * 0.05;
        }

        // Horizontal forward flight motion
        this.x += this.speed;

        // Reset if off-screen
        if (this.x > width + this.length) {
          this.reset(false);
        }
      }

      draw() {
        const gradient = ctx.createLinearGradient(this.x - this.length, this.y, this.x, this.y);
        if (this.colorShift > 0.4) {
          // Electric Cyan to Bright Blue
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0)');
          gradient.addColorStop(0.7, `rgba(6, 182, 212, ${this.alpha * 0.6})`);
          gradient.addColorStop(1, `rgba(59, 130, 246, ${this.alpha})`);
        } else {
          // Deep Cobalt to Pure White head
          gradient.addColorStop(0, 'rgba(28, 100, 242, 0)');
          gradient.addColorStop(0.8, `rgba(59, 130, 246, ${this.alpha * 0.7})`);
          gradient.addColorStop(1, `rgba(255, 255, 255, ${this.alpha * 0.95})`);
        }

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.moveTo(this.x - this.length, this.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        // Glowing particle head dot on select streamlines
        if (this.alpha > 0.4) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.thickness * 1.1, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00d2ff';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0; // Reset
        }
      }
    }

    // Generate 320 streamline particles
    const streamlines = Array.from({ length: 320 }, () => new Streamline());

    // Traveling laser light-paths (Webflow Hardware signature)
    let laserLightPathX = 0;
    let laserLightPathY = 0;

    let animId;
    const render = () => {
      animId = requestAnimationFrame(render);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Dark background clear with subtle trail persistence
      ctx.fillStyle = 'rgba(8, 9, 12, 0.45)';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle background blueprint grid
      const gridSize = 60;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Traveling horizontal laser light-beam along grid
      laserLightPathX = (laserLightPathX + 8) % (width + 300);
      const laserGradH = ctx.createLinearGradient(laserLightPathX - 180, 0, laserLightPathX, 0);
      laserGradH.addColorStop(0, 'rgba(6, 182, 212, 0)');
      laserGradH.addColorStop(0.8, 'rgba(6, 182, 212, 0.8)');
      laserGradH.addColorStop(1, 'rgba(255, 255, 255, 1)');
      ctx.beginPath();
      ctx.strokeStyle = laserGradH;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      const targetGridY = Math.floor(mouse.y / gridSize) * gridSize;
      ctx.moveTo(laserLightPathX - 180, targetGridY);
      ctx.lineTo(laserLightPathX, targetGridY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Traveling vertical laser light-beam along grid
      laserLightPathY = (laserLightPathY + 6) % (height + 300);
      const laserGradV = ctx.createLinearGradient(0, laserLightPathY - 180, 0, laserLightPathY);
      laserGradV.addColorStop(0, 'rgba(59, 130, 246, 0)');
      laserGradV.addColorStop(0.8, 'rgba(59, 130, 246, 0.7)');
      laserGradV.addColorStop(1, 'rgba(255, 255, 255, 1)');
      ctx.beginPath();
      ctx.strokeStyle = laserGradV;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 12;
      const targetGridX = Math.floor(mouse.x / gridSize) * gridSize;
      ctx.moveTo(targetGridX, laserLightPathY - 180);
      ctx.lineTo(targetGridX, laserLightPathY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Obstacle Deflection Halo around Cursor
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.radius * 0.75, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Center Crosshair target
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 1;
      ctx.moveTo(mouse.x - 12, mouse.y);
      ctx.lineTo(mouse.x + 12, mouse.y);
      ctx.moveTo(mouse.x, mouse.y - 12);
      ctx.lineTo(mouse.x, mouse.y + 12);
      ctx.stroke();

      // Update and draw streamlines
      for (let i = 0; i < streamlines.length; i++) {
        streamlines[i].update();
        streamlines[i].draw();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'auto'
        }}
      />

      {/* Real-time Aerodynamic CFD Wind-Tunnel Telemetry Box */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          right: '32px',
          background: 'rgba(14, 17, 23, 0.82)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-hairline)',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: 'var(--font-mono)',
          zIndex: 2,
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
          pointerEvents: 'none'
        }}
        className="blueprint-crosshair"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span className="status-pulse-dot" style={{ background: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '10.5px', color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>
            CFD WIND TUNNEL // SIMULATION
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '11px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>STREAM VEL: </span>
            <strong style={{ color: '#ffffff' }}>{telemetry.velocity}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>MACH NO: </span>
            <strong style={{ color: 'var(--accent-blue-bright)' }}>{telemetry.mach}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>REYNOLDS: </span>
            <strong style={{ color: '#ffffff' }}>{telemetry.reynolds}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>REGIME: </span>
            <strong style={{ color: 'var(--accent-emerald)' }}>{telemetry.flowState}</strong>
          </div>
        </div>

        <div style={{ fontSize: '9.5px', color: 'var(--text-dim)', marginTop: '2px', borderTop: '1px solid var(--border-hairline)', paddingTop: '4px' }}>
          INTERACTION: MOVE CURSOR TO DEFLECT AIRFLOW
        </div>
      </div>
    </div>
  );
}
