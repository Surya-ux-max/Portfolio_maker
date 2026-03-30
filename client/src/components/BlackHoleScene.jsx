import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { Stars, Sparkles, shaderMaterial, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────
const BH_X      = 3.2;   // world-space X offset — sits in right half of viewport
const HORIZON_R = 2.4;   // event horizon radius — large enough to dominate right half

// ─── Accretion Disk Shader ────────────────────────────────────────────────────
const AccretionMaterial = shaderMaterial(
  { uTime: 0 },
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  `uniform float uTime;
   varying vec2 vUv;

   float hash(vec2 p) {
     p = fract(p * vec2(127.1, 311.7));
     p += dot(p, p + 19.19);
     return fract(p.x * p.y);
   }
   float vnoise(vec2 p) {
     vec2 i = floor(p), f = fract(p);
     f = f * f * (3.0 - 2.0 * f);
     return mix(
       mix(hash(i), hash(i + vec2(1,0)), f.x),
       mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
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
     float angle = vUv.x * 6.28318;
     float r     = vUv.y;

     // Differential rotation — inner faster
     float omega = 0.55 - r * 0.38;
     float swirl = angle + uTime * omega;

     float n = clamp(fbm(vec2(swirl * 1.8, r * 8.0 + uTime * 0.12)), 0.0, 1.0);

     // Boosted brightness — was too dim at 2.4x
     float brightness = pow(max(1.0 - r, 0.0), 1.6) * 3.5 * (0.6 + 0.4 * n);
     // Hot filament lanes
     brightness += smoothstep(0.70, 0.76, n) * (1.0 - r) * 3.0;

     // Color ramp: white-hot → deep red → vivid purple → deep indigo → magenta-pink
     vec3 c0 = vec3(1.00, 0.96, 0.90);  // white-hot
     vec3 c1 = vec3(1.00, 0.15, 0.08);  // deep red / lava
     vec3 c2 = vec3(0.75, 0.08, 0.85);  // vivid purple
     vec3 c3 = vec3(0.28, 0.05, 0.90);  // deep indigo
     vec3 c4 = vec3(0.80, 0.04, 0.52);  // magenta-pink
     vec3 col;
     if      (r < 0.12) col = mix(c0, c1, r / 0.12);
     else if (r < 0.30) col = mix(c1, c2, (r - 0.12) / 0.18);
     else if (r < 0.55) col = mix(c2, c3, (r - 0.30) / 0.25);
     else if (r < 0.80) col = mix(c3, c4, (r - 0.55) / 0.25);
     else               col = mix(c4, c4 * 0.20, (r - 0.80) / 0.20);
     col *= brightness;

     // Alpha — fade inner gap and outer edge
     float alpha = brightness
       * smoothstep(0.0, 0.05, r)
       * smoothstep(1.0, 0.50, r);
     gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
   }`
);
extend({ AccretionMaterial });

// ─── UV-mapped annulus geometry ───────────────────────────────────────────────
function buildAnnulus(innerR, outerR, segs = 512) {
  const geo = new THREE.BufferGeometry();
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    const c = Math.cos(a), s = Math.sin(a), u = i / segs;
    pos.push(innerR * c, 0, innerR * s); uv.push(u, 0);
    pos.push(outerR * c, 0, outerR * s); uv.push(u, 1);
  }
  for (let i = 0; i < segs; i++) {
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    idx.push(a, b, c, b, d, c);
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uv,  2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// ─── Camera rig — OrbitControls (drag / scroll / pan) ───────────────────────
function CameraRig() {
  const controlsRef = useRef();
  const { gl } = useThree(); // gl.domElement = the actual canvas element

  useFrame(() => {
    if (controlsRef.current) controlsRef.current.update();
  });

  // Intercept wheel on the canvas — only let OrbitControls zoom when Ctrl/Meta held
  useEffect(() => {
    const canvas = gl.domElement;
    const onWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) {
        // Normal scroll — stop OrbitControls from consuming it
        e.stopPropagation();
      }
    };
    // capture:true so we intercept before OrbitControls sees it
    canvas.addEventListener('wheel', onWheel, { capture: true, passive: false });
    return () => canvas.removeEventListener('wheel', onWheel, { capture: true });
  }, [gl]);

  return (
    <OrbitControls
      ref={controlsRef}
      target={[BH_X, 0, 0]}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.55}
      zoomSpeed={0.8}
      panSpeed={0.6}
      enableZoom={true}
      mouseButtons={{
        LEFT:   THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT:  THREE.MOUSE.PAN,
      }}
      minDistance={5}
      maxDistance={60}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      autoRotate
      autoRotateSpeed={0.4}
      makeDefault
    />
  );
}

