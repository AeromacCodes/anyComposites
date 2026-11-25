import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import './HeroForge.css';

/*
  Opening storyline, played once on load: how a carbon bond becomes a finished part.
    1 the screen is a carbon lattice (hexagonal C-C bonds)
    2 the lattice sheet rolls into a tube, the tube thins into one filament, more filaments join -> a strand
    3 the strand spreads into flat fibre lines
    4 the lines gather into tows and weft tows are woven across them -> fabric
    5 a resin front sweeps across the fabric, leaving a cured panel, which is moulded into a skin
    6 the skin shrinks into the wing root while the airframe draws itself -> final product
*/

export const STAGES = [
  { name: 'Carbon bond', text: 'Carbon atoms lock into strong hexagonal bonds.' },
  { name: 'Carbon strands', text: 'The bonded sheets roll into filaments finer than a hair, bundled into a strand.' },
  { name: 'Fibre lines', text: 'Strands are spread into flat, aligned fibre lines.' },
  { name: 'Carbon fabric', text: 'The lines are gathered into tows and woven into a twill fabric.' },
  { name: 'Composite', text: 'Resin is infused, cured and moulded into a rigid laminate.' },
  { name: 'Final product', text: 'The laminate becomes a lightweight, high-strength airframe.' },
];

// timeline (seconds)
const G = 3.2; // the lattice grows from one ring for G seconds; everything else follows
const T = {
  grow: [0, G], // bonds form and multiply outward from a single hexagon
  roll: [G + 0.6, G + 3.2], // lattice rolls into a tube
  thin: [G + 3.2, G + 5.4], // tube thins into a filament, other filaments join
  spread: [G + 6.2, G + 8.2], // strand spreads into fibre lines
  gather: [G + 9.0, G + 10.0], // lines gather into tows
  weave: [G + 9.9, G + 12.4], // weft tows slide in
  resin: [G + 13.2, G + 15.2], // resin front sweeps across
  mould: [G + 15.2, G + 16.6], // panel bends into a skin
  build: [G + 16.6, G + 19.4], // skin shrinks into the wing, airframe draws
};
const END = G + 19.4;
const STAGE_AT = [0, G + 2.6, G + 6.2, G + 9.0, G + 13.2, G + 16.6];
const BG = 0x050607;

const CELL = 0.5;
const COLS = 34;
const ROWS = 14;
const SHEET_W = COLS * CELL;
const SHEET_H = ROWS * CELL;
const SHEET_ROT = new THREE.Euler(-0.6, 0.22, 0.04);

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const span = (t, [a, b]) => clamp01((t - a) / (b - a));
const win = (p, a, b) => clamp01((p - a) / (b - a));

