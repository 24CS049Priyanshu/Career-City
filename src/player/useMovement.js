/**
 * useMovement.js — Avatar movement driven by targetRef (a React ref, not a value)
 * Reads targetRef.current each frame so it always has the latest target,
 * regardless of React re-renders or closures being stale.
 */
import { useEffect, useRef }  from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE   from 'three';
import { avatarState } from './avatarState';
import useStore from '../store/useStore';
import { resolveMovement } from '../utils/colliders';

const _target  = new THREE.Vector3();
const _dir     = new THREE.Vector3();
const _moveDir = new THREE.Vector3();
const SPEED    = 9;     // units / second
const FREE_SPEED = 9.5;
const ARRIVE_D = 0.45;  // snap distance
const TURN_SPEED_STORY = 5.5;
const TURN_SPEED_FREE = 4.2;
const COLLISION_RADIUS = 0.85;

function smoothTurn(group, targetYaw, dtC, turnSpeed) {
  const curYaw = group.rotation.y;
  let delta = targetYaw - curYaw;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  const maxStep = turnSpeed * dtC;
  const step = THREE.MathUtils.clamp(delta, -maxStep, maxStep);
  group.rotateY(step);
}

export default function useMovement(avatarGroupRef, targetRef) {
  const wasMoving = useRef(false);
  const keyState = useRef({ w: false, a: false, s: false, d: false });
  const smoothInput = useRef({ x: 0, z: 0 });

  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key.toLowerCase();
      if (key === 'w') keyState.current.w = true;
      if (key === 'a') keyState.current.a = true;
      if (key === 's') keyState.current.s = true;
      if (key === 'd') keyState.current.d = true;
    }

    function onKeyUp(e) {
      const key = e.key.toLowerCase();
      if (key === 'w') keyState.current.w = false;
      if (key === 'a') keyState.current.a = false;
      if (key === 's') keyState.current.s = false;
      if (key === 'd') keyState.current.d = false;
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useFrame((_, dt) => {
    const group = avatarGroupRef?.current;
    if (!group) return;

    const dtC = Math.min(dt, 0.05);
    const store = useStore.getState();
    const mode = store.mode;
    const target = targetRef?.current;
    if (!target) return;

    // Full analog free movement: combines keyboard + on-screen joystick.
    if (mode === 'free') {
      const ks = keyState.current;
      const kx = (ks.d ? 1 : 0) - (ks.a ? 1 : 0);
      const kz = (ks.s ? 1 : 0) - (ks.w ? 1 : 0);
      const j = store.joystick;

      // Joystick interpolation for smoothness (no abrupt snapping).
      smoothInput.current.x = THREE.MathUtils.lerp(smoothInput.current.x, j?.x ?? 0, Math.min(1, 10 * dtC));
      smoothInput.current.z = THREE.MathUtils.lerp(smoothInput.current.z, j?.z ?? 0, Math.min(1, 10 * dtC));

      const inputX = kx + smoothInput.current.x;
      const inputZ = kz + smoothInput.current.z;
      const mag = Math.hypot(inputX, inputZ);

      if (mag > 0.05) {
        _moveDir.set(inputX / mag, 0, inputZ / mag);
        const nextX = group.position.x + _moveDir.x * FREE_SPEED * dtC;
        const nextZ = group.position.z + _moveDir.z * FREE_SPEED * dtC;
        const resolved = resolveMovement(group.position.x, group.position.z, nextX, nextZ, COLLISION_RADIUS);
        group.position.x = resolved.x;
        group.position.z = resolved.z;
        targetRef.current = [group.position.x, 0, group.position.z];

        avatarState.isMoving = true;
        if (!wasMoving.current) {
          wasMoving.current = true;
          avatarState.animState = 'WALK';
        }

        const targetYaw = Math.atan2(_moveDir.x, _moveDir.z);
        smoothTurn(group, targetYaw, dtC, TURN_SPEED_FREE);
        return;
      }
    }

    _target.set(target[0], 0, target[2]);
    const pos  = group.position;
    _dir.copyFrom ? _dir.copyFrom(_target) : _dir.copy(_target);
    _dir.sub(pos);
    const dist = _dir.length();

    if (dist < ARRIVE_D) {
      // ── Arrived ──
      if (wasMoving.current) {
        wasMoving.current          = false;
        avatarState.isMoving       = false;
        avatarState.animState      = mode === 'story' ? 'ARRIVE' : 'IDLE';
        if (mode === 'story') {
          // Auto-return to IDLE after arrive sequence
          setTimeout(() => {
            if (!avatarState.isMoving) avatarState.animState = 'IDLE';
          }, 1400);
        }
      }
      return;
    }

    // ── Moving ──
    avatarState.isMoving  = true;
    if (!wasMoving.current) {
      wasMoving.current    = true;
      avatarState.animState = 'WALK';
    }

    _dir.normalize();
    const step = Math.min(SPEED * dtC, dist);
    const nextX = pos.x + _dir.x * step;
    const nextZ = pos.z + _dir.z * step;
    const resolved = resolveMovement(pos.x, pos.z, nextX, nextZ, COLLISION_RADIUS);
    pos.x = resolved.x;
    pos.z = resolved.z;

    // Smooth yaw rotation to face direction of travel
    const targetYaw = Math.atan2(_dir.x, _dir.z);
    smoothTurn(group, targetYaw, dtC, TURN_SPEED_STORY);
  });
}
