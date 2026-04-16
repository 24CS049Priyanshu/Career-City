/**
 * Car.jsx — Realistic procedural car that follows a road path
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const _target = new THREE.Vector3();
const _dir    = new THREE.Vector3();

function ProceduralCar({ color = '#c0392b' }) {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.62, 4.2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Cabin / roof */}
      <mesh position={[0, 0.83, 0.22]} castShadow>
        <boxGeometry args={[1.65, 0.52, 2.3]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.45} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.83, -0.83]} rotation={[0.45, 0, 0]}>
        <boxGeometry args={[1.55, 0.56, 0.06]} />
        <meshStandardMaterial color="#a8c8d8" metalness={0.8} roughness={0.05} transparent opacity={0.65} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.82, 1.32]} rotation={[-0.45, 0, 0]}>
        <boxGeometry args={[1.55, 0.5, 0.06]} />
        <meshStandardMaterial color="#a8c8d8" metalness={0.8} roughness={0.05} transparent opacity={0.6} />
      </mesh>

      {/* Side windows x2 */}
      {[-0.96, 0.96].map((x, i) => (
        <mesh key={i} position={[x, 0.83, 0.22]}>
          <boxGeometry args={[0.06, 0.42, 1.9]} />
          <meshStandardMaterial color="#a8c8d8" metalness={0.8} roughness={0.05} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* 4 Wheels */}
      {[[-1.02,0,-1.3],[1.02,0,-1.3],[-1.02,0,1.3],[1.02,0,1.3]].map((p,i) => (
        <group key={i} position={p}>
          <mesh rotation={[0,0,Math.PI/2]}>
            <cylinderGeometry args={[0.3,0.3,0.22,14]} />
            <meshStandardMaterial color="#0f0f0f" roughness={0.95} />
          </mesh>
          {/* Hub cap */}
          <mesh position={[i%2===0 ? -0.12 : 0.12, 0, 0]} rotation={[0,0,Math.PI/2]}>
            <cylinderGeometry args={[0.17,0.17,0.02,8]} />
            <meshStandardMaterial color="#888" metalness={0.85} roughness={0.15} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      {[[-0.65,0.35,-2.13],[0.65,0.35,-2.13]].map((p,i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.4,0.22,0.05]} />
          <meshStandardMaterial color="#ffffee" emissive="#ffd" emissiveIntensity={1.4} />
        </mesh>
      ))}

      {/* Taillights */}
      {[[-0.65,0.35,2.13],[0.65,0.35,2.13]].map((p,i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.42,0.2,0.05]} />
          <meshStandardMaterial color="#cc0000" emissive="#880000" emissiveIntensity={1.0} />
        </mesh>
      ))}

      {/* Front bumper */}
      <mesh position={[0, 0.2, -2.16]}>
        <boxGeometry args={[1.9, 0.25, 0.1]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[0, 0.2, 2.16]}>
        <boxGeometry args={[1.9, 0.25, 0.1]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function Car({ route, startOffset = 0 }) {
  const groupRef  = useRef();
  const idxRef    = useRef(Math.floor(startOffset) % route.path.length);
  const speed     = route.speed ?? 10;

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const dtC = Math.min(dt, 0.05);

    const wp = route.path[idxRef.current];
    _target.set(wp[0], 0, wp[2]);

    const pos = g.position;
    _dir.copy(_target).sub(pos);
    const dist = _dir.length();

    if (dist < 1.2) {
      idxRef.current = (idxRef.current + 1) % route.path.length;
      return;
    }

    _dir.normalize();
    pos.addScaledVector(_dir, speed * dtC);

    // Smooth yaw
    const yaw = Math.atan2(_dir.x, _dir.z);
    const cur = g.rotation.y;
    let d = yaw - cur;
    while (d >  Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    g.rotation.y += d * Math.min(1, 8 * dtC);
  });

  return (
    <group ref={groupRef} position={[route.path[0][0], 0, route.path[0][2]]}>
      <ProceduralCar color={route.color} />
    </group>
  );
}