// ─── Accretion Disk ───────────────────────────────────────────────────────────
function AccretionDisk() {
  const matRef = useRef();
  // Outer radius = 6× horizon — wide, dramatic disk
  const geo = useMemo(() => buildAnnulus(HORIZON_R * 1.08, HORIZON_R * 6.0), []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uTime = clock.getElapsedTime();
  });

  return (
    <mesh geometry={geo} rotation={[Math.PI * 0.14, 0, Math.PI * 0.03]}>
      <accretionMaterial
        ref={matRef}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─── Photon Rings ─────────────────────────────────────────────────────────────
function PhotonRings() {
  const r1 = useRef(), r2 = useRef();

  useFrame(({ clock }) => {
    const p = 0.92 + 0.08 * Math.sin(clock.getElapsedTime() * 2.8);
    if (r1.current) r1.current.opacity = 0.95 * p;
    if (r2.current) r2.current.opacity = 0.50 * p;
  });

  // Tube scaled to horizon: 0.055 * 2.4 = 0.132 — clearly visible
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[HORIZON_R * 1.07, HORIZON_R * 0.055, 32, 256]} />
        <meshBasicMaterial ref={r1} color={0xffffff} transparent />
      </mesh>
      <mesh>
        <torusGeometry args={[HORIZON_R * 1.20, HORIZON_R * 0.028, 32, 256]} />
        <meshBasicMaterial ref={r2} color={0xff88ff} transparent />
      </mesh>
    </group>
  );
}

