import * as THREE from 'three';

/*
  UAV, laboratory and composite layup for the hero story (stages 4-7).
  Lab coordinates: nose towards +x, wingspan along z, up is +y.
  The same analytic geometry drives the solid aircraft, its wireframe skeleton
  and the surface the carbon cloth drapes onto, so all three always line up.
*/

export const PLAT_Y = -1.55; // top of the manufacturing platform
export const CLOTH_Y = 2.7; // height the flat cloth hangs at before it drops
export const CLOTH_W = 21.25; // along z (span)  — matches the woven sheet (17 x 1.25)
export const CLOTH_L = 8.75; // along x (length) — matches the woven sheet (7 x 1.25)

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const win = (p, a, b) => clamp01((p - a) / (b - a));

// ---------------- geometry definition ----------------
const XN = 3.1; // nose
const XT = -3.3; // tail
function fusR(x) {
  if (x > 1.9) { const t = (x - 1.9) / (XN - 1.9); return 0.42 * Math.sqrt(Math.max(0, 1 - t * t)); }
  if (x < -1.4) { const t = (x + 1.4) / (XT + 1.4); return 0.42 - 0.32 * Math.pow(clamp01(t), 1.2); }
  return 0.42;
}
const thick = (xc, t) => 5 * t * (0.2969 * Math.sqrt(Math.max(0, xc)) - 0.126 * xc - 0.3516 * xc * xc + 0.2843 * xc ** 3 - 0.1036 * xc ** 4);

const WING = { half: 7.4, y: 0.16, dihedral: 0.05, t: 0.13, chord: (a) => 1.55 - 0.75 * a, le: (a) => 0.85 - 0.25 * a };
const HTAIL = { half: 2.3, y: 0.1, dihedral: 0, t: 0.09, chord: (a) => 0.78 - 0.3 * a, le: (a) => -2.45 - 0.2 * a };
const FIN = { y0: 0.25, y1: 1.45, t: 0.1, chord: (h) => 0.9 - 0.45 * h, le: (h) => -2.4 - 0.55 * h };

// top height of a lifting surface at (x, z), or null
function surfaceTop(S, x, z) {
  const a = Math.abs(z) / S.half;
  if (a > 1) return null;
  const c = S.chord(a);
  const xc = (S.le(a) - x) / c;
  if (xc < 0 || xc > 1) return null;
  return S.y + S.dihedral * Math.abs(z) + thick(xc, S.t) * c;
}

// highest point of the aircraft above (x, z), or null where the cloth meets nothing
function supportTop(x, z) {
  let h = null;
  const r = fusR(x);
  if (x >= XT && x <= XN && Math.abs(z) < r) h = Math.sqrt(r * r - z * z);
  const w = surfaceTop(WING, x, z);
  if (w !== null && (h === null || w > h)) h = w;
  const ht = surfaceTop(HTAIL, x, z);
  if (ht !== null && (h === null || ht > h)) h = ht;
  if (Math.abs(z) < 0.16) {
    for (let k = 24; k >= 0; k -= 1) {
      const hk = k / 24;
      const c = FIN.chord(hk);
      const le = FIN.le(hk);
      if (x <= le && x >= le - c) {
        const fy = FIN.y0 + hk * (FIN.y1 - FIN.y0);
        if (h === null || fy > h) h = fy;
        break;
      }
    }
  }
  return h;
}

// closed aerofoil loop for one section of a lifting surface
function wingLoop(S, a, side, n) {
  const c = S.chord(a);
  const le = S.le(a);
  const z = side * a * S.half;
  const yb = S.y + S.dihedral * Math.abs(z);
  const pts = [];
  for (let k = 0; k <= n; k += 1) {
    const s = k / n;
    const xc = (1 + Math.cos(s * Math.PI * 2)) / 2;
    const yt = thick(xc, S.t) * c;
    pts.push([le - xc * c, yb + (s < 0.5 ? yt : -0.55 * yt), z]);
  }
  return pts;
}
function finLoop(h, n) {
  const c = FIN.chord(h);
  const le = FIN.le(h);
  const y = FIN.y0 + h * (FIN.y1 - FIN.y0);
  const pts = [];
  for (let k = 0; k <= n; k += 1) {
    const s = k / n;
    const xc = (1 + Math.cos(s * Math.PI * 2)) / 2;
    const zt = thick(xc, FIN.t) * c;
    pts.push([le - xc * c, y, s < 0.5 ? zt : -zt]);
  }
  return pts;
}

