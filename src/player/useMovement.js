/**
 * useMovement.js — Physics-based inertia movement driven by targetRef and Joystick
 * Uses velocity vectors for smooth acceleration and deceleration (no snapping).
 */
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { avatarState } from './avatarState';
import useStore from '../store/useStore';
import { resolveMovement } from '../utils/colliders';

const _target = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _moveDir = new THREE.Vector3();

// Physics constants
const MAX_SPEED = 14;     // Top speed
const ACCEL = 35;         // Acceleration force
const FRICTION = 10;      // Deceleration when no input
const ARRIVE_D = 0.45;    
const TURN_SPEED = 8.0;   // Snappier but smooth turning
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
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const wasMoving = useRef(false);
  const keyState = useRef({ w: false, a: false, s: false, d: false });

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
    
    // Joystick and keyboard inputs
    let inputX = 0;
    let inputZ = 0;

    if (mode === 'free') {
      const ks = keyState.current;
      const kx = (ks.d ? 1 : 0) - (ks.a ? 1 : 0);
      const kz = (ks.s ? 1 : 0) - (ks.w ? 1 : 0);
      const j = store.joystick;

      inputX = THREE.MathUtils.clamp(kx + (j?.x ?? 0), -1, 1);
      inputZ = THREE.MathUtils.clamp(kz + (j?.z ?? 0), -1, 1);
    } else if (mode === 'story' && target) {
      // Auto-pathing toward a destination (Story mode or clicking)
      _target.set(target[0], 0, target[2]);
      _dir.copy(_target).sub(group.position);
      const dist = _dir.length();
      
      if (dist < ARRIVE_D) {
        inputX = 0;
        inputZ = 0;
        if (wasMoving.current) {
          wasMoving.current = false;
          avatarState.isMoving = false;
          avatarState.animState = 'ARRIVE';
          setTimeout(() => { if (!avatarState.isMoving) avatarState.animState = 'IDLE'; }, 1000);
        }
      } else {
        _dir.normalize();
        inputX = _dir.x;
        inputZ = _dir.z;
      }
    }

    // Applying physics (acceleration vs friction)
    const currentSpeed = velocity.current.length();
    const inputMag = Math.hypot(inputX, inputZ);

    if (inputMag > 0.1) {
      // Accelerate
      _moveDir.set(inputX, 0, inputZ).normalize();
      velocity.current.x += _moveDir.x * ACCEL * dtC;
      velocity.current.z += _moveDir.z * ACCEL * dtC;

      // Cap speed
      if (velocity.current.length() > MAX_SPEED) {
        velocity.current.normalize().multiplyScalar(MAX_SPEED);
      }

      avatarState.isMoving = true;
      if (!wasMoving.current) {
        wasMoving.current = true;
        avatarState.animState = 'WALK';
      }

      // Smooth turning towards movement vector
      const targetYaw = Math.atan2(velocity.current.x, velocity.current.z);
      smoothTurn(group, targetYaw, dtC, TURN_SPEED);

    } else {
      // Friction (Decelerate)
      if (currentSpeed > 0.1) {
        velocity.current.x -= velocity.current.x * FRICTION * dtC;
        velocity.current.z -= velocity.current.z * FRICTION * dtC;
      } else {
        velocity.current.set(0,0,0);
        if (wasMoving.current && mode === 'free') {
          wasMoving.current = false;
          avatarState.isMoving = false;
          avatarState.animState = 'IDLE';
        }
      }
    }

    // Apply Velocity to Position
    if (velocity.current.lengthSq() > 0.001) {
      const nextX = group.position.x + velocity.current.x * dtC;
      const nextZ = group.position.z + velocity.current.z * dtC;
      
      // Resolve against world bounds / buildings
      const resolved = resolveMovement(group.position.x, group.position.z, nextX, nextZ, COLLISION_RADIUS);
      group.position.x = resolved.x;
      group.position.z = resolved.z;
      
      // Sync targetRef so camera follows nicely in free mode
      if (mode === 'free') {
        targetRef.current = [group.position.x, 0, group.position.z];
      }
    }
  });
}
