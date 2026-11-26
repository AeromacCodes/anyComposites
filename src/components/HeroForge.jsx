import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { buildUavSolid, buildUavWire, buildLab, buildCloth, CLOTH_Y } from './heroForgeUav';
import './HeroForge.css';

/*
  Loading cinematic: carbon bond -> carbon fibre UAV, one continuous timeline (~12 s).
    1 bond      a single carbon bond multiplies into a hexagonal lattice (thin silver bonds)
    2 thread    pull back: the lattice is the skin of one filament; filaments multiply and twist into a thread
    3 weave     the thread lays down as a yarn; warp yarns join and weft yarns weave a 2x2 twill cloth
    4 skeleton  the cloth lifts into a dark lab while a wireframe UAV draws itself on the platform
    5 layup     the cloth drops over the airframe and hangs loose
    6 vacuum    a clear membrane covers it; air is drawn out from one corner, folds pull tight, the laminate cures
    7 reveal    membrane and skeleton go, the finished carbon UAV remains; the camera pulls back
    8 hero      a short hold, then the hero headline (handled by the page via onFinish)
*/

// timeline (seconds)
const T = {
  grow: [0, 2.4], // 1  bonds form and multiply outward
  roll: [2.6, 3.5], // 2  zoom out (first half): lattice becomes a filament's surface
  thin: [3.5, 4.4], // 2  zoom out (second half): neighbouring filaments fill the screen
  twist: [4.4, 5.0], // 2  the bundle twists into a thread
  gather: [5.1, 5.7], // 3  the thread flattens into one yarn (the middle warp)
  warp: [5.6, 6.2], // 3  the other warp yarns slide in beside it
  weave: [6.0, 7.1], // 3  weft yarns weave over and under
  lift: [7.2, 8.3], // 4  cloth rises over the lab platform; the UAV skeleton draws
  drape: [8.3, 9.5], // 5  the cloth drops over the airframe, loose
  vacuum: [9.5, 10.5], // 6  membrane on, air drawn out, folds pull tight
  cure: [10.2, 10.8], // 6  woven cloth cures into a glossy laminate
  reveal: [10.8, 11.8], // 7  membrane + skeleton removed, finished UAV, camera pulls back
};
const END = 12.6;
const BG = 0x050607;

const CELL = 0.5;
const COLS = 34;
const ROWS = 14;
const SHEET_W = COLS * CELL;
const SHEET_H = ROWS * CELL;
const SHEET_ROT = new THREE.Euler(-0.6, 0.22, 0.04);

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const rnd = (a, b) => a + Math.random() * (b - a);
const span = (t, [a, b]) => clamp01((t - a) / (b - a));
const win = (p, a, b) => clamp01((p - a) / (b - a));