function loft(sections) {
  const n = sections[0].length;
  const pos = [];
  const uv = [];
  const idx = [];
  sections.forEach((sec, i) => sec.forEach((p, k) => { pos.push(...p); uv.push(i / (sections.length - 1), k / (n - 1)); }));
  for (let i = 0; i < sections.length - 1; i += 1) {
    for (let k = 0; k < n - 1; k += 1) {
      const a = i * n + k;
      const b = a + n;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// ---------------- the finished aircraft (solid) ----------------
export function buildUavSolid(material) {
  const group = new THREE.Group();
  const prof = [];
  for (let i = 0; i <= 64; i += 1) {
    const x = XT + (i / 64) * (XN - XT);
    prof.push(new THREE.Vector2(Math.max(0.001, fusR(x)), x));
  }
  const fus = new THREE.LatheGeometry(prof, 48);
  fus.rotateZ(-Math.PI / 2);
  group.add(new THREE.Mesh(fus, material));

  const surf = (S, stations) => {
    const secs = [];
    for (let i = 0; i <= stations; i += 1) {
      const a = -1 + (2 * i) / stations;
      secs.push(wingLoop(S, Math.abs(a), Math.sign(a) || 1, 40));
    }
    return new THREE.Mesh(loft(secs), material);
  };
  group.add(surf(WING, 48), surf(HTAIL, 16));
  const finSecs = [];
  for (let i = 0; i <= 12; i += 1) finSecs.push(finLoop(i / 12, 32));
  group.add(new THREE.Mesh(loft(finSecs), material));
  return group;
}

// ---------------- wireframe skeleton ----------------
export function buildUavWire(material) {
  const segs = [];
  const line = (pts, closed) => {
    for (let k = 0; k < pts.length - 1; k += 1) segs.push(...pts[k], ...pts[k + 1]);
    if (closed) segs.push(...pts[pts.length - 1], ...pts[0]);
  };
  // fuselage frames + longerons
  const ringN = 18;
  const frames = [];
  for (let i = 0; i <= 14; i += 1) {
    const x = XT + 0.05 + (i / 14) * (XN - XT - 0.1);
    const r = fusR(x);
    const ring = [];
    for (let k = 0; k < ringN; k += 1) { const a = (k / ringN) * Math.PI * 2; ring.push([x, r * Math.cos(a), r * Math.sin(a)]); }
    frames.push(ring);
    line(ring, true);
  }
  for (let k = 0; k < ringN; k += 3) line(frames.map((f) => f[k]), false);
  // wing + tail ribs and spars
  const ribs = (S, count) => {
    for (let i = 0; i <= count; i += 1) {
      const a = i / count;
      [1, -1].forEach((sd) => { if (a > 0 || sd === 1) line(wingLoop(S, a, sd, 24), false); });
    }
    [0, 0.3, 0.65].forEach((xcS) => {
      [1, -1].forEach((sd) => {
        const pts = [];
        for (let i = 0; i <= count; i += 1) {
          const a = i / count;
          const c = S.chord(a);
          pts.push([S.le(a) - xcS * c, S.y + S.dihedral * a * S.half + thick(xcS, S.t) * c * 0.2, sd * a * S.half]);
        }
        line(pts, false);
      });
    });
  };
  ribs(WING, 10);
  ribs(HTAIL, 3);
  for (let i = 0; i <= 4; i += 1) line(finLoop(i / 4, 18), false);
  [0, 0.4].forEach((xcS) => {
    const pts = [];
    for (let i = 0; i <= 4; i += 1) { const h = i / 4; pts.push([FIN.le(h) - xcS * FIN.chord(h), FIN.y0 + h * (FIN.y1 - FIN.y0), 0]); }
    line(pts, false);
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3));
  const wire = new THREE.LineSegments(geo, material);
  return { wire, count: segs.length / 3 };
}

// ---------------- laboratory: floor, platform, stands, light pool ----------------
export function buildLab() {
  const group = new THREE.Group();
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x0a0b0d, metalness: 0.3, roughness: 0.5, transparent: true });
  const platMat = new THREE.MeshStandardMaterial({ color: 0x17191d, metalness: 0.2, roughness: 0.7, transparent: true });
  const standMat = new THREE.MeshStandardMaterial({ color: 0x5c626b, metalness: 0.7, roughness: 0.35, transparent: true });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = PLAT_Y - 0.42;
  const plat = new THREE.Mesh(new THREE.BoxGeometry(CLOTH_L + 1.6, 0.42, CLOTH_W + 1.2), platMat);
  plat.position.y = PLAT_Y - 0.21;
  group.add(floor, plat);
  [1.1, -1.3].forEach((x) => {
    const top = -fusR(x) + 0.02;
    const st = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, top - PLAT_Y, 16), standMat);
    st.position.set(x, (top + PLAT_Y) / 2, 0);
    group.add(st);
  });
  const spot = new THREE.SpotLight(0xeef3ff, 0, 40, 0.55, 0.85, 0);
  spot.position.set(0.5, 11, 2);
  spot.target.position.set(0, PLAT_Y, 0);
  group.add(spot, spot.target);
  return { group, mats: [floorMat, platMat, standMat], spot };
}

