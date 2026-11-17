import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Zap, Activity, Layers, Rotate3d, Compass } from 'lucide-react';

export default function Hero3DCanvas() {
  const mountRef = useRef(null);
  const [activeMode, setActiveMode] = useState('cad'); // 'cad' | 'laser' | 'fea' | 'exploded'
  const [coordinates, setCoordinates] = useState({ x: 124.5, y: -48.2, z: 12.0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Dramatic Technical Hardware Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x3b82f6, 3.0);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x06b6d4, 4.0);
    cyanRimLight.position.set(-6, -4, -4);
    scene.add(cyanRimLight);

    const topSpot = new THREE.PointLight(0xffffff, 2.5, 20);
    topSpot.position.set(0, 6, 2);
    scene.add(topSpot);

    // 3. Materials
    // A) Carbon Fiber Prepreg (Deep graphite with anisotropic sheen)
    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.28,
      metalness: 0.85,
      wireframe: false,
    });

    // B) CAD Wireframe Edge Material (Electric cyan)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    // C) Titanium Hardware Inserts
    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0xa0a8b4,
      metalness: 0.95,
      roughness: 0.2,
    });

    // D) FEA Stress Shader/Color Material
    const feaMaterial = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.3,
      metalness: 0.5,
    });

    // 4. Procedural Aerospace Composite Assembly
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Sub-assembly groups for Exploded View
    const coreGroup = new THREE.Group();
    const outerRingGroup = new THREE.Group();
    const strutsGroup = new THREE.Group();
    const hardwareGroup = new THREE.Group();

    mainGroup.add(coreGroup);
    mainGroup.add(outerRingGroup);
    mainGroup.add(strutsGroup);
    mainGroup.add(hardwareGroup);

    // Assembly Part 1: Central Carbon Fiber Hub
    const hubGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.8, 32);
    const hubMesh = new THREE.Mesh(hubGeo, carbonMaterial);
    const hubWire = new THREE.Mesh(hubGeo, wireframeMaterial);
    coreGroup.add(hubMesh);
    coreGroup.add(hubWire);

    // Central Titanium Bushing with Chamfer
    const bushingGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.85, 24);
    const bushingMesh = new THREE.Mesh(bushingGeo, titaniumMaterial);
    hardwareGroup.add(bushingMesh);

    // Assembly Part 2: Outer Aerodynamic Torus / Stiffener Ring
    const ringGeo = new THREE.TorusGeometry(2.2, 0.16, 24, 64);
    const ringMesh = new THREE.Mesh(ringGeo, carbonMaterial);
    const ringWire = new THREE.Mesh(ringGeo, wireframeMaterial);
    outerRingGroup.add(ringMesh);
    outerRingGroup.add(ringWire);

    // Assembly Part 3: 4 Cross-Struts (Aero Spars) with Bolt Bosses
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;

      // Spar Arm
      const sparGeo = new THREE.BoxGeometry(1.4, 0.14, 0.35);
      const sparMesh = new THREE.Mesh(sparGeo, carbonMaterial);
      const sparWire = new THREE.Mesh(sparGeo, wireframeMaterial);

      sparMesh.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
      sparMesh.rotation.z = angle;
      sparWire.position.copy(sparMesh.position);
      sparWire.rotation.copy(sparMesh.rotation);

      strutsGroup.add(sparMesh);
      strutsGroup.add(sparWire);

      // Titanium Fastener Boss at outer periphery
      const bossGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.45, 16);
      const bossMesh = new THREE.Mesh(bossGeo, titaniumMaterial);
      bossMesh.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, 0);
      bossMesh.rotation.x = Math.PI / 2;
      hardwareGroup.add(bossMesh);
    }

    // Assembly Part 4: Aerodynamic Multi-Axis Vane Fins
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + Math.PI / 8;
      const finGeo = new THREE.ConeGeometry(0.12, 1.1, 4);
      const finMesh = new THREE.Mesh(finGeo, carbonMaterial);
      finMesh.position.set(Math.cos(angle) * 1.3, Math.sin(angle) * 1.3, 0);
      finMesh.rotation.z = angle - Math.PI / 2;
      finMesh.rotation.x = 0.3;
      strutsGroup.add(finMesh);
    }

    // 5. Laser Scanning Plane & Particle Ring
    const laserPlaneGeo = new THREE.PlaneGeometry(5.5, 0.08);
    const laserPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    });
    const laserMesh = new THREE.Mesh(laserPlaneGeo, laserPlaneMat);
    laserMesh.visible = false;
    scene.add(laserMesh);

    // Glowing Laser Line Glow
    const laserGlowGeo = new THREE.PlaneGeometry(5.5, 0.4);
    const laserGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00a2ff,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const laserGlowMesh = new THREE.Mesh(laserGlowGeo, laserGlowMat);
    laserMesh.add(laserGlowMesh);

    // Coordinate Orbit Grid (Subtle HUD Rings in 3D)
    const orbitRing1 = new THREE.Mesh(
      new THREE.RingGeometry(2.8, 2.82, 64),
      new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.15, side: THREE.DoubleSide })
    );
    scene.add(orbitRing1);

    const orbitRing2 = new THREE.Mesh(
      new THREE.RingGeometry(3.3, 3.31, 64),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
    );
    scene.add(orbitRing2);

    // 6. Particle Cloud (Orbital Micro Carbon Nanotubes)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Initial Tilt for Dynamic CAD Angle
    mainGroup.rotation.x = 0.55;
    mainGroup.rotation.y = -0.4;

    // 7. Mouse Interactivity (Orbit & Parallax)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: 0.55, y: -0.4 };
    let mouseNorm = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -((e.clientY - rect.top) / height) * 2 + 1;
      mouseNorm = { x, y };

      // Update live coordinates readout
      setCoordinates({
        x: Number((x * 150).toFixed(1)),
        y: Number((y * 150).toFixed(1)),
        z: Number(((x + y) * 25).toFixed(1)),
      });

      if (!isDragging) {
        targetRotation.x = 0.55 - y * 0.35;
        targetRotation.y = -0.4 + x * 0.45;
      } else {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetRotation.y += deltaX * 0.01;
        targetRotation.x += deltaY * 0.01;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support for mobile
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;
        targetRotation.y += deltaX * 0.01;
        targetRotation.x += deltaY * 0.01;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchEnd = () => {
      isDragging = false;
    };
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // 8. Animation Render Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous subtle idle rotation when not dragging
      if (!isDragging) {
        targetRotation.y += 0.003;
      }

      // Smooth damping interpolation
      mainGroup.rotation.x += (targetRotation.x - mainGroup.rotation.x) * 0.08;
      mainGroup.rotation.y += (targetRotation.y - mainGroup.rotation.y) * 0.08;

      // Orbit rings tilt
      orbitRing1.rotation.z = elapsedTime * 0.05;
      orbitRing2.rotation.z = -elapsedTime * 0.03;
      particleSystem.rotation.y = elapsedTime * 0.02;

      // MODE ANIMATIONS
      // Laser Scan Mode
      if (container.dataset.mode === 'laser') {
        laserMesh.visible = true;
        const scanY = Math.sin(elapsedTime * 2.5) * 2.4;
        laserMesh.position.y = scanY;
        laserMesh.rotation.x = mainGroup.rotation.x;
        laserMesh.rotation.y = mainGroup.rotation.y;

        // Pulse wireframe opacity with laser
        wireframeMaterial.opacity = 0.5 + Math.sin(elapsedTime * 5) * 0.3;
      } else {
        laserMesh.visible = false;
      }

      // FEA Stress Heatmap Mode
      if (container.dataset.mode === 'fea') {
        const hue = (Math.sin(elapsedTime * 1.5) + 1) / 2; // 0 to 1
        // Interpolate between cyan (0.5), green (0.3), and fiery orange (0.05)
        feaMaterial.color.setHSL(0.5 - hue * 0.45, 0.95, 0.5);
        hubMesh.material = feaMaterial;
        ringMesh.material = feaMaterial;
      } else {
        hubMesh.material = carbonMaterial;
        ringMesh.material = carbonMaterial;
      }

      // Exploded Assembly Mode
      if (container.dataset.mode === 'exploded') {
        outerRingGroup.position.z = THREE.MathUtils.lerp(outerRingGroup.position.z, 1.4, 0.08);
        hardwareGroup.position.z = THREE.MathUtils.lerp(hardwareGroup.position.z, 2.0, 0.08);
        strutsGroup.position.z = THREE.MathUtils.lerp(strutsGroup.position.z, -0.9, 0.08);
      } else {
        outerRingGroup.position.z = THREE.MathUtils.lerp(outerRingGroup.position.z, 0, 0.08);
        hardwareGroup.position.z = THREE.MathUtils.lerp(hardwareGroup.position.z, 0, 0.08);
        strutsGroup.position.z = THREE.MathUtils.lerp(strutsGroup.position.z, 0, 0.08);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="hero-3d-visualizer-box blueprint-crosshair"
      data-mode={activeMode}
      style={{
        position: 'relative',
        width: '100%',
        height: '480px',
        background: 'radial-gradient(circle at 50% 50%, #0d121c 0%, #08090c 80%)',
        border: '1px solid var(--border-hairline)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 24px 70px rgba(0, 0, 0, 0.6)'
      }}
    >
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          position: 'absolute',
          inset: 0,
          zIndex: 1
        }}
      />

      {/* Top HUD Bar: Title & Live Coordinate Telemetry */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '18px',
          right: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 2,
          pointerEvents: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="status-pulse-dot" style={{ background: 'var(--accent-cyan)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#ffffff', letterSpacing: '0.08em' }}>
            3D AEROSPACE ROTOR // INTERACTIVE CAD
          </span>
        </div>

        {/* Real-Time Tracking Telemetry Coordinates */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            background: 'rgba(0, 0, 0, 0.6)',
            padding: '4px 10px',
            borderRadius: '4px',
            border: '1px solid var(--border-hairline)'
          }}
        >
          <span>X: <strong style={{ color: 'var(--accent-cyan)' }}>{coordinates.x}</strong></span>
          <span>Y: <strong style={{ color: 'var(--accent-cyan)' }}>{coordinates.y}</strong></span>
          <span>Z: <strong style={{ color: 'var(--accent-cyan)' }}>{coordinates.z}</strong></span>
        </div>
      </div>

      {/* Crosshair Overlay Reticle */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          border: '1px dashed rgba(6, 182, 212, 0.25)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '6px',
          height: '6px',
          background: 'var(--accent-cyan)',
          borderRadius: '50%',
          opacity: 0.5
        }} />
      </div>

      {/* Floating Dimension Callout Badges */}
      <div
        style={{
          position: 'absolute',
          bottom: '72px',
          left: '18px',
          zIndex: 2,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <div style={{
          background: 'rgba(14, 17, 23, 0.85)',
          border: '1px solid var(--border-hairline)',
          borderRadius: '4px',
          padding: '4px 10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-high)',
          backdropFilter: 'blur(8px)'
        }}>
          <span>⌀ 120mm</span> // 5-AXIS CNC MILLED
        </div>
        <div style={{
          background: 'rgba(14, 17, 23, 0.85)',
          border: '1px solid var(--border-hairline)',
          borderRadius: '4px',
          padding: '4px 10px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--accent-emerald)',
          backdropFilter: 'blur(8px)'
        }}>
          ● FIBER RUNTIME: T800 PREPREG 60% VOL
        </div>
      </div>

      {/* Bottom Interactive Mode Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '18px',
          right: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 3
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveMode('cad')}
            className={`btn ${activeMode === 'cad' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '10px' }}
          >
            <Rotate3d size={13} />
            <span>3D Orbit CAD</span>
          </button>

          <button
            onClick={() => setActiveMode('laser')}
            className={`btn ${activeMode === 'laser' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '10px' }}
          >
            <Zap size={13} />
            <span>Laser Scan NDT</span>
          </button>

          <button
            onClick={() => setActiveMode('fea')}
            className={`btn ${activeMode === 'fea' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '10px' }}
          >
            <Activity size={13} />
            <span>FEA Stress Map</span>
          </button>

          <button
            onClick={() => setActiveMode('exploded')}
            className={`btn ${activeMode === 'exploded' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '10px' }}
          >
            <Layers size={13} />
            <span>Exploded Layup</span>
          </button>
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Compass size={12} />
          <span>DRAG TO ROTATE</span>
        </div>
      </div>

    </div>
  );
}