function twillTexture() {
  const cells = 8;
  const px = 64;
  const c = document.createElement('canvas');
  c.width = cells * px;
  c.height = cells * px;
  const g = c.getContext('2d');
  for (let i = 0; i < cells; i += 1) {
    for (let j = 0; j < cells; j += 1) {
      const horizontal = (i + j) % 4 < 2;
      const x = i * px;
      const y = j * px;
      const grad = horizontal ? g.createLinearGradient(0, y, 0, y + px) : g.createLinearGradient(x, 0, x + px, 0);
      grad.addColorStop(0, '#0b0c0e');
      grad.addColorStop(0.5, horizontal ? '#4a4e56' : '#24272c');
      grad.addColorStop(1, '#0b0c0e');
      g.fillStyle = grad;
      g.fillRect(x, y, px, px);
      g.globalAlpha = 0.08;
      g.fillStyle = '#ffffff';
      for (let k = 6; k < px; k += 7) {
        if (horizontal) g.fillRect(x, y + k, px, 1);
        else g.fillRect(x + k, y, 1, px);
      }
      g.globalAlpha = 1;
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

/* ---------------- 1 -> 2: full-screen lattice that rolls into a tube and thins into a filament ---------------- */
function buildLattice(material) {
  const b = 0.8;
  const halfW = 10;
  const H = 9.2; // sheet height = tube circumference
  const atoms = [];
  const map = new Map();
  const add = (x, y) => {
    const k = `${x.toFixed(2)},${y.toFixed(2)}`;
    if (map.has(k)) return map.get(k);
    if (Math.abs(x) > halfW || Math.abs(y) > H / 2) return -1;
    map.set(k, atoms.length);
    atoms.push(new THREE.Vector3(x, y, 0));
    return atoms.length - 1;
  };
  const bonds = new Set();
  for (let i = -9; i <= 9; i += 1) {
    for (let j = -5; j <= 5; j += 1) {
      const cx = i * Math.sqrt(3) * b + (Math.abs(j) % 2) * (Math.sqrt(3) / 2) * b;
      const cy = j * 1.5 * b;
      const ring = [];
      for (let k = 0; k < 6; k += 1) {
        const a = Math.PI / 6 + (k * Math.PI) / 3;
        ring.push(add(cx + b * Math.cos(a), cy + b * Math.sin(a)));
      }
      for (let k = 0; k < 6; k += 1) {
        const p = ring[k];
        const q = ring[(k + 1) % 6];
        if (p >= 0 && q >= 0) bonds.add(p < q ? `${p}-${q}` : `${q}-${p}`);
      }
    }
  }
  const list = [...bonds].map((s) => s.split('-').map(Number));
  const atomMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 28, 20), material, atoms.length);
  const bondMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.065, 0.065, 1, 14), material, list.length);

  const Rf = H / (2 * Math.PI);
  const pts = atoms.map(() => new THREE.Vector3());
  // growth order: the ring at the centre first, then outward ring by ring
  const dist = atoms.map((a) => Math.hypot(a.x, a.y * 1.6));
  const maxD = Math.max(...dist);
  const order = dist.map((d) => Math.pow(d / maxD, 0.85));
  const appear = (o, g) => ease(clamp01((g - o * 0.82) / 0.16));
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const one = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const mid = new THREE.Vector3();

  // roll: 0 flat sheet -> 1 closed tube along x;  thin: radial scale 1 -> ~0
  const pose = (roll, thin, grow = 1) => {
    const R = Rf / Math.max(roll, 0.0001);
    atoms.forEach((a, i) => {
      const th = a.y / R;
      const y = R * Math.sin(th);
      const z = R * (Math.cos(th) - 1) + Rf * roll;
      pts[i].set(a.x, y * thin, z * thin);
    });
    const s = Math.max(0.0001, Math.min(1, thin * 1.6));
    pts.forEach((p, i) => {
      const k = grow >= 1 ? 1 : appear(order[i], grow);
      atomMesh.setMatrixAt(i, m.compose(p, q.identity(), one.setScalar(Math.max(0.0001, s * k))));
    });
    list.forEach(([p0, r0], i) => {
      // a bond reaches out from the atom that formed first towards the next one
      const [p, r] = order[p0] <= order[r0] ? [p0, r0] : [r0, p0];
      const k = grow >= 1 ? 1 : ease(clamp01((grow - order[p] * 0.82 - 0.06) / 0.14));
      dir.subVectors(pts[r], pts[p]);
      const len = Math.max(0.0001, dir.length() * k);
      q.setFromUnitVectors(up, dir.normalize());
      mid.copy(pts[p]).addScaledVector(dir, len / 2);
      bondMesh.setMatrixAt(i, m.compose(mid, q, one.set(k > 0 ? s : 0.0001, len, k > 0 ? s : 0.0001)));
    });
    atomMesh.instanceMatrix.needsUpdate = true;
    bondMesh.instanceMatrix.needsUpdate = true;
  };
  const group = new THREE.Group();
  group.add(atomMesh, bondMesh);
  pose(0, 1);
  return { group, pose };
}