// ─── Lensing Halos ────────────────────────────────────────────────────────────
function LensingHalos() {
  // Tubes thinned — were too fat and muddy at old scale
  const halos = [
    { r: HORIZON_R * 1.38, tube: HORIZON_R * 0.12, col: 0xcc1111, op: 0.30 },  // red inner
    { r: HORIZON_R * 1.75, tube: HORIZON_R * 0.18, col: 0x9933ff, op: 0.18 },  // purple
    { r: HORIZON_R * 2.30, tube: HORIZON_R * 0.28, col: 0x550022, op: 0.12 },  // dark red-purple
    { r: HORIZON_R * 3.20, tube: HORIZON_R * 0.40, col: 0x1a0008, op: 0.05 },  // deep dark
  ];
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {halos.map((h, i) => (
        <mesh key={i}>
          <torusGeometry args={[h.r, h.tube, 32, 256]} />
          <meshBasicMaterial
            color={h.col} transparent opacity={h.op}
            side={THREE.DoubleSide} depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Streak Rings (lensed light arcs) ────────────────────────────────────────
function StreakRings() {
  const rings = [
    { r: HORIZON_R * 1.55, tube: HORIZON_R * 0.018, rx: Math.PI * 0.38, rz:  0.10, col: 0xff2200, op: 0.45 },  // red arc
    { r: HORIZON_R * 1.63, tube: HORIZON_R * 0.012, rx: Math.PI * 0.42, rz: -0.08, col: 0xff66cc, op: 0.28 },  // pink arc
    { r: HORIZON_R * 1.48, tube: HORIZON_R * 0.015, rx: Math.PI * 0.32, rz:  0.15, col: 0xcc2244, op: 0.35 },  // red-pink arc
  ];
  return (
    <>
      {rings.map((s, i) => (
        <mesh key={i} rotation={[s.rx, 0, s.rz]}>
          <torusGeometry args={[s.r, s.tube, 8, 256]} />
          <meshBasicMaterial
            color={s.col} transparent opacity={s.op}
            side={THREE.DoubleSide} depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── Orbiting Particles ───────────────────────────────────────────────────────
function OrbitParticles() {
  const COUNT   = 5500;
  const meshRef = useRef();

  const [positions, colors, data] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const dat = new Float32Array(COUNT * 3); // angle, radius, speed
    const pal = [
      [0.65, 0.10, 1.00],  // purple
      [1.00, 0.28, 0.78],  // hot pink
      [0.86, 0.08, 0.08],  // deep red
      [1.00, 0.35, 0.10],  // orange-red
      [0.22, 0.06, 0.95],  // deep blue
      [0.90, 0.48, 1.00],  // lavender
      [1.00, 0.80, 1.00],  // near-white
      [0.55, 0.04, 0.82],  // dark violet
    ];
    for (let i = 0; i < COUNT; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const radius = HORIZON_R * 1.15 + Math.random() * HORIZON_R * 5.0;
      const speed  = (0.20 + Math.random() * 0.20) / Math.sqrt(radius);
      dat[i * 3] = angle; dat[i * 3 + 1] = radius; dat[i * 3 + 2] = speed;
      pos[i * 3]     = radius * Math.cos(angle);
      pos[i * 3 + 1] = (Math.random() - 0.5) * Math.max(0.05, 0.30 - radius * 0.015);
      pos[i * 3 + 2] = radius * Math.sin(angle);
      const c = pal[Math.floor(Math.random() * pal.length)];
      const b = 0.50 + Math.random() * 0.50;
      col[i * 3] = c[0] * b; col[i * 3 + 1] = c[1] * b; col[i * 3 + 2] = c[2] * b;
    }
    return [pos, col, dat];
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    const attr = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < COUNT; i++) {
      data[i * 3] += data[i * 3 + 2] * 0.016;
      const ang = data[i * 3], rad = data[i * 3 + 1];
      attr.setXYZ(i, rad * Math.cos(ang), attr.getY(i) * 0.999, rad * Math.sin(ang));
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.10}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.90}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Relativistic Jets ────────────────────────────────────────────────────────
function Jets() {
  const jets = useMemo(() => [-1, 1].map(dir => {
    const N = 900;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const t      = Math.pow(Math.random(), 0.65);
      const spread = HORIZON_R * 0.06 * t;
      pos[i * 3]     = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = dir * (HORIZON_R * 1.1 + t * HORIZON_R * 8.0);
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      const f = 1 - t;
      col[i * 3] = 0.50 * f; col[i * 3 + 1] = 0.18 * f; col[i * 3 + 2] = 1.00 * f;
    }
    return { pos, col };
  }), []);

  return (
    <>
      {jets.map((j, i) => (
        <points key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[j.pos, 3]} />
            <bufferAttribute attach="attributes-color"    args={[j.col, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.09} vertexColors sizeAttenuation
            transparent opacity={0.65}
            blending={THREE.AdditiveBlending} depthWrite={false}
          />
        </points>
      ))}
    </>
  );
}

// ─── Black Hole Group ─────────────────────────────────────────────────────────
function BlackHoleGroup() {
  // No rotation.y override — OrbitControls owns the camera, not the group
  return (
    <group position={[BH_X, 0, 0]}>
      {/* Event horizon — pure black, renders on top */}
      <mesh renderOrder={10}>
        <sphereGeometry args={[HORIZON_R, 64, 64]} />
        <meshBasicMaterial color={0x000000} depthWrite />
      </mesh>

      <PhotonRings />
      <LensingHalos />
      <AccretionDisk />
      <StreakRings />
      <OrbitParticles />
      <Jets />

      {/* Glow lights — red core + purple outer */}
      <pointLight color="#ff2200" intensity={12} distance={HORIZON_R * 10} decay={2} />
      <pointLight color="#aa44ff" intensity={6}  distance={HORIZON_R * 14} decay={2} position={[0, HORIZON_R, 0]} />
      <pointLight color="#cc1133" intensity={5}  distance={HORIZON_R * 8}  decay={2} position={[HORIZON_R * 2, 0.5, 0]} />
      <pointLight color="#4422ff" intensity={3}  distance={HORIZON_R * 8}  decay={2} position={[-HORIZON_R, 0, HORIZON_R]} />
    </group>
  );
}

// ─── Exported Canvas ──────────────────────────────────────────────────────────
export default function BlackHoleScene() {
  return (
    <Canvas
      camera={{ position: [BH_X + 1.5, 4.5, 14.0], fov: 55, near: 0.01, far: 2000 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.4,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <CameraRig />

      {/* Stars — closer radius so they're visible, higher factor */}
      <Stars radius={120} depth={60} count={8000} factor={5} saturation={0.4} fade speed={0.3} />

      {/* Sparkles — red + purple mix */}
      <Sparkles
        count={220}
        scale={[HORIZON_R * 10, HORIZON_R * 3, HORIZON_R * 10]}
        position={[BH_X, 0, 0]}
        size={2.0}
        speed={0.22}
        opacity={0.65}
        color="#ff3300"
      />
      <Sparkles
        count={120}
        scale={[HORIZON_R * 8, HORIZON_R * 2.5, HORIZON_R * 8]}
        position={[BH_X, 0, 0]}
        size={1.6}
        speed={0.18}
        opacity={0.55}
        color="#a855f7"
      />
      <Sparkles
        count={80}
        scale={[HORIZON_R * 6, HORIZON_R * 2, HORIZON_R * 6]}
        position={[BH_X, 0, 0]}
        size={1.0}
        speed={0.14}
        opacity={0.45}
        color="#ec4899"
      />

      <BlackHoleGroup />

      <EffectComposer>
        {/* Higher threshold — only bloom the genuinely bright disk/rings */}
        <Bloom
          luminanceThreshold={0.45}
          luminanceSmoothing={0.80}
          intensity={2.2}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0006, 0.0006]}
        />
      </EffectComposer>
    </Canvas>
  );
}