function hexTexture() {
  const W = 256;
  const H = 444; // one tile = sqrt(3) x 3 bond lengths
  const b = H / 3;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#1b1e23';
  g.fillRect(0, 0, W, H);
  g.strokeStyle = '#7d8798';
  g.lineWidth = 9;
  g.fillStyle = '#3c4048';
  const hex = (cx, cy) => {
    const pts = [];
    for (let k = 0; k < 6; k += 1) {
      const a = Math.PI / 6 + (k * Math.PI) / 3;
      pts.push([cx + (W / 2 / Math.cos(Math.PI / 6)) * Math.cos(a) * Math.cos(Math.PI / 6) * (2 / Math.sqrt(3)) * (Math.sqrt(3) / 2) * 1, cy + b * Math.sin(a)]);
    }
    g.beginPath();
    pts.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath();
    g.stroke();
    pts.forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 13, 0, Math.PI * 2); g.fill(); });
  };
  for (let i = -1; i <= 2; i += 1) {
    for (let j = -1; j <= 2; j += 1) hex(i * W + (Math.abs(j) % 2) * (W / 2), j * 1.5 * b);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

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
function buildLattice({ core, bond, cloud }) {
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
  const atomMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.085, 24, 16), core, atoms.length);
  const bondMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.032, 0.032, 1, 14), bond, list.length);

  const Rf = H / (2 * Math.PI);
  const pts = atoms.map(() => new THREE.Vector3());
  // growth: start from the atom nearest the centre; bonds draw outward one hop at a time
  // (breadth-first over the bond graph). Atoms with no bonds are never shown.
  const nbr = atoms.map(() => []);
  list.forEach(([p0, r0]) => { nbr[p0].push(r0); nbr[r0].push(p0); });
  let root = 0;
  atoms.forEach((a, i) => { if (a.lengthSq() < atoms[root].lengthSq() && nbr[i].length) root = i; });
  const depth = atoms.map(() => -1);
  depth[root] = 0;
  const queue = [root];
  for (let h = 0; h < queue.length; h += 1) {
    const i = queue[h];
    nbr[i].forEach((j) => { if (depth[j] < 0) { depth[j] = depth[i] + 1; queue.push(j); } });
  }
  const maxDepth = Math.max(...depth);
  const steps = maxDepth + 1;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const one = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const mid = new THREE.Vector3();
  // colours: settled core / bond, and the brighter "just formed" flash
  const coreC = new THREE.Color(0x9aa1ab);
  const bondC = new THREE.Color(0xc8cdd4);
  const flashC = new THREE.Color(0xffffff);
  const col = new THREE.Color();
  const fresh = (age) => (age < 0 ? 0 : Math.pow(1 - clamp01(age / 1.2), 2));
  const tintCore = (age) => col.copy(coreC).lerp(flashC, fresh(age));
  const tint = (age) => col.copy(bondC).lerp(flashC, fresh(age));
  const graphiteC = bondC;
  atoms.forEach((_, i) => atomMesh.setColorAt(i, coreC));
  list.forEach((_, i) => bondMesh.setColorAt(i, bondC));

  // electron clouds: a faint frosted shell around each atom (lit, no glow)
  const clouds = new THREE.InstancedMesh(new THREE.SphereGeometry(0.3, 32, 20), cloud, atoms.length);
  clouds.renderOrder = 2;
  let settled = false;

  // roll: 0 flat sheet -> 1 closed tube along x;  thin: radial scale 1 -> ~0
  const pose = (roll, thin, grow = 1, thick = 1) => {
    const R = Rf / Math.max(roll, 0.0001);
    atoms.forEach((a, i) => {
      const th = a.y / R;
      const y = R * Math.sin(th);
      const z = R * (Math.cos(th) - 1) + Rf * roll;
      pts[i].set(a.x, y * thin, z * thin);
    });
    const s = Math.max(0.0001, Math.min(1, thin * 1.6) * thick);
    const tg = grow * steps; // growth clock in bond-hops
    pts.forEach((p, i) => {
      // an atom forms when the bond reaching it arrives
      const k = depth[i] < 0 ? 0 : grow >= 1 ? 1 : ease(clamp01((tg - depth[i]) / 0.4));
      atomMesh.setMatrixAt(i, m.compose(p, q.identity(), one.setScalar(Math.max(0.0001, s * k))));
      if (grow < 1) atomMesh.setColorAt(i, tintCore(tg - depth[i]));
      clouds.setMatrixAt(i, m.compose(p, q.identity(), one.setScalar(Math.max(0.0001, s * k))));
    });
    list.forEach(([p0, r0], i) => {
      // a bond draws itself from the atom that formed first towards the next one
      const [p, r] = depth[p0] <= depth[r0] ? [p0, r0] : [r0, p0];
      const start = depth[p] === depth[r] ? depth[p] + 0.35 : depth[p]; // ring-closing bonds start a little later
      const k = depth[p] < 0 ? 0 : grow >= 1 ? 1 : clamp01((tg - start) / (depth[p] === depth[r] ? 0.65 : 1));
      dir.subVectors(pts[r], pts[p]);
      const len = Math.max(0.0001, dir.length() * k);
      q.setFromUnitVectors(up, dir.normalize());
      mid.copy(pts[p]).addScaledVector(dir, len / 2);
      bondMesh.setMatrixAt(i, m.compose(mid, q, one.set(k > 0 ? s : 0.0001, len, k > 0 ? s : 0.0001)));
      if (grow < 1) bondMesh.setColorAt(i, tint(tg - start));
    });
    atomMesh.instanceMatrix.needsUpdate = true;
    bondMesh.instanceMatrix.needsUpdate = true;
    clouds.instanceMatrix.needsUpdate = true;
    if (grow < 1 || !settled) {
      if (grow >= 1) {
        atoms.forEach((_, i) => atomMesh.setColorAt(i, coreC));
        list.forEach((_, i) => bondMesh.setColorAt(i, graphiteC));
        settled = true;
      } else settled = false;
      atomMesh.instanceColor.needsUpdate = true;
      bondMesh.instanceColor.needsUpdate = true;
    }
  };
  const group = new THREE.Group();
  clouds.visible = false;
  group.add(clouds, bondMesh, atomMesh);
  pose(0, 1);
  return { group, pose, rootPos: atoms[root].clone() };
}