/* ---------------- fibres: strand (bundle) -> fibre lines (sheet) -> tows ---------------- */
function buildFibres(material, count) {
  const len = 26;
  const mesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, len, 10, 1), material, count);
  const rotZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
  const sheetQ = new THREE.Quaternion().setFromEuler(SHEET_ROT);
  const bundle = [];
  const sheet = [];
  const tows = [];
  const delay = [];
  for (let i = 0; i < count; i += 1) {
    const r = i === 0 ? 0 : 0.6 * Math.sqrt(Math.random());
    const a = Math.random() * Math.PI * 2;
    bundle.push({ p: new THREE.Vector3(0, r * Math.cos(a), r * Math.sin(a)), q: rotZ.clone() });
    delay.push(i === 0 ? 0 : r / 0.6);

    const v = i / (count - 1) - 0.5;
    const local = new THREE.Vector3(0, v * SHEET_H * 1.05, 0.35 * Math.sin(v * 5));
    sheet.push({ p: local.clone().applyEuler(SHEET_ROT), q: sheetQ.clone().multiply(rotZ) });

    const row = Math.min(ROWS - 1, Math.floor((v + 0.5) * ROWS));
    const inRow = (v + 0.5) * ROWS - row - 0.5;
    const towLocal = new THREE.Vector3(0, -SHEET_H / 2 + (row + 0.5) * CELL + inRow * 0.36, 0);
    tows.push({ p: towLocal.applyEuler(SHEET_ROT), q: sheetQ.clone().multiply(rotZ) });
  }
  return { mesh, bundle, sheet, tows, delay };
}

