/**
 * NPC.jsx — NPCs walking along CatmullRomCurve3 paths.
 * Model is rock-steady (no procedural bob/sway).
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

const NPC_SPEED = 2.2;

export default function NPC({ path, startOffset = 0, clothingColor = '#2e4060', onInteract }) {
  const group = useRef();

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      path.map(p => new THREE.Vector3(p[0], 0, p[2])),
      true
    );
  }, [path]);

  const length = useMemo(() => curve.getLength(), [curve]);
  const progressRef = useRef((startOffset / Math.max(1, path.length)) % 1.0);

  const fbxBase = useFBX('/character/Ch09_nonPBR.fbx');

  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(fbxBase);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          color: clothingColor,
          roughness: 0.7,
          metalness: 0.1,
        });
      }
    });
    return clone;
  }, [fbxBase, clothingColor]);

  useFrame((_, dt) => {
    const dtC = Math.min(dt, 0.05);
    if (!group.current) return;

    progressRef.current += (NPC_SPEED / length) * dtC;
    if (progressRef.current >= 1.0) progressRef.current -= 1.0;

    const currentPos = curve.getPointAt(progressRef.current);
    const lookAhead = (progressRef.current + 0.015) % 1.0;
    const nextPos = curve.getPointAt(lookAhead);

    group.current.position.copy(currentPos);
    group.current.lookAt(nextPos);
  });

  return (
    <group ref={group}
      onClick={(e) => { e.stopPropagation(); onInteract?.(); }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
      onPointerOut={() =>  { document.body.style.cursor = 'default'; }}
    >
      <primitive object={model} scale={0.012} position={[0, 0, 0]} />
    </group>
  );
}