/* ---------------- fibres: strand (bundle) -> fibre lines (sheet) -> tows ---------------- */
const BUNDLE_R = 2.8;
const BUNDLE_THICK = 3; // filament radius in the bundle = 0.03 * 3
function bundlePoints(spacing) {
  const pts = [[0, 0]];
  for (let j = -40; j <= 40; j += 1) {
    for (let i = -40; i <= 40; i += 1) {
      const y = i * spacing + (Math.abs(j) % 2) * (spacing / 2);
      const z = j * spacing * 0.866;
      if ((y || z) && Math.hypot(y, z) <= BUNDLE_R) pts.push([y, z]);
    }
  }
  return pts;
}

function buildFibres(material, spacing) {
  const len = 26;
  const packed = bundlePoints(spacing);
  const count = packed.length;
  const mesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, len, 10, 1), material, count);
  const rotZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
  const sheetQ = new THREE.Quaternion().setFromEuler(SHEET_ROT);
  const bundle = [];
  const sheet = [];
  const tows = [];
  const delay = [];
  const rank = new Array(count);
  packed.map((p, i) => [p[0] + p[1] * 0.001, i]).sort((a, b) => a[0] - b[0]).forEach(([, i], r) => { rank[i] = r; });
  const twisted = [];
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < count; i += 1) {
    const jit = i === 0 ? 0 : 0.025;
    bundle.push({ p: new THREE.Vector3(0, packed[i][0] + rnd(-jit, jit), packed[i][1] + rnd(-jit, jit)), q: rotZ.clone() });
    delay.push(0);

    // twisted thread: compacted, each filament leans along a helix (lay angle grows with radius)
    {
      const { y, z } = bundle[i].p;
      const r = Math.hypot(y, z) || 1e-6;
      const lay = 0.2 * (r / BUNDLE_R);
      const d = new THREE.Vector3(-Math.cos(lay), (-z / r) * Math.sin(lay), (y / r) * Math.sin(lay));
      twisted.push({ p: new THREE.Vector3(0, y * 0.72, z * 0.72), q: new THREE.Quaternion().setFromUnitVectors(up, d) });
    }

    const v = rank[i] / (count - 1) - 0.5;
    const local = new THREE.Vector3(0, v * SHEET_H * 1.05, 0.35 * Math.sin(v * 5));
    sheet.push({ p: local.clone().applyEuler(SHEET_ROT), q: sheetQ.clone().multiply(rotZ) });

    const mid = Math.floor(ROWS / 2);
    const yarnLocal = new THREE.Vector3(0, -SHEET_H / 2 + (mid + 0.5) * CELL + v * 0.4, rnd(-0.02, 0.02));
    tows.push({ p: yarnLocal.applyEuler(SHEET_ROT), q: sheetQ.clone().multiply(rotZ) });
  }
  // hero filament: the one on the front surface of the bundle, nearest the middle
  let hero = 0;
  bundle.forEach((f, i) => { if (f.p.z - Math.abs(f.p.y) * 0.5 > bundle[hero].p.z - Math.abs(bundle[hero].p.y) * 0.5) hero = i; });
  return { mesh, bundle, sheet, tows, twisted, delay, count, hero };
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
  const warps = [];
  for (let j = 0; j < ROWS; j += 1) {
    warps.push(new THREE.Mesh(towGeometry(new THREE.Vector3(x0, y0 + (j + 0.5) * CELL, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0),
      (u) => sample((i) => over(i, j), COLS, u), SHEET_W), warpMat));
    group.add(warps[j]);
  }
  const wefts = [];
  for (let i = 0; i < COLS; i += 1) {
    const mesh = new THREE.Mesh(towGeometry(new THREE.Vector3(x0 + (i + 0.5) * CELL, y0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0),
      (u) => sample((j) => -over(i, j), ROWS, u), SHEET_H), weftMat);
    wefts.push(mesh);
    group.add(mesh);
  }
  const geos = [...warps, ...wefts].map((m) => ({ geo: m.geometry, base: m.geometry.attributes.position.array.slice() }));
  return { group, warps, wefts, geos };
}