/* ---------------- woven twill: warp tows + individual weft tows ---------------- */
function towGeometry(centre, along, across, zAt, length) {
  const halfW = 0.225;
  const halfT = 0.045;
  const segL = Math.round(8 * (length / CELL));
  const segA = 10;
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let k = 0; k <= segL; k += 1) {
    const t = (k / segL) * length;
    const z = zAt(t / CELL);
    for (let a = 0; a <= segA; a += 1) {
      const th = (a / segA) * Math.PI * 2;
      const w = Math.cos(th) * halfW;
      const h = Math.sin(th) * halfT;
      positions.push(centre.x + along.x * t + across.x * w, centre.y + along.y * t + across.y * w, z + h);
      uvs.push((t / CELL) * 0.5, a / segA);
    }
  }
  for (let k = 0; k < segL; k += 1) {
    for (let a = 0; a < segA; a += 1) {
      const p = k * (segA + 1) + a;
      const q = p + segA + 1;
      indices.push(p, q, p + 1, q, q + 1, p + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function buildFabric(warpMat, weftMat) {
  const A = 0.06;
  const x0 = -SHEET_W / 2;
  const y0 = -SHEET_H / 2;
  const over = (i, j) => ((i + j) % 4 < 2 ? 1 : -1);
  const sample = (stateAt, n, u) => {
    const f0 = u - 0.5;
    const i0 = Math.floor(f0);
    const f = f0 - i0;
    const a = stateAt(Math.max(0, Math.min(n - 1, i0)));
    const b = stateAt(Math.max(0, Math.min(n - 1, i0 + 1)));
    return A * (a + (b - a) * ((1 - Math.cos(Math.PI * f)) / 2));
  };
  const group = new THREE.Group();
  group.rotation.copy(SHEET_ROT);
  for (let j = 0; j < ROWS; j += 1) {
    group.add(new THREE.Mesh(towGeometry(new THREE.Vector3(x0, y0 + (j + 0.5) * CELL, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0),
      (u) => sample((i) => over(i, j), COLS, u), SHEET_W), warpMat));
  }
  const wefts = [];
  for (let i = 0; i < COLS; i += 1) {
    const mesh = new THREE.Mesh(towGeometry(new THREE.Vector3(x0 + (i + 0.5) * CELL, y0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0),
      (u) => sample((j) => -over(i, j), ROWS, u), SHEET_H), weftMat);
    wefts.push(mesh);
    group.add(mesh);
  }
  // glowing resin front that sweeps across during infusion
  const front = new THREE.Mesh(
    new THREE.PlaneGeometry(0.12, SHEET_H * 1.04),
    new THREE.MeshBasicMaterial({ color: 0x7fb2ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  front.position.z = 0.12;
  front.visible = false;
  group.add(front);
  return { group, wefts, front };
}

function buildPanel(material) {
  const geo = new THREE.PlaneGeometry(SHEET_W, SHEET_H, 160, 60);
  const base = geo.attributes.position.array.slice();
  const bend = (k) => {
    const pos = geo.attributes.position.array;
    for (let i = 0; i < pos.length; i += 3) {
      const x = base[i];
      const y = base[i + 1];
      const v = (y + SHEET_H / 2) / SHEET_H;
      const u = x / (SHEET_W / 2);
      pos[i] = x;
      pos[i + 1] = y + k * u * u * 0.9;
      pos[i + 2] = k * (1.2 * Math.sin(Math.PI * Math.pow(v, 0.8)) * (1 - 0.3 * Math.abs(u)));
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
  };
  const group = new THREE.Group();
  group.rotation.copy(SHEET_ROT);
  group.add(new THREE.Mesh(geo, material));
  return { group, bend };
}

function buildAircraft(material) {
  const segs = [];
  const seg = (a, b) => segs.push(a, b);
  const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const surface = (rootLE, rootTE, tipLE, tipTE, ribs) => {
    seg(rootLE, rootTE);
    for (let k = 1; k <= ribs; k += 1) {
      const f0 = (k - 1) / ribs;
      const f = k / ribs;
      seg(lerp(rootLE, tipLE, f0), lerp(rootLE, tipLE, f));
      seg(lerp(rootTE, tipTE, f0), lerp(rootTE, tipTE, f));
      seg(lerp(lerp(rootLE, rootTE, 0.3), lerp(tipLE, tipTE, 0.3), f0), lerp(lerp(rootLE, rootTE, 0.3), lerp(tipLE, tipTE, 0.3), f));
      seg(lerp(rootLE, tipLE, f), lerp(rootTE, tipTE, f));
    }
  };
  const wy = 0.3;
  [1, -1].forEach((sd) => surface([0.7, wy, 0.35 * sd], [-0.35, wy, 0.35 * sd], [0.45, wy + 0.18, 5.6 * sd], [-0.1, wy + 0.18, 5.6 * sd], 12));
  const L = 6.4;
  const stations = 16;
  const ringN = 12;
  const radius = (t) => {
    if (t < 0.12) return 0.42 * Math.sin((t / 0.12) * (Math.PI / 2)) + 0.02;
    if (t < 0.62) return 0.44;
    return 0.44 * (1 - (t - 0.62) / 0.38) * 0.85 + 0.06;
  };
  const rings = [];
  for (let i = 0; i <= stations; i += 1) {
    const t = i / stations;
    const x = L / 2 - t * L;
    const r = radius(t);
    const ring = [];
    for (let k = 0; k < ringN; k += 1) {
      const a = (k / ringN) * Math.PI * 2;
      ring.push([x, r * Math.cos(a) + (t > 0.6 ? (t - 0.6) * 0.35 : 0), r * Math.sin(a) * 1.08]);
    }
    rings.push(ring);
  }
  for (let i = 0; i < stations; i += 1) {
    for (let k = 0; k < ringN; k += 2) seg(rings[i][k], rings[i + 1][k]);
    if (i % 2 === 0) for (let k = 0; k < ringN; k += 1) seg(rings[i][k], rings[i][(k + 1) % ringN]);
  }
  [1, -1].forEach((sd) => surface([-2.2, 0.35, 0.1 * sd], [-2.95, 0.35, 0.1 * sd], [-2.75, 1.2, 1.15 * sd], [-3.15, 1.2, 1.15 * sd], 4));
  surface([-2.4, -0.3, 0], [-2.95, -0.25, 0], [-2.85, -0.85, 0], [-3.1, -0.8, 0], 2);

  const geo = new LineSegmentsGeometry();
  geo.setPositions(segs.flat());
  const group = new THREE.Group();
  group.add(new LineSegments2(geo, material));
  group.rotation.set(0.5, 0.5, -0.32);
  group.scale.setScalar(1.2);
  return { group, geo, count: segs.length / 2 };
}

export default function HeroForge({ className = '', play = true, onFinish }) {
  const mountRef = useRef(null);
  const playRef = useRef(play);
  const finishRef = useRef(onFinish);
  playRef.current = play;
  finishRef.current = onFinish;
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 700;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.localClippingEnabled = true;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.95;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-4, 6, 8);
    const rim = new THREE.DirectionalLight(0x3d8bff, 4.5);
    rim.position.set(6, 2, -6);
    const rim2 = new THREE.DirectionalLight(0x6aa8ff, 1.4);
    rim2.position.set(-7, -3, -4);
    scene.add(key, rim, rim2, new THREE.AmbientLight(0x1a2230, 0.6));

    const metal = new THREE.MeshPhysicalMaterial({ color: 0x626a75, metalness: 0.95, roughness: 0.28, clearcoat: 0.6 });
    const fibre = new THREE.MeshPhysicalMaterial({ color: 0x30343c, metalness: 0.6, roughness: 0.2, clearcoat: 0.4, transparent: true });
    const towProps = { color: 0x22252b, metalness: 0.45, roughness: 0.34, anisotropy: 0.85, clearcoat: 0.25, side: THREE.DoubleSide };
    const warpMat = new THREE.MeshPhysicalMaterial(towProps);
    const weftMat = new THREE.MeshPhysicalMaterial(towProps);
    const twill = twillTexture();
    twill.repeat.set(COLS / 8, ROWS / 8);
    const panelMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: twill, bumpMap: twill, bumpScale: 1.2, metalness: 0.1, roughness: 0.45, specularIntensity: 0.35,
      clearcoat: 0.35, clearcoatRoughness: 0.3, envMapIntensity: 0.35, transparent: true, side: THREE.DoubleSide,
    });
    const wireMat = new LineMaterial({ color: 0x9fc4ff, linewidth: 1.6, transparent: true, opacity: 1 });

    // resin front clipping: cured panel behind the front, dry fabric ahead of it
    const sheetX = new THREE.Vector3(1, 0, 0).applyEuler(SHEET_ROT);
    const panelClip = new THREE.Plane(sheetX.clone().negate(), 0);
    const fabricClip = new THREE.Plane(sheetX.clone(), 0);
    panelMat.clippingPlanes = [panelClip];
    warpMat.clippingPlanes = [fabricClip];
    weftMat.clippingPlanes = [fabricClip];

    const lattice = buildLattice(metal);
    const fibres = buildFibres(fibre, small ? 90 : 160);
    const fabric = buildFabric(warpMat, weftMat);
    const panel = buildPanel(panelMat);
    const aircraft = buildAircraft(wireMat);
    scene.add(lattice.group, fibres.mesh, fabric.group, panel.group, aircraft.group);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.4, 0.88));
    composer.addPass(new OutputPass());

    let baseZ = 15;
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      wireMat.resolution.set(w, h);
      camera.aspect = w / h;
      const halfW = SHEET_W * 0.46;
      baseZ = Math.max(11, halfW / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect));
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    const tmpM = new THREE.Matrix4();
    const tmpP = new THREE.Vector3();
    const tmpQ = new THREE.Quaternion();
    const tmpS = new THREE.Vector3();
    const setFibres = (A, B, k, lenAt, thick) => {
      for (let i = 0; i < A.length; i += 1) {
        tmpP.lerpVectors(A[i].p, B[i].p, k);
        tmpQ.slerpQuaternions(A[i].q, B[i].q, k);
        tmpS.set(thick, Math.max(0.0001, lenAt(i)), thick);
        fibres.mesh.setMatrixAt(i, tmpM.compose(tmpP, tmpQ, tmpS));
      }
      fibres.mesh.instanceMatrix.needsUpdate = true;
    };

    let bendState = -1;
    let shown = -1;
    let finished = false;

    const frame = (t, time) => {
      // camera: starts close on the lattice, eases back as the material is built up
      const growK = span(t, T.grow);
      const zoomOut = ease(growK);
      const pull = ease(span(t, [T.roll[0], T.thin[1]]));
      camera.position.set(0, 0, baseZ * (0.24 + 0.48 * Math.pow(zoomOut, 1.4) + 0.28 * pull));
      camera.lookAt(0, 0, 0);

      // ---- 1. lattice: rolls into a tube, then thins into the first filament
      const roll = ease(span(t, T.roll));
      const thinK = ease(span(t, T.thin));
      const thin = 1 - 0.985 * thinK;
      lattice.group.visible = thinK < 0.999;
      if (lattice.group.visible) lattice.pose(roll, thin, growK < 1 ? Math.pow(growK, 1.45) : 1);
      lattice.group.rotation.x = -0.25 * roll;

      // ---- 2/3. fibres
      const thinP = span(t, T.thin);
      const spreadK = ease(span(t, T.spread));
      const gatherK = ease(span(t, T.gather));
      fibres.mesh.visible = thinP > 0.3 && t < T.gather[1] + 0.2;
      if (fibres.mesh.visible) {
        // other filaments join from the centre outward
        const lenAt = (i) => ease(win(thinP, 0.3 + fibres.delay[i] * 0.45, 0.6 + fibres.delay[i] * 0.4));
        if (t < T.gather[0]) setFibres(fibres.bundle, fibres.sheet, spreadK, lenAt, 1);
        else setFibres(fibres.sheet, fibres.tows, gatherK, () => SHEET_W / 26, 1 + 2 * gatherK);
        fibre.opacity = 1 - win(t, T.gather[1] - 0.2, T.gather[1] + 0.2);
      }

      // ---- 4. fabric: warp tows take over the gathered lines, weft slides in
      const weaveP = span(t, T.weave);
      fabric.group.visible = t >= T.gather[1] - 0.15 && t < T.resin[1];
      fabric.wefts.forEach((mesh, i) => {
        const d = (i / COLS) * 0.55;
        const local = ease(win(weaveP, d, d + 0.45));
        mesh.position.y = (1 - local) * (SHEET_H + 3);
        mesh.visible = local > 0.001;
      });

      // ---- 5. resin front sweeps across, leaving cured panel; then moulding
      const resinK = span(t, T.resin);
      const f = -SHEET_W / 2 - 0.3 + resinK * (SHEET_W + 0.6);
      panelClip.constant = f;
      fabricClip.constant = -f;
      fabric.front.visible = resinK > 0 && resinK < 1;
      fabric.front.position.x = f;
      panel.group.visible = resinK > 0 && t < T.build[1];
      const bendK = ease(span(t, T.mould));
      if (Math.abs(bendK - bendState) > 0.002) { panel.bend(bendK); bendState = bendK; }

      // ---- 6. skin shrinks into the wing root, airframe draws out from it
      const buildK = span(t, T.build);
      const shrink = ease(win(buildK, 0, 0.6));
      panel.group.scale.setScalar(1 - 0.85 * shrink);
      panel.group.position.set(0, 0.25 * shrink, 0);
      panelMat.opacity = 1 - win(buildK, 0.4, 0.8);
      const drawn = ease(win(buildK, 0.15, 1));
      aircraft.group.visible = drawn > 0;
      aircraft.geo.instanceCount = Math.floor(aircraft.count * drawn);
      aircraft.group.rotation.y = 0.5 + Math.sin(time * 0.2) * 0.15 * clamp01(t - END + 1);

      let cur = 0;
      STAGE_AT.forEach((s, i) => { if (t >= s) cur = i; });
      if (cur !== shown) { shown = cur; setStage(cur); }
      if (!finished && t >= T.build[0] + 1.6) {
        finished = true;
        setDone(true);
        finishRef.current?.();
      }
      composer.render();
    };

    let raf;
    let running = false;
    let story = 0;
    let time = 0;
    let last = 0;
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      time += dt;
      if (playRef.current) story = Math.min(END + 1, story + dt);
      frame(story, time);
      if (running) raf = requestAnimationFrame(loop);
    };



    if (reduce) {
      frame(END + 1, 0);
      finishRef.current?.();
    }

    const io = new IntersectionObserver(([entry]) => {
      if (reduce) return;
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(mount);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.dispose) o.material.dispose(); });
      [metal, fibre, warpMat, weftMat, panelMat, wireMat].forEach((m) => m.dispose());
      twill.dispose();
      envTex.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={`hero-forge ${done ? 'is-done' : ''} ${className}`} aria-hidden="true">
      <div ref={mountRef} className="hero-forge__canvas" />
      <div className="hero-forge__story">
        <p className="hero-forge__caption" key={stage}>
          <span>{String(stage + 1).padStart(2, '0')}</span> {STAGES[stage].text}
        </p>
        <ol className="hero-forge__stages">
          {STAGES.map((s, i) => (
            <li key={s.name} className={`${i === stage ? 'is-active' : ''} ${i < stage ? 'is-past' : ''}`}>{s.name}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
