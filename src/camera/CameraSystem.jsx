/**
 * CameraSystem.jsx — Follows avatar based on avatarState.isMoving
 */
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import { avatarState } from '../player/avatarState';

const _wantPos  = new THREE.Vector3();
const _wantLook = new THREE.Vector3();
const _dir      = new THREE.Vector3();
const INIT_POS  = new THREE.Vector3(0, 22, 32);

export default function CameraSystem({ avatarRef }) {
  const { camera } = useThree();

  useEffect(() => {
    // Set initial camera position once to avoid tiny per-render jumps.
    camera.position.copy(INIT_POS);
  }, [camera]);

  useFrame((_, dt) => {
    const group = avatarRef?.current;
    if (!group) return;

    const dtC  = Math.min(dt, 0.05);
    const aPos = group.position;

    if (avatarState.isMoving) {
      // ── FOLLOW mode: track behind the avatar ──
      const facingX = Math.sin(group.rotation.y);
      const facingZ = Math.cos(group.rotation.y);

      _wantPos.set(
        aPos.x - facingX * 14 + 0,
        aPos.y + 9,
        aPos.z - facingZ * 14,
      );
      camera.position.lerp(_wantPos, Math.min(1, 4.5 * dtC));

      _wantLook.set(aPos.x, aPos.y + 2, aPos.z);
      camera.lookAt(_wantLook);

    } else {
      // ── ZONE mode: cinematic framing of avatar + surroundings ──
      _wantPos.set(
        aPos.x + 5,
        aPos.y + 11,
        aPos.z + 16,
      );
      camera.position.lerp(_wantPos, Math.min(1, 1.8 * dtC));

      _wantLook.set(aPos.x, aPos.y + 1.5, aPos.z);
      camera.lookAt(_wantLook);
    }
  });

  return null;
}
