import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Card({ color, hovered }) {
  const meshRef = useRef();
  const targetY = useRef(0);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    // Float up/down
    meshRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    // Tilt toward hover
    meshRef.current.rotation.x += (( hovered ? -0.18 : 0) - meshRef.current.rotation.x) * 0.08;
    meshRef.current.rotation.y += ((hovered ?  0.22 : 0) - meshRef.current.rotation.y) * 0.08;
    // Subtle idle rotation
    if (!hovered) {
      meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <RoundedBox args={[2.2, 1.4, 0.12]} radius={0.08} smoothness={4}>
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.3}
          roughness={0.05}
          transmission={0.92}
          ior={1.5}
          chromaticAberration={0.04}
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.15}
        />
      </RoundedBox>
    </mesh>
  );
}

export default function FloatingCard({ color = '#6d28d9', className = '' }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 40 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 2, 2]} intensity={2} color={color} />
        <pointLight position={[-2, -1, 1]} intensity={1} color="#ffffff" />
        <Card color={color} hovered={hovered} />
      </Canvas>
    </div>
  );
}