export default function HeroForge({ className = '', play = true, onFinish }) {
  const mountRef = useRef(null);
  const playRef = useRef(play);
  const finishRef = useRef(onFinish);
  playRef.current = play;
  finishRef.current = onFinish;
  const [done, setDone] = useState(false);
  const skipRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 700;

    const lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || navigator.connection?.saveData;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch {
      // no WebGL: skip straight to the hero
      setDone(true);
      finishRef.current?.();
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5));
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
    const fog = new THREE.Fog(BG, 4, 16);
    scene.fog = fog;

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-4, 6, 8);
    const rim = new THREE.DirectionalLight(0x3d8bff, 4.5);
    rim.position.set(6, 2, -6);
    const rim2 = new THREE.DirectionalLight(0x6aa8ff, 1.4);
    rim2.position.set(-7, -3, -4);
    scene.add(key, rim, rim2, new THREE.AmbientLight(0x1a2230, 0.6));

    const fibre = new THREE.MeshStandardMaterial({ color: 0x3a3f47, metalness: 0.35, roughness: 0.42, envMapIntensity: 0.6, transparent: true });
    const towProps = { color: 0x22252b, metalness: 0.45, roughness: 0.34, anisotropy: 0.85, clearcoat: 0.25, side: THREE.DoubleSide };
    const warpMat = new THREE.MeshPhysicalMaterial(towProps);
    const weftMat = new THREE.MeshPhysicalMaterial(towProps);
    const twill = twillTexture();
    twill.repeat.set(COLS / 8, ROWS / 8);
    // woven cloth during layup: dry fabric first, cured laminate later
    const clothMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: twill, bumpMap: twill, bumpScale: 1.4, metalness: 0.15, roughness: 0.62, specularIntensity: 0.4,
      clearcoat: 0, clearcoatRoughness: 0.25, envMapIntensity: 0.45, transparent: true, side: THREE.DoubleSide,
    });
    const membraneMat = new THREE.MeshPhysicalMaterial({
      color: 0x9fb0c6, metalness: 0, roughness: 0.18, clearcoat: 0.5, envMapIntensity: 0.35, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide,
    });
    const twillSolid = twill.clone();
    twillSolid.repeat.set(12, 4);
    twillSolid.needsUpdate = true;
    const carbonMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: twillSolid, bumpMap: twillSolid, bumpScale: 0.8, metalness: 0.15, roughness: 0.32,
      clearcoat: 0.75, clearcoatRoughness: 0.18, envMapIntensity: 0.55, transparent: true, opacity: 0,
    });
    const wireMat = new THREE.LineBasicMaterial({ color: 0xcfe0ff, transparent: true, opacity: 0.85 });

    // carbon lattice: thin metallic silver with soft white highlights
    const graphite = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.75, roughness: 0.32, envMapIntensity: 0.9 });
    const bondLight = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.28, envMapIntensity: 0.9 });
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x8d9bb0, metalness: 0, roughness: 0.5, envMapIntensity: 0.4, transparent: true, opacity: 0.085, depthWrite: false,
    });
    const lattice = buildLattice({ core: graphite, bond: bondLight, cloud: cloudMat });
    const fibres = buildFibres(fibre, small ? 0.3 : 0.2);
    // zoom: the lattice is the surface of one filament; the bundle is scaled up ZOOM x and shrinks to 1
    const ZOOM = 66;
    const hexTex = hexTexture();
    hexTex.repeat.set(27, 715);
    const heroFibreMat = new THREE.MeshStandardMaterial({ map: hexTex, color: 0xffffff, metalness: 0.2, roughness: 0.55, envMapIntensity: 0.5 });
    const heroFibre = new THREE.Mesh(new THREE.CylinderGeometry(0.0918, 0.0918, 26, 96, 1, true), heroFibreMat);
    heroFibre.rotation.z = Math.PI / 2;
    heroFibre.rotation.x = Math.PI / 2; // texture seam to the back
    heroFibre.position.copy(fibres.bundle[fibres.hero].p);
    fibres.mesh.add(heroFibre);
    const heroOff = fibres.bundle[fibres.hero].p.clone().add(new THREE.Vector3(0, 0, 0.0918));
    const fabric = buildFabric(warpMat, weftMat);
    // the woven sheet lives in "part"; it later lifts into the lab, flat above the aircraft
    const part = new THREE.Group();
    part.add(fabric.group);
    const qSheet = new THREE.Quaternion().setFromEuler(SHEET_ROT);
    const qFlat = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0)),
    );
    part.quaternion.copy(qSheet);
    const lab = buildLab();
    const uav = buildUavSolid(carbonMat);
    const skeleton = buildUavWire(wireMat);
    const cloth = buildCloth(clothMat, membraneMat, small);
    // the excess cloth is trimmed back to the airframe as the vacuum pulls it tight
    clothMat.alphaMap = cloth.alphaTex;
    membraneMat.alphaMap = cloth.alphaTex;
    clothMat.alphaTest = 0.001;
    membraneMat.alphaTest = 0.001;
    lab.group.visible = false;
    uav.visible = false;
    skeleton.wire.visible = false;
    cloth.mesh.visible = false;
    cloth.membrane.visible = false;
    scene.add(lattice.group, fibres.mesh, part, lab.group, uav, skeleton.wire, cloth.mesh, cloth.membrane);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.4, 0.88);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    let baseZ = 15;
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      const halfW = SHEET_W * 0.46;
      baseZ = Math.max(11, halfW / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect));
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    const focus = new THREE.Vector3();
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

    let finished = false;
    const camFront = new THREE.Vector3();
    const camOrbit = new THREE.Vector3();
    const lookAt = new THREE.Vector3();
    const labTarget = new THREE.Vector3(0, -0.35, 0);

    const frame = (t, time) => {
      // camera: starts close on the lattice, eases back as the material is built up
      const growK = span(t, T.grow);
      const shot = ease(growK); // 0 macro on the first atom -> 1 full-screen lattice
      const pull = ease(span(t, [T.roll[0], T.thin[1]]));
      const zoomP = span(t, [T.roll[0], T.thin[1]]);
      const tilt = 1 - shot;
      lattice.group.rotation.set(-1.05 * tilt, 0, 0.38 * tilt);
      focus.copy(lattice.rootPos).applyEuler(lattice.group.rotation).multiplyScalar(tilt);
      const dist = THREE.MathUtils.lerp(1.6, baseZ * 0.72, Math.pow(shot, 1.6)) + baseZ * 0.28 * pull;
      camera.position.set(focus.x, focus.y + 0.35 * tilt, focus.z + dist);
      camera.lookAt(focus);
      fog.near = THREE.MathUtils.lerp(2.2, 60, shot);
      fog.far = THREE.MathUtils.lerp(9, 140, shot);
      key.position.set(THREE.MathUtils.lerp(-9, -4, shot), 6, 8);
      bloom.strength = growK < 1 ? 0 : 0.22 * ease(span(t, T.thin));
      // no bloom in the lab: the anisotropic weave under the spot light can blow it out
      bloom.enabled = t < T.lift[0];

      // ---- 1. lattice -> zoom out: the lattice dissolves into the surface of one filament,
      //         which shrinks as neighbouring filaments come into view (the strand)
      const dissolve = ease(win(zoomP, 0, 0.16));
      lattice.group.visible = dissolve < 0.999;
      if (lattice.group.visible) lattice.pose(0, 1, growK < 1 ? Math.pow(growK, 1.7) : 1, 1 - dissolve);
      cloudMat.opacity = 0.085 * (1 - dissolve);
      if (growK >= 1) lattice.group.rotation.set(0, 0, 0);
      const zoomK = ease(zoomP);
      const S = Math.pow(ZOOM, 1 - zoomK);
      const zooming = zoomP > 0 && zoomP < 1;
      fibres.mesh.scale.setScalar(zooming ? S : 1);
      const centre = 1 - ease(win(zoomP, 0.55, 1));
      if (zooming) fibres.mesh.position.copy(heroOff).multiplyScalar(-S * centre).add(tmpP.set(0, 0, -0.04));
      else fibres.mesh.position.set(0, 0, 0);
      heroFibre.visible = zooming;

      // ---- 2b. thread: the bundle twists   3a. it flattens into one yarn (the middle warp)
      const twistK = ease(span(t, T.twist));
      const gatherK = ease(span(t, T.gather));
      fibres.mesh.visible = zoomP > 0 && t < T.gather[1] + 0.25;
      if (fibres.mesh.visible) {
        if (t < T.gather[0]) setFibres(fibres.bundle, fibres.twisted, twistK, () => 1, BUNDLE_THICK);
        else setFibres(fibres.twisted, fibres.tows, gatherK, () => 1 + (SHEET_W / 26 - 1) * gatherK, BUNDLE_THICK + (1 - BUNDLE_THICK) * gatherK);
        fibre.opacity = 1 - win(t, T.gather[1] - 0.15, T.gather[1] + 0.25);
      }

      // ---- 3b. the other warp yarns slide in beside it   3c. weft yarns weave over and under
      const mid = Math.floor(ROWS / 2);
      const warpP = span(t, T.warp);
      fabric.group.visible = t >= T.gather[1] - 0.15 && t < T.drape[0] + 0.2;
      fabric.warps.forEach((mesh, j) => {
        if (j === mid) { mesh.visible = true; mesh.position.y = 0; return; }
        const d = (Math.abs(j - mid) - 1) / mid;
        const local = ease(win(warpP, d * 0.55, d * 0.55 + 0.45));
        mesh.position.y = Math.sign(j - mid) * (1 - local) * SHEET_H * 0.7;
        mesh.visible = local > 0.001;
      });
      const weaveP = span(t, T.weave);
      fabric.wefts.forEach((mesh, i) => {
        const d = (i / COLS) * 0.55;
        const local = ease(win(weaveP, d, d + 0.45));
        mesh.position.y = (1 - local) * (SHEET_H + 3);
        mesh.visible = local > 0.001;
      });

      // ---- 4. skeleton: the cloth lifts flat above the platform; the lab fades in; the UAV draws itself
      const liftK = ease(span(t, T.lift));
      part.quaternion.slerpQuaternions(qSheet, qFlat, liftK);
      part.position.set(0, CLOTH_Y * liftK, 0);
      part.scale.setScalar(1 + 0.25 * liftK);
      const labK = ease(span(t, [T.lift[0] + 0.2, T.lift[1]]));
      lab.group.visible = labK > 0;
      lab.mats.forEach((m) => { m.opacity = labK; });
      lab.spot.intensity = 2.4 * labK;
      // softer, less blue rim light inside the lab
      rim.intensity = 4.5 - 3.3 * labK;
      rim2.intensity = 1.4 - 0.9 * labK;
      const drawK = ease(span(t, [T.lift[0] + 0.3, T.drape[0] + 0.4]));
      const revealP = span(t, T.reveal);
      skeleton.wire.visible = drawK > 0 && revealP < 1;
      skeleton.wire.geometry.setDrawRange(0, Math.floor((skeleton.count * drawK) / 2) * 2);
      wireMat.opacity = 0.85 * (1 - win(revealP, 0, 0.6));

      // ---- 5/6. layup + vacuum: the cloth drops loose over the airframe, then the membrane draws it tight
      const drapeP = span(t, T.drape);
      const vacP = span(t, T.vacuum);
      cloth.mesh.visible = t >= T.drape[0] - 0.02 && revealP < 1;
      if (cloth.mesh.visible) cloth.set(drapeP, vacP);
      const cureK = ease(span(t, T.cure));
      clothMat.opacity = ease(win(t, T.drape[0] - 0.02, T.drape[0] + 0.18)) * (1 - ease(win(revealP, 0.2, 0.8)));
      clothMat.roughness = 0.62 - 0.3 * cureK;
      clothMat.clearcoat = 0.75 * cureK;
      clothMat.bumpScale = 1.4 - 0.6 * cureK;
      cloth.membrane.visible = t >= T.vacuum[0] - 0.25 && revealP < 0.7;
      const trimK = ease(span(t, [T.vacuum[0] + 0.25, T.cure[1]]));
      clothMat.alphaTest = 0.001 + 0.985 * trimK;
      membraneMat.alphaTest = clothMat.alphaTest;
      membraneMat.opacity = 0.16 * ease(win(t, T.vacuum[0] - 0.25, T.vacuum[0] + 0.15)) * (1 - ease(win(revealP, 0, 0.5)));
      cloth.membrane.position.y = 0.8 * ease(win(revealP, 0, 0.6));

      // ---- 7. reveal: the finished carbon UAV takes over from the cured cloth
      const solidK = ease(win(revealP, 0.15, 0.75));
      uav.visible = solidK > 0;
      carbonMat.opacity = solidK;
      carbonMat.transparent = solidK < 1;

      // ---- camera: from the weave (front) to a slow orbit in the lab, pulling back for the reveal
      if (t > T.lift[0]) {
        const camK = ease(span(t, [T.lift[0], T.lift[1] + 0.3]));
        const portrait = clamp01((1.2 - camera.aspect) / 0.7); // 0 landscape -> 1 phone
        const aspectFit = Math.pow(Math.max(1, 1.55 / camera.aspect), 0.85 - 0.35 * portrait);
        const R = aspectFit * (15.5 - 2.5 * ease(span(t, [T.drape[0], T.vacuum[1]])) + 2.5 * ease(span(t, [T.reveal[0], END])));
        const az = 0.72 + 0.3 * span(t, [T.lift[0], END]) + 0.55 * portrait;
        const el = 0.55 - 0.12 * ease(span(t, [T.reveal[0], END]));
        camOrbit.set(R * Math.cos(el) * Math.sin(az), R * Math.sin(el), R * Math.cos(el) * Math.cos(az)).add(labTarget);
        camFront.set(0, part.position.y, baseZ);
        camera.position.lerpVectors(camFront, camOrbit, camK);
        lookAt.copy(part.position).lerp(labTarget, camK);
        camera.lookAt(lookAt);
        fog.near = THREE.MathUtils.lerp(60, R + 4, camK);
        fog.far = THREE.MathUtils.lerp(140, R + 30, camK);
      }

      if (!finished && t >= T.reveal[1] + 0.1) {
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
      if (skipRef.current) { skipRef.current = false; story = Math.max(story, T.reveal[1] + 0.05); }
      if (playRef.current) story = Math.min(END + 1, story + dt);
      frame(story, time);
      if (running) raf = requestAnimationFrame(loop);
    };












    const still = reduce || lowPower;
    if (still) {
      frame(END + 1, 0);
      setDone(true);
      finishRef.current?.();
    }

    const io = new IntersectionObserver(([entry]) => {
      if (still) return;
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
      [graphite, bondLight, cloudMat, heroFibreMat, fibre, warpMat, weftMat, clothMat, membraneMat, carbonMat, wireMat, ...lab.mats].forEach((m) => m.dispose());
      twillSolid.dispose();
      twill.dispose();
      hexTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={`hero-forge ${done ? 'is-done' : ''} ${className}`}>
      <div ref={mountRef} className="hero-forge__canvas" aria-hidden="true" />
      {!done && (
        <button type="button" className="hero-forge__skip" onClick={() => { skipRef.current = true; }}>
          Skip intro
        </button>
      )}
    </div>
  );
}
