/**
 * NPC.jsx — Realistic walking humanoid NPC with path-following
 * Simple but proportional: head + body + limbs with walk animation
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const _tgt = new THREE.Vector3();
const _dir = new THREE.Vector3();
const NPC_SPEED = 2.2; // walking speed
const ARRIVE_D  = 0.5;

export default function NPC({ path, startOffset = 0, clothingColor = '#2e4060', skinColor = '#c8956c', onInteract }) {
  const groupRef   = useRef();   // root group (position driven)
  const bodyRef    = useRef();   // body group (rotation)
  const lLegRef    = useRef();
  const rLegRef    = useRef();
  const lArmRef    = useRef();
  const rArmRef    = useRef();
  const idxRef     = useRef(Math.floor(startOffset) % path.length);
  const walkPhase  = useRef((startOffset * 1.137) % (Math.PI * 2));
  const isMoving   = useRef(true);

  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const dtC = Math.min(dt, 0.05);

    const wp = path[idxRef.current];
    _tgt.set(wp[0], 0, wp[2]);
    _dir.copy(_tgt).sub(g.position);
    const dist = _dir.length();

    if (dist < ARRIVE_D) {
      idxRef.current = (idxRef.current + 1) % path.length;
      isMoving.current = false;
      return;
    }
    isMoving.current = true;

    _dir.normalize();
    g.position.addScaledVector(_dir, NPC_SPEED * dtC);

    // Smooth yaw
    const yaw = Math.atan2(_dir.x, _dir.z);
    const cur = g.rotation.y;
    let d = yaw - cur;
    while (d >  Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    g.rotation.y += d * Math.min(1, 10 * dtC);

    // Walk animation
    if (isMoving.current) {
      walkPhase.current += dtC * 4.2;
      const ph  = walkPhase.current;
      const sw  = Math.sin(ph) * 0.5;
      if (lLegRef.current)  lLegRef.current.rotation.x  = -sw;
      if (rLegRef.current)  rLegRef.current.rotation.x  =  sw;
      if (lArmRef.current)  lArmRef.current.rotation.x  =  sw * 0.6;
      if (rArmRef.current)  rArmRef.current.rotation.x  = -sw * 0.6;
      // Bob
      g.position.y = Math.abs(Math.sin(ph)) * 0.04;
    }
  });

  const skinMat   = { color: skinColor,       roughness: 0.65, metalness: 0.0 };
  const clothMat  = { color: clothingColor,   roughness: 0.8,  metalness: 0.05 };
  const hairMat   = { color: '#2a1a0a',       roughness: 0.9,  metalness: 0.0 };
  const shoesMat  = { color: '#1a1a1a',       roughness: 0.85, metalness: 0.05 };

  const startPos = path[Math.floor(startOffset) % path.length];

  return (
    <group ref={groupRef} position={[startPos[0], 0, startPos[2]]}>
      {/* Left leg */}
      <group ref={lLegRef} position={[-0.18, 0.58, 0]}>
        <mesh position={[0,-0.28,0]} castShadow>
          <cylinderGeometry args={[0.1,0.09,0.56,8]} />
          <meshStandardMaterial {...clothMat} />
        </mesh>
        {/* Shin */}
        <mesh position={[0,-0.65,0]} castShadow>
          <cylinderGeometry args={[0.08,0.07,0.44,8]} />
          <meshStandardMaterial {...clothMat} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0,-0.93,0.06]} castShadow>
          <boxGeometry args={[0.16,0.12,0.26]} />
          <meshStandardMaterial {...shoesMat} />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rLegRef} position={[0.18, 0.58, 0]}>
        <mesh position={[0,-0.28,0]} castShadow>
          <cylinderGeometry args={[0.1,0.09,0.56,8]} />
          <meshStandardMaterial {...clothMat} />
        </mesh>
        <mesh position={[0,-0.65,0]} castShadow>
          <cylinderGeometry args={[0.08,0.07,0.44,8]} />
          <meshStandardMaterial {...clothMat} />
        </mesh>
        <mesh position={[0,-0.93,0.06]} castShadow>
          <boxGeometry args={[0.16,0.12,0.26]} />
          <meshStandardMaterial {...shoesMat} />
        </mesh>
      </group>

      {/* Body / torso */}
      <mesh ref={bodyRef} position={[0, 0.9, 0]} castShadow
        onClick={e => { e.stopPropagation(); onInteract?.(); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={()  => { document.body.style.cursor = 'crosshair'; }}
      >
        <cylinderGeometry args={[0.25, 0.22, 0.76, 10]} />
        <meshStandardMaterial {...clothMat} />
      </mesh>

      {/* Left arm */}
      <group ref={lArmRef} position={[-0.36, 0.88, 0]}>
        <mesh position={[0,-0.22,0]} castShadow>
          <cylinderGeometry args={[0.09,0.08,0.44,8]} />
          <meshStandardMaterial {...clothMat} />
        </mesh>
        {/* Forearm (skin) */}
        <mesh position={[0,-0.52,0]} castShadow>
          <cylinderGeometry args={[0.08,0.07,0.36,8]} />
          <meshStandardMaterial {...skinMat} />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rArmRef} position={[0.36, 0.88, 0]}>
        <mesh position={[0,-0.22,0]} castShadow>
          <cylinderGeometry args={[0.09,0.08,0.44,8]} />
          <meshStandardMaterial {...clothMat} />
        </mesh>
        <mesh position={[0,-0.52,0]} castShadow>
          <cylinderGeometry args={[0.08,0.07,0.36,8]} />
          <meshStandardMaterial {...skinMat} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.09,0.11,0.18,8]} />
        <meshStandardMaterial {...skinMat} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial {...skinMat} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.74, -0.04]}>
        <sphereGeometry args={[0.21, 12, 8, 0, Math.PI*2, 0, Math.PI*0.55]} />
        <meshStandardMaterial {...hairMat} />
      </mesh>
    </group>
  );
}