// ---------------- carbon cloth: flat -> draped (loose) -> vacuum (tight) ----------------
export function buildCloth(material, membraneMaterial, small) {
  const nx = small ? 120 : 170; // along z
  const nz = small ? 50 : 72; // along x
  const geo = new THREE.PlaneGeometry(1, 1, nx, nz); // positions are written below
  const mGeo = new THREE.PlaneGeometry(1, 1, nx, nz);
  const N = (nx + 1) * (nz + 1);
  const X = new Float32Array(N);
  const Z = new Float32Array(N);
  const tight = new Float32Array(N);
  const loose = new Float32Array(N);
  const fold = new Float32Array(N);
  const dropDelay = new Float32Array(N);
  const vacDelay = new Float32Array(N);
  const H = new Float32Array(N);
  const idx = (i, j) => j * (nx + 1) + i;
  // PlaneGeometry vertex order: rows top->bottom (j), columns left->right (i); uv u = i/nx, v = 1 - j/nz
  for (let j = 0; j <= nz; j += 1) {
    for (let i = 0; i <= nx; i += 1) {
      const u = i / nx;
      const v = 1 - j / nz;
      const n = idx(i, j);
      Z[n] = CLOTH_W / 2 - u * CLOTH_W; // fabric local x -> -z
      X[n] = CLOTH_L / 2 - v * CLOTH_L; // fabric local y -> -x
      const h = supportTop(X[n], Z[n]);
      H[n] = h === null ? -1e9 : h;
      tight[n] = h === null ? PLAT_Y + 0.02 : h + 0.03;
    }
  }
  // loose drape: the cloth tents down from every support point (chamfer distance sweep)
  const dz = CLOTH_W / nx;
  const dx = CLOTH_L / nz;
  const dd = Math.hypot(dx, dz);
  const g = 2.4; // steep: cloth hangs, it doesn't tent
  loose.set(H);
  const relax = (i, j, i2, j2, d) => {
    if (i2 < 0 || j2 < 0 || i2 > nx || j2 > nz) return;
    const a = idx(i, j);
    const v = loose[idx(i2, j2)] - g * d;
    if (v > loose[a]) loose[a] = v;
  };
  for (let pass = 0; pass < 2; pass += 1) {
    for (let j = 0; j <= nz; j += 1) for (let i = 0; i <= nx; i += 1) {
      relax(i, j, i - 1, j, dz); relax(i, j, i, j - 1, dx); relax(i, j, i - 1, j - 1, dd); relax(i, j, i + 1, j - 1, dd);
    }
    for (let j = nz; j >= 0; j -= 1) for (let i = nx; i >= 0; i -= 1) {
      relax(i, j, i + 1, j, dz); relax(i, j, i, j + 1, dx); relax(i, j, i + 1, j + 1, dd); relax(i, j, i - 1, j + 1, dd);
    }
  }
  const D = new Float32Array(N);
  for (let n = 0; n < N; n += 1) D[n] = H[n] > -1e8 ? 0 : 1e9;
  const relaxD = (i, j, i2, j2, d) => {
    if (i2 < 0 || j2 < 0 || i2 > nx || j2 > nz) return;
    const a = idx(i, j);
    const v = D[idx(i2, j2)] + d;
    if (v < D[a]) D[a] = v;
  };
  for (let pass = 0; pass < 2; pass += 1) {
    for (let j = 0; j <= nz; j += 1) for (let i = 0; i <= nx; i += 1) {
      relaxD(i, j, i - 1, j, dz); relaxD(i, j, i, j - 1, dx); relaxD(i, j, i - 1, j - 1, dd); relaxD(i, j, i + 1, j - 1, dd);
    }
    for (let j = nz; j >= 0; j -= 1) for (let i = nx; i >= 0; i -= 1) {
      relaxD(i, j, i + 1, j, dz); relaxD(i, j, i, j + 1, dx); relaxD(i, j, i + 1, j + 1, dd); relaxD(i, j, i - 1, j + 1, dd);
    }
  }
  const alphaData = new Uint8Array(N * 4);
  for (let j = 0; j <= nz; j += 1) {
    for (let i = 0; i <= nx; i += 1) {
      const a = D[idx(i, j)] === 0 ? 1 : 0.97 * clamp01(1 - D[idx(i, j)] / 3);
      const r = nz - j; // texture row = uv v
      const o = (r * (nx + 1) + i) * 4;
      alphaData[o] = alphaData[o + 1] = alphaData[o + 2] = Math.round(a * 255);
      alphaData[o + 3] = 255;
    }
  }
  const alphaTex = new THREE.DataTexture(alphaData, nx + 1, nz + 1, THREE.RGBAFormat);
  alphaTex.magFilter = THREE.LinearFilter;
  alphaTex.minFilter = THREE.LinearFilter;
  alphaTex.needsUpdate = true;

  const port = [-CLOTH_L / 2, CLOTH_W / 2]; // vacuum port at one corner
  const maxPort = Math.hypot(CLOTH_L, CLOTH_W);
  for (let n = 0; n < N; n += 1) {
    loose[n] = Math.max(loose[n], PLAT_Y + 0.02);
    const sag = clamp01((loose[n] - Math.max(H[n], PLAT_Y)) / 1.4) + (H[n] < -1e8 ? 0.35 : 0);
    fold[n] = 0.16 * Math.min(1, sag) * (Math.sin(Z[n] * 2.1 + X[n] * 0.6) * 0.7 + Math.sin(Z[n] * 4.3 - X[n] * 1.7) * 0.3);
    dropDelay[n] = 0.45 * clamp01((CLOTH_Y - loose[n]) / (CLOTH_Y - PLAT_Y));
    vacDelay[n] = 0.5 * (Math.hypot(X[n] - port[0], Z[n] - port[1]) / maxPort);
  }
  const mesh = new THREE.Mesh(geo, material);
  const membrane = new THREE.Mesh(mGeo, membraneMaterial);
  mesh.frustumCulled = false;
  membrane.frustumCulled = false;

  const pos = geo.attributes.position.array;
  const mpos = mGeo.attributes.position.array;
  let last = '';
  // drapeK 0 flat -> 1 loose on the aircraft; vacK 0 loose -> 1 tight (air drawn out from the port)
  const set = (drapeK, vacK) => {
    const key = `${drapeK.toFixed(3)}|${vacK.toFixed(3)}`;
    if (key === last) return;
    last = key;
    for (let n = 0; n < N; n += 1) {
      const kd = ease(win(drapeK, dropDelay[n], dropDelay[n] + 0.55));
      const kv = ease(win(vacK, vacDelay[n], vacDelay[n] + 0.5));
      const draped = loose[n] + fold[n] * (1 - kv) + (tight[n] - loose[n]) * kv;
      const y = CLOTH_Y + (draped - CLOTH_Y) * kd;
      // hanging cloth pulls in a touch towards the aircraft
      const pull = kd * (1 - kv) * Math.min(0.25, Math.max(0, (CLOTH_Y - y) * 0.03));
      pos[n * 3] = X[n] * (1 - pull * 0.15);
      pos[n * 3 + 1] = y;
      pos[n * 3 + 2] = Z[n] * (1 - pull * 0.1);
      // the membrane sits just above, a little looser until the air is drawn out
      mpos[n * 3] = pos[n * 3];
      mpos[n * 3 + 1] = y + 0.05 + 0.18 * (1 - kv) * kd;
      mpos[n * 3 + 2] = pos[n * 3 + 2];
    }
    geo.attributes.position.needsUpdate = true;
    mGeo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    mGeo.computeVertexNormals();
  };
  set(0, 0);
  return { mesh, membrane, set, alphaTex };
}
