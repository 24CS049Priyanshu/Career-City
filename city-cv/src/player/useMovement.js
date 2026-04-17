/**
 * useMovement.js — GTA5-style physics-based movement.
 *
 * PHYSICS MODEL (not direct position updates):
 *   velocity += inputDirection * ACCELERATION * delta
 *   velocity *= friction                (frame-rate independent exponential decay)
 *   position += velocity * delta
 *
 * CAMERA-RELATIVE MOVEMENT:
 *   W = move toward where camera is looking (into the screen)
 *   S = move away from camera
 *   A/D = strafe left/right relative to camera
 *   This reads cameraState.theta set by CameraSystem.
 *
 * CHARACTER ROTATION:
 *   Character always faces velocity direction (atan2), with smooth turn.
 *
 * COLLISIONS:
 *   4-pass slide resolution (existing system). Velocity clone is used
 *   so collision corrections don't feed back as jitter.
 */
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { avatarState } from './avatarState';
import { cameraState } from './cameraState';
import useStore from '../store/useStore';
import { resolveMovement } from '../utils/colliders';

// ── Reusable vectors ──
const _target = new THREE.Vector3();
const _dir    = new THREE.Vector3();
const _input  = new THREE.Vector3();

// ── Physics constants ──
const ACCELERATION     = 40;    // how fast you reach top speed
const MAX_SPEED        = 8;     // top walking speed (units/sec)
const FRICTION         = 0.02;  // fraction of velocity remaining after 1 second with no input
const STORY_SPEED      = 7;     // story mode auto-walk speed
const STORY_ACCEL      = 6;     // story mode acceleration (lerp factor)
const ARRIVE_D         = 0.6;   // arrival threshold for story targets
const TURN_SPEED       = 8;     // character turn speed (rad/sec)
const COLLISION_RADIUS = 0.85;
const STOP_THRESHOLD   = 0.08;  // below this speed, snap to zero

/**
 * Smooth character turn toward a target yaw angle.
 */
