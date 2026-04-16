/**
 * Car.jsx — Real physics: velocity-based accel/braking, body roll on corners,
 * suspension bounce, wheels spin proportional to speed. Improved mesh.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const _target = new THREE.Vector3();
const _dir    = new THREE.Vector3();

// ── Improved procedural car mesh ────────────────────────────────────────────
function ProceduralCar({ color = '#c0392b', wheelRefs }) {
  return (
    <group>
      {/* Lower body / chassis */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.92, 0.38, 4.4]} />
        <meshStandardMaterial color={color} metalness={0.72} roughness={0.28} />
      </mesh>

      {/* Door sills */}
      {[-1.0, 1.0].map((x, i) => (
        <mesh key={i} position={[x * 0.98, 0.19, 0]} castShadow>
          <boxGeometry args={[0.08, 0.24, 3.6]} />
          <meshStandardMaterial color="#111" roughness={0.85} />
        </mesh>
      ))}

      {/* Grille */}
      <mesh position={[0, 0.34, -2.22]}>
        <boxGeometry args={[1.5, 0.28, 0.07]} />
        <meshStandardMaterial color="#181818" roughness={0.7} metalness={0.4} />
      </mesh>
      {/* Grille bars */}
      {[-0.45, 0, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0.34, -2.225]}>
          <boxGeometry args={[0.06, 0.24, 0.06]} />
          <meshStandardMaterial color="#555" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Cabin roof — sloped for aerodynamics */}
      <mesh position={[0, 0.72, 0.18]} castShadow>
        <boxGeometry args={[1.64, 0.44, 2.2]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.38} />
      </mesh>
      {/* Roof slope front */}
      <mesh position={[0, 0.68, -0.98]} rotation={[0.42, 0, 0]}>
        <boxGeometry args={[1.56, 0.06, 0.72]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.38} />
      </mesh>
      {/* Roof slope rear */}
      <mesh position={[0, 0.64, 1.24]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[1.56, 0.06, 0.62]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.38} />
      </mesh>

      {/* Windshield (sloped) */}
      <mesh position={[0, 0.72, -1.08]} rotation={[0.52, 0, 0]}>
        <boxGeometry args={[1.48, 0.5, 0.07]} />
        <meshStandardMaterial color="#a8cce0" metalness={0.85} roughness={0.04} transparent opacity={0.6} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.70, 1.4]} rotation={[-0.44, 0, 0]}>
        <boxGeometry args={[1.48, 0.46, 0.07]} />
        <meshStandardMaterial color="#a8cce0" metalness={0.85} roughness={0.04} transparent opacity={0.58} />
      </mesh>

      {/* Side windows */}
      {[-0.85, 0.85].map((x, i) => (
        <mesh key={i} position={[x, 0.72, 0.18]}>
          <boxGeometry args={[0.07, 0.36, 1.85]} />
          <meshStandardMaterial color="#a8cce0" metalness={0.82} roughness={0.06} transparent opacity={0.55} />
        </mesh>
      ))}

      {/* Headlights */}
      {[[-0.62, 0.36, -2.22], [0.62, 0.36, -2.22]].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.36, 0.2, 0.06]} />
          <meshStandardMaterial color="#ffffee" emissive="#ffe" emissiveIntensity={1.6} />
        </mesh>
      ))}
      {/* Headlight halos */}
      {[[-0.62, 0.36, -2.24], [0.62, 0.36, -2.24]].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.42, 0.26, 0.03]} />
          <meshStandardMaterial color="#ffeeaa" transparent opacity={0.18} />
        </mesh>
      ))}

      {/* Taillights */}
      {[[-0.64, 0.36, 2.22], [0.64, 0.36, 2.22]].map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.38, 0.18, 0.06]} />
          <meshStandardMaterial color="#cc0000" emissive="#990000" emissiveIntensity={1.1} />
        </mesh>
      ))}

      {/* Front bumper */}
      <mesh position={[0, 0.18, -2.24]}>
        <boxGeometry args={[1.92, 0.22, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[0, 0.18, 2.24]}>
        <boxGeometry args={[1.92, 0.22, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.85} />
      </mesh>

      {/* 4 Spoke wheels */}
      {[[-1.04, 0, -1.35], [1.04, 0, -1.35], [-1.04, 0, 1.35], [1.04, 0, 1.35]].map((p, i) => (
        <group key={i} ref={wheelRefs[i]} position={p}>
          {/* Tyre */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.31, 0.31, 0.24, 18]} />
            <meshStandardMaterial color="#0d0d0d" roughness={0.97} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[i % 2 === 0 ? -0.13 : 0.13, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.04, 12]} />
            <meshStandardMaterial color="#888" metalness={0.9} roughness={0.12} />
          </mesh>
          {/* Spokes */}
          {[0, 1, 2, 3, 4].map(s => (
            <mesh key={s}
              rotation={[0, 0, (s / 5) * Math.PI * 2]}
              position={[i % 2 === 0 ? -0.12 : 0.12, 0, 0]}
            >
              <boxGeometry args={[0.03, 0.36, 0.03]} />
              <meshStandardMaterial color="#aaa" metalness={0.88} roughness={0.18} />
            </mesh>
          ))}
          {/* Hub cap center */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[i % 2 === 0 ? -0.14 : 0.14, 0, 0]}>
            <cylinderGeometry args={[0.072, 0.072, 0.04, 8]} />
            <meshStandardMaterial color="#ccc" metalness={0.95} roughness={0.08} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── Car controller ──────────────────────────────────────────────────────────
export default function Car({ route, startOffset = 0 }) {
  const groupRef   = useRef();
  const bodyRef    = useRef();  // for body roll
  const idxRef     = useRef(Math.floor(startOffset) % route.path.length);
  const speed      = route.speed ?? 10;
  const velRef     = useRef(new THREE.Vector3());
  const rollRef    = useRef(0);   // current body roll angle
  const bounceRef  = useRef(0);   // suspension phase
  const spinRef    = useRef(0);   // wheel spin angle

  // 4 wheel refs
  const w0 = useRef(), w1 = useRef(), w2 = useRef(), w3 = useRef();
  const wheelRefs = [w0, w1, w2, w3];

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

    // Velocity-based acceleration
    velRef.current.lerp(_dir.clone().multiplyScalar(speed), Math.min(1, 3.2 * dtC));
    pos.addScaledVector(velRef.current, dtC);

    const spd = velRef.current.length();

    // Smooth yaw
    const yaw = Math.atan2(velRef.current.x, velRef.current.z);
    const cur = g.rotation.y;
    let d = yaw - cur;
    while (d >  Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    const yawDelta = d * Math.min(1, 8 * dtC);
    g.rotation.y += yawDelta;

    // Body roll: lean into corners proportional to yaw change rate
    const targetRoll = -yawDelta * 18 * (spd / speed);
    rollRef.current  = THREE.MathUtils.lerp(rollRef.current, targetRoll, Math.min(1, 6 * dtC));

    // Suspension bounce: oscillates based on speed
    bounceRef.current += dtC * spd * 0.9;
    const bounce = Math.sin(bounceRef.current) * 0.025 * Math.min(1, spd / 6);

    if (bodyRef.current) {
      bodyRef.current.rotation.z = rollRef.current;
      bodyRef.current.position.y = bounce;
    }

    // Wheel spin proportional to speed
    const spinRate = spd * 2.4;
    spinRef.current += spinRate * dtC;
    for (const wr of wheelRefs) {
      if (wr.current) wr.current.rotation.x = spinRef.current;
    }
  });

  return (
    <group ref={groupRef} position={[route.path[0][0], 0, route.path[0][2]]}>
      <group ref={bodyRef}>
        <ProceduralCar color={route.color} wheelRefs={wheelRefs} />
      </group>
    </group>
  );
}
