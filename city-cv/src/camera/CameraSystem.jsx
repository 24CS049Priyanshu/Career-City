/**
 * CameraSystem.jsx — GTA5-style third-person camera.
 * Moving: follows behind avatar with cinematic lag.
 * Idle: slowly drifts back and gently orbits — exactly like GTA5 idle cam.
 */
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { avatarState } from '../player/avatarState';

const _wantPos  = new THREE.Vector3();
const _wantLook = new THREE.Vector3();
const INIT_POS  = new THREE.Vector3(0, 22, 32);

// GTA5-style idle orbit state
const _idleAngle = { val: 0 };
const _idleTime  = { val: 0 };

export default function CameraSystem({ avatarRef }) {
  const { camera } = useThree();
  const wasMovingRef = useRef(false);

  useEffect(() => {
    camera.position.copy(INIT_POS);
  }, [camera]);

  useFrame((_, dt) => {
    const group = avatarRef?.current;
    if (!group) return;

    const dtC  = Math.min(dt, 0.05);
    const aPos = group.position;
    const isMoving = avatarState.isMoving;

    if (isMoving) {
      // ── FOLLOW mode: track behind avatar, cinematic lag ──
      wasMovingRef.current = true;
      _idleTime.val = 0;

      const facingX = Math.sin(group.rotation.y);
      const facingZ = Math.cos(group.rotation.y);

      _wantPos.set(
        aPos.x - facingX * 13,
        aPos.y + 8.5,
        aPos.z - facingZ * 13,
      );
      // Cinematic lag: slower lerp = more camera pull
      camera.position.lerp(_wantPos, Math.min(1, 3.8 * dtC));

      _wantLook.set(aPos.x, aPos.y + 2, aPos.z);
      camera.lookAt(_wantLook);

    } else {
      // ── IDLE cam: drift back, then slowly orbit (GTA5 style) ──
      _idleTime.val += dtC;

      // After 1.5s of idle, begin gentle orbit
      const orbitDelay = 1.5;
      if (_idleTime.val > orbitDelay) {
        _idleAngle.val += dtC * 0.18; // gentle orbit speed (rad/s)
      }

      // Drift back to a slight offset behind + above
      const orbitRadius = 15;
      const orbitHeight = 9.5;
      const ox = Math.sin(group.rotation.y + _idleAngle.val) * orbitRadius;
      const oz = Math.cos(group.rotation.y + _idleAngle.val) * orbitRadius;

      _wantPos.set(
        aPos.x - ox,
        aPos.y + orbitHeight,
        aPos.z - oz,
      );

      // Gentle drift lerp speed while idle
      const idleLerp = _idleTime.val < orbitDelay ? 1.5 : 0.9;
      camera.position.lerp(_wantPos, Math.min(1, idleLerp * dtC));

      _wantLook.set(aPos.x, aPos.y + 1.5, aPos.z);
      camera.lookAt(_wantLook);
    }
  });

  return null;
}