function smoothTurn(group, targetYaw, dtC) {
  let delta = targetYaw - group.rotation.y;
  // Wrap to [-PI, PI]
  while (delta >  Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  group.rotateY(THREE.MathUtils.clamp(delta, -TURN_SPEED * dtC, TURN_SPEED * dtC));
}

export default function useMovement(avatarGroupRef, targetRef) {
  const wasMoving = useRef(false);
  const keyState  = useRef({ w: false, a: false, s: false, d: false });
  const velocity  = useRef(new THREE.Vector3());

  // ── Keyboard input ──
  useEffect(() => {
    function onKeyDown(e) {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp')    keyState.current.w = true;
      if (k === 'a' || e.key === 'ArrowLeft')  keyState.current.a = true;
      if (k === 's' || e.key === 'ArrowDown')  keyState.current.s = true;
      if (k === 'd' || e.key === 'ArrowRight') keyState.current.d = true;
    }
    function onKeyUp(e) {
      const k = e.key.toLowerCase();
      if (k === 'w' || e.key === 'ArrowUp')    keyState.current.w = false;
      if (k === 'a' || e.key === 'ArrowLeft')  keyState.current.a = false;
      if (k === 's' || e.key === 'ArrowDown')  keyState.current.s = false;
      if (k === 'd' || e.key === 'ArrowRight') keyState.current.d = false;
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
    };
  }, []);

  useFrame((_, dt) => {
    const group = avatarGroupRef?.current;
    if (!group) return;

    const dtC   = Math.min(dt, 0.05);
    const store = useStore.getState();
    const mode  = store.mode;
    const target = targetRef?.current;
    if (!target) return;
    const vel = velocity.current;

    // ═══════════════════════════════════════════
    // FREE MODE — Physics-based, camera-relative
    // ═══════════════════════════════════════════
    if (mode === 'free') {
      const ks = keyState.current;

      // Raw input axes
      const rawX = (ks.d ? 1 : 0) - (ks.a ? 1 : 0);
      const rawZ = (ks.w ? 1 : 0) - (ks.s ? 1 : 0); // W = forward (toward camera look dir)

      const hasinput = Math.abs(rawX) + Math.abs(rawZ) > 0;

      if (hasinput) {
        // ── Camera-relative direction ──
        // Forward = direction from camera toward player (ground plane)
        // Right   = perpendicular to forward
        const theta = cameraState.theta;
        const fwdX = -Math.sin(theta);
        const fwdZ = -Math.cos(theta);
        const rgtX =  Math.cos(theta);
        const rgtZ = -Math.sin(theta);

        // Combine: move forward/back + strafe left/right
        _input.set(
          fwdX * rawZ + rgtX * rawX,
          0,
          fwdZ * rawZ + rgtZ * rawX,
        );
        _input.normalize();

        // v = v + a * t  (GTA physics equation)
        vel.x += _input.x * ACCELERATION * dtC;
        vel.z += _input.z * ACCELERATION * dtC;
      }

      // ── Friction (frame-rate independent exponential decay) ──
      // After 1 second of no input, velocity → FRICTION fraction of original
      const frictionFactor = Math.pow(FRICTION, dtC);
      vel.x *= frictionFactor;
      vel.z *= frictionFactor;

      // ── Clamp to max speed ──
      const speed = Math.hypot(vel.x, vel.z);
      if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;
        vel.x *= scale;
        vel.z *= scale;
      }

      // ── Apply movement + collision ──
      if (speed > STOP_THRESHOLD) {
        const nextX = group.position.x + vel.x * dtC;
        const nextZ = group.position.z + vel.z * dtC;

        // Clone velocity for collision so corrections don't cause jitter
        const velClone = vel.clone();
        const resolved = resolveMovement(
          group.position.x, group.position.z,
          nextX, nextZ, COLLISION_RADIUS, velClone
        );

        group.position.x = resolved.x;
        group.position.z = resolved.z;
        targetRef.current = [resolved.x, 0, resolved.z];

        // If collision killed an axis, dampen our real velocity too (wall slide)
        if (Math.abs(velClone.x) < 0.01 && Math.abs(vel.x) > 0.1) vel.x *= 0.1;
        if (Math.abs(velClone.z) < 0.01 && Math.abs(vel.z) > 0.1) vel.z *= 0.1;

        // ── Character rotation → face velocity direction ──
        const angle = Math.atan2(vel.x, vel.z);
        smoothTurn(group, angle, dtC);

        avatarState.isMoving = true;
        if (!wasMoving.current) {
          wasMoving.current = true;
          avatarState.animState = 'WALK';
        }
      } else {
        // Fully stopped
        vel.set(0, 0, 0);
        if (wasMoving.current) {
          wasMoving.current = false;
          avatarState.isMoving = false;
          avatarState.animState = 'IDLE';
        }
      }
      return;
    }

    // ═══════════════════════════════════════════
    // STORY MODE — auto-walk to target with lerp
    // ═══════════════════════════════════════════
    _target.set(target[0], 0, target[2]);
    _dir.copy(_target).sub(group.position);
    const dist = _dir.length();

    if (dist < ARRIVE_D) {
      vel.set(0, 0, 0);
      if (wasMoving.current) {
        wasMoving.current = false;
        avatarState.isMoving = false;
        avatarState.animState = 'IDLE';
      }
      return;
    }

    avatarState.isMoving = true;
    if (!wasMoving.current) {
      wasMoving.current = true;
      avatarState.animState = 'WALK';
    }

    _dir.normalize();
    const desiredX = _dir.x * STORY_SPEED;
    const desiredZ = _dir.z * STORY_SPEED;

    // Smooth velocity ramp
    const factor = Math.min(1, STORY_ACCEL * dtC);
    vel.x += (desiredX - vel.x) * factor;
    vel.z += (desiredZ - vel.z) * factor;

    const stepX   = vel.x * dtC;
    const stepZ   = vel.z * dtC;
    const stepMag = Math.hypot(stepX, stepZ);
    const clampF  = stepMag > dist ? dist / stepMag : 1;

    const nextX = group.position.x + stepX * clampF;
    const nextZ = group.position.z + stepZ * clampF;

    const velClone = vel.clone();
    const resolved = resolveMovement(
      group.position.x, group.position.z,
      nextX, nextZ, COLLISION_RADIUS, velClone
    );

    group.position.x = resolved.x;
    group.position.z = resolved.z;

    // Face movement direction
    smoothTurn(group, Math.atan2(_dir.x, _dir.z), dtC);
  });
}
