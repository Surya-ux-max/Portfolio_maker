import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BlackHole({ className = '', style = {} }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera — full-viewport, black hole offset right in world space ─────────
    // BH_OFFSET shifts the entire black hole group to the right so it sits in
    // the empty gap between the left text column and the right viewport edge.
    // Camera looks at that offset point from a top-right-front angle.
    const BH_X = 28; // world-space right offset for the black hole
    const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 2000);
    camera.position.set(BH_X + 10, 30, 72);
    camera.lookAt(BH_X, 0, 0);

    // ── Star Field ────────────────────────────────────────────────────────────
    const starCount = 5000;
    const sPosArr = new Float32Array(starCount * 3);
    const sColArr = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 250 + Math.random() * 600;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      sPosArr[i * 3]     = r * Math.sin(ph) * Math.cos(th);
      sPosArr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      sPosArr[i * 3 + 2] = r * Math.cos(ph);
      const t = Math.random();
      sColArr[i * 3]     = 0.65 + t * 0.35;
      sColArr[i * 3 + 1] = 0.65 + t * 0.15;
      sColArr[i * 3 + 2] = 0.85 + t * 0.15;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPosArr, 3));
    sGeo.setAttribute('color',    new THREE.BufferAttribute(sColArr, 3));
    scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({
      size: 0.5, vertexColors: true, sizeAttenuation: true,
      transparent: true, opacity: 0.9,
    })));

    // ── Black Hole Group — everything BH-related is offset right ─────────────
    const bhGroup = new THREE.Group();
    bhGroup.position.x = BH_X;
    scene.add(bhGroup);

    // ── Event Horizon ─────────────────────────────────────────────────────────
    const HORIZON_R = 7.0;
    const horizonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(HORIZON_R, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    bhGroup.add(horizonMesh);

    // ── Photon Ring ───────────────────────────────────────────────────────────
    const photonRing = new THREE.Mesh(
      new THREE.TorusGeometry(HORIZON_R * 1.07, 0.22, 32, 256),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
    );
    photonRing.rotation.x = Math.PI / 2;
    bhGroup.add(photonRing);

    const photonRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(HORIZON_R * 1.18, 0.10, 32, 256),
      new THREE.MeshBasicMaterial({ color: 0xff88ff, transparent: true, opacity: 0.45 })
    );
    photonRing2.rotation.x = Math.PI / 2;
    bhGroup.add(photonRing2);

    // ── Gravitational Lensing Halos ───────────────────────────────────────────
    [
      { r: HORIZON_R * 1.35, tube: 1.1,  col: 0x8833ff, op: 0.22 },
      { r: HORIZON_R * 1.7,  tube: 1.9,  col: 0x5511cc, op: 0.14 },
      { r: HORIZON_R * 2.2,  tube: 3.2,  col: 0x330088, op: 0.08 },
      { r: HORIZON_R * 3.0,  tube: 5.0,  col: 0x1a0044, op: 0.04 },
    ].forEach(({ r, tube, col, op }) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 32, 256),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, side: THREE.DoubleSide })
      );
      m.rotation.x = Math.PI / 2;
      bhGroup.add(m);
    });

    // ── Accretion Disk — custom UV annulus + FBM shader ───────────────────────
    const diskVert = /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const diskFrag = /* glsl */`
      uniform float uTime;
      varying vec2 vUv;

      // ── Hash / FBM noise ──────────────────────────────────────────────────
      float hash(vec2 p) {
        p = fract(p * vec2(127.1, 311.7));
        p += dot(p, p + 19.19);
        return fract(p.x * p.y);
      }
      float vnoise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f*f*(3.0-2.0*f);
        return mix(
          mix(hash(i), hash(i+vec2(1,0)), f.x),
          mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 6; i++) {
          v += a * vnoise(p);
          p  = p * 2.1 + vec2(1.7, 9.2);
          a *= 0.5;
        }
        return v;
      }

      void main() {
        // vUv.x = azimuth 0..1, vUv.y = radial 0(inner)..1(outer)
        float angle = vUv.x * 6.28318;
        float r     = vUv.y;

        // Differential rotation: inner orbits faster
        float omega  = 0.55 - r * 0.38;
        float swirl  = angle + uTime * omega;

        // Multi-octave turbulence
        vec2 noiseUV = vec2(swirl * 1.8, r * 8.0 + uTime * 0.12);
        float n = fbm(noiseUV);
        n = clamp(n, 0.0, 1.0);

        // Radial brightness falloff — hottest at inner edge
        float brightness = pow(max(1.0 - r, 0.0), 1.8) * 2.2;
        brightness *= 0.65 + 0.35 * n;

        // Thin bright filaments (hot lanes)
        float lane = smoothstep(0.72, 0.78, n) * (1.0 - r) * 2.5;
        brightness += lane;

        // ── Color ramp ────────────────────────────────────────────────────────
        // 0.00 → 0.15  near-white / hot blue-white
        // 0.15 → 0.35  vivid violet-purple
        // 0.35 → 0.62  deep indigo-blue
        // 0.62 → 1.00  magenta-pink outer edge
        vec3 c0 = vec3(0.95, 0.90, 1.00); // white-hot
        vec3 c1 = vec3(0.80, 0.20, 1.00); // vivid purple
        vec3 c2 = vec3(0.28, 0.06, 0.88); // deep indigo
        vec3 c3 = vec3(0.75, 0.05, 0.50); // magenta-pink

        vec3 col;
        if      (r < 0.15) col = mix(c0, c1, r / 0.15);
        else if (r < 0.35) col = mix(c1, c2, (r - 0.15) / 0.20);
        else if (r < 0.62) col = mix(c2, c3, (r - 0.35) / 0.27);
        else               col = mix(c3, c3 * 0.3, (r - 0.62) / 0.38);

        col *= brightness;

        // Alpha: fade inner gap + outer edge
        float alpha = brightness
          * smoothstep(0.0,  0.06, r)
          * smoothstep(1.0,  0.55, r);
        alpha = clamp(alpha, 0.0, 1.0);

        gl_FragColor = vec4(col, alpha);
      }
    `;

    function buildAnnulus(innerR, outerR, segs) {
      const geo = new THREE.BufferGeometry();
      const pos = [], uv = [], idx = [];
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        const c = Math.cos(a), s = Math.sin(a), u = i / segs;
        pos.push(innerR * c, 0, innerR * s); uv.push(u, 0);
        pos.push(outerR * c, 0, outerR * s); uv.push(u, 1);
      }
      for (let i = 0; i < segs; i++) {
        const a = i*2, b = a+1, c = a+2, d = a+3;
        idx.push(a,b,c, b,d,c);
      }
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uv,  2));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      return geo;
    }

    const diskMat = new THREE.ShaderMaterial({
      vertexShader: diskVert,
      fragmentShader: diskFrag,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const disk = new THREE.Mesh(buildAnnulus(HORIZON_R * 1.08, 42, 512), diskMat);
    disk.rotation.x = Math.PI * 0.14;
    disk.rotation.z = Math.PI * 0.04;
    bhGroup.add(disk);

    // ── Gravitational Streak Rings ────────────────────────────────────────────
    function addStreakRing(radius, tube, rotX, rotZ, color, opacity) {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 8, 256),
        new THREE.MeshBasicMaterial({
          color, transparent: true, opacity,
          side: THREE.DoubleSide, depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      m.rotation.x = rotX;
      m.rotation.z = rotZ;
      bhGroup.add(m);
    }
    addStreakRing(HORIZON_R * 1.55, 0.06, Math.PI * 0.38, 0.1,   0xcc44ff, 0.35);
    addStreakRing(HORIZON_R * 1.62, 0.04, Math.PI * 0.42, -0.08, 0xff66cc, 0.22);
    addStreakRing(HORIZON_R * 1.48, 0.05, Math.PI * 0.32, 0.15,  0x8844ff, 0.28);

    // ── Orbiting Particles — Keplerian spiral infall ───────────────────────────
    const PART_COUNT = 4000;
    const pPos  = new Float32Array(PART_COUNT * 3);
    const pCol  = new Float32Array(PART_COUNT * 3);
    const pData = new Float32Array(PART_COUNT * 4); // angle, radius, speed, phase

    const pal = [
      [0.60, 0.12, 1.00], // purple
      [1.00, 0.25, 0.75], // hot pink
      [0.20, 0.08, 0.95], // deep blue
      [0.88, 0.45, 1.00], // lavender
      [1.00, 0.75, 1.00], // near-white
      [0.50, 0.05, 0.80], // dark violet
    ];

    for (let i = 0; i < PART_COUNT; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const radius = HORIZON_R * 1.1 + Math.random() * 34;
      const speed  = (0.22 + Math.random() * 0.18) / Math.sqrt(radius);
      const phase  = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * Math.max(0.1, 1.8 - radius * 0.03);

      pData[i * 4]     = angle;
      pData[i * 4 + 1] = radius;
      pData[i * 4 + 2] = speed;
      pData[i * 4 + 3] = phase;

      // positions are local to bhGroup (added below)
      pPos[i * 3]     = radius * Math.cos(angle);
      pPos[i * 3 + 1] = height;
      pPos[i * 3 + 2] = radius * Math.sin(angle);

      const c = pal[Math.floor(Math.random() * pal.length)];
      const b = 0.45 + Math.random() * 0.55;
      pCol[i * 3]     = c[0] * b;
      pCol[i * 3 + 1] = c[1] * b;
      pCol[i * 3 + 2] = c[2] * b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.26, vertexColors: true, sizeAttenuation: true,
      transparent: true, opacity: 0.88,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    bhGroup.add(new THREE.Points(pGeo, pMat));

    // ── Relativistic Jets ─────────────────────────────────────────────────────
    function buildJet(dir) {
      const N = 800;
      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const t      = Math.pow(Math.random(), 0.7);
        const spread = 0.5 * t;
        const dist   = dir * (HORIZON_R + t * 60);
        pos[i*3]   = (Math.random()-0.5) * spread;
        pos[i*3+1] = dist;
        pos[i*3+2] = (Math.random()-0.5) * spread;
        const fade = 1 - t;
        col[i*3]   = 0.45 * fade;
        col[i*3+1] = 0.15 * fade;
        col[i*3+2] = 1.00 * fade;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('color',    new THREE.BufferAttribute(col, 3));
      return new THREE.Points(g, new THREE.PointsMaterial({
        size: 0.20, vertexColors: true, sizeAttenuation: true,
        transparent: true, opacity: 0.55,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
    }
    bhGroup.add(buildJet(1));
    bhGroup.add(buildJet(-1));

    // ── Nebula Fog Planes (around BH, offset with group) ──────────────────────
    const nebCols = [0x2200aa, 0x5500bb, 0x990055, 0x110044, 0x440088];
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2 + Math.random() * 0.6;
      const r = 50 + Math.random() * 70;
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(24 + Math.random() * 20, 24 + Math.random() * 20),
        new THREE.MeshBasicMaterial({
          color: nebCols[i % nebCols.length],
          transparent: true, opacity: 0.035 + Math.random() * 0.04,
          side: THREE.DoubleSide, depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      m.position.set(r * Math.cos(a), (Math.random()-0.5)*35, r * Math.sin(a));
      m.lookAt(new THREE.Vector3(0, 0, 0));
      bhGroup.add(m);
    }

    // ── Mouse parallax (subtle — right-side panel) ────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Animation Loop ────────────────────────────────────────────────────────
    let raf;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      diskMat.uniforms.uTime.value = t;

      // Keplerian particle orbit
      const posAttr = pGeo.attributes.position;
      for (let i = 0; i < PART_COUNT; i++) {
        pData[i * 4] += pData[i * 4 + 2] * 0.016;
        const ang = pData[i * 4];
        const rad = pData[i * 4 + 1];
        // Slight vertical oscillation
        const h = Math.sin(t * 0.4 + pData[i * 4 + 3]) * Math.max(0, 0.9 - rad * 0.02);
        posAttr.setXYZ(i, rad * Math.cos(ang), h, rad * Math.sin(ang));
      }
      posAttr.needsUpdate = true;

      // Photon ring subtle pulse
      const pulse = 0.92 + 0.08 * Math.sin(t * 2.8);
      photonRing.material.opacity  = 0.95 * pulse;
      photonRing2.material.opacity = 0.45 * pulse;

      // Camera parallax — anchored to BH offset position
      const baseX = BH_X + 10, baseY = 30, baseZ = 72;
      camera.position.x += (baseX + mouse.x * 3  - camera.position.x) * 0.022;
      camera.position.y += (baseY - mouse.y * 2.5 - camera.position.y) * 0.022;
      camera.position.z += (baseZ                 - camera.position.z) * 0.022;
      camera.lookAt(BH_X, 0, 0);

      // Slow disk wobble
      disk.rotation.z = Math.PI * 0.04 + Math.sin(t * 0.07) * 0.025;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    />
  );
}
