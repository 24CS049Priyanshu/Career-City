/**
 * Avatar.jsx — Main character model.
 * 
 * The model is ROCK STEADY — no procedural wobble, no bob, no sway.
 * The "aliveness" comes from the camera movement (GTA5 style) and
 * from the aura ring glow, not from shaking the model.
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

export default function Avatar({ onAvatarClick }) {
  const group = useRef();
  const auraRef = useRef();

  const fbxBase = useFBX('/character/Ch09_nonPBR.fbx');

  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(fbxBase);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#00bcd4',
            roughness: 0.3,
            metalness: 0.8,
            map: child.material.map || null,
          });
        }
      }
    });
    return clone;
  }, [fbxBase]);

  // Subtle aura pulse — the ONLY animation on the avatar
  useFrame(() => {
    if (auraRef.current) {
      const t = Date.now() * 0.003;
      auraRef.current.material.opacity = 0.45 + Math.sin(t) * 0.2;
    }
  });

  return (
    <group ref={group} onClick={(e) => { e.stopPropagation(); onAvatarClick?.(); }}>
      <primitive object={model} scale={0.012} position={[0, 0, 0]} />
      {/* Aura ring */}
      <mesh ref={auraRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <torusGeometry args={[0.58, 0.055, 8, 36]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

useFBX.preload('/character/Ch09_nonPBR.fbx');
