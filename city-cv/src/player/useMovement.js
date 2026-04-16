/**
 * useMovement.js — GTA-style physics: true velocity, friction, arrow key support,
 * 4-axis wall bounce on collision (no wall sticking).
 */
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { avatarState } from './avatarState';
import useStore from '../store/useStore';
import { resolveMovement } from '../utils/colliders';

const _target    = new THREE.Vector3();
const _dir       = new THREE.Vector3();
const _moveDir   = new THREE.Vector3();
const _desiredVel= new THREE.Vector3();

const SPEED          = 9;
const FREE_SPEED     = 9.5;
const ARRIVE_D       = 0.45;
const TURN_SPEED_STORY = 5.5;
const TURN_SPEED_FREE  = 4.8;
const COLLISION_RADIUS = 0.85;
const FREE_ACCEL     = 14;   // acceleration rate
const FREE_DECEL     = 18;   // deceleration (friction)
const STORY_ACCEL    = 8;
const STOP_SQ        = 0.0008; // squared velocity threshold to go idle

function smoothTurn(group, targetYaw, dtC, turnSpeed) {
  const curYaw = group.rotation.y;
  let delta = targetYaw - curYaw;
  while (delta >  Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  const maxStep = turnSpeed * dtC;
  const step = THREE.MathUtils.clamp(delta, -maxStep, maxStep);
  group.rotateY(step);
}

export default function useMovement(avatarGroupRef, targetRef) {
  const wasMoving = useRef(false);
  const keyState  = useRef({ w: false, a: false, s: false, d: false,
                              ArrowUp: false, ArrowLeft: false,
                              ArrowDown: false, ArrowRight: false });
  const smoothInput = useRef({ x: 0, z: 0 });
  const velRef      = useRef(new THREE.Vector3());

  useEffect(() => {
    function onKeyDown(e) {
      const k = e.key;
      const kl = k.toLowerCase();
      if (kl === 'w' || k === 'ArrowUp')    { keyState.current.w = true;  keyState.current.ArrowUp    = true; }
      if (kl === 'a' || k === 'ArrowLeft')  { keyState.current.a = true;  keyState.current.ArrowLeft  = true; }
      if (kl === 's' || k === 'ArrowDown')  { keyState.current.s = true;  keyState.current.ArrowDown  = true; }
      if (kl === 'd' || k === 'ArrowRight') { keyState.current.d = true;  keyState.current.ArrowRight = true; }
    }

    function onKeyUp(e) {
      const k = e.key;
      const kl = k.toLowerCase();
      if (kl === 'w' || k === 'ArrowUp')    { keyState.current.w = false; keyState.current.ArrowUp    = false; }
      if (kl === 'a' || k === 'ArrowLeft')  { keyState.current.a = false; keyState.current.ArrowLeft  = false; }
      if (kl === 's' || k === 'ArrowDown')  { keyState.current.s = false; keyState.current.ArrowDown  = false; }
      if (kl === 'd' || k === 'ArrowRight') { keyState.current.d = false; keyState.current.ArrowRight = false; }
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

    // ── FREE MODE ───────────────────────────────────────────────────────────
    if (mode === 'free') {
      const ks = keyState.current;
      const kx = (ks.d ? 1 : 0) - (ks.a ? 1 : 0);
      const kz = (ks.s ? 1 : 0) - (ks.w ? 1 : 0);
      const j  = store.joystick;

      // Smooth joystick interpolation
      smoothInput.current.x = THREE.MathUtils.lerp(smoothInput.current.x, j?.x ?? 0, Math.min(1, 12 * dtC));
      smoothInput.current.z = THREE.MathUtils.lerp(smoothInput.current.z, j?.z ?? 0, Math.min(1, 12 * dtC));

      const inputX = kx + smoothInput.current.x;
      const inputZ = kz + smoothInput.current.z;
      const mag = Math.hypot(inputX, inputZ);

      if (mag > 0.05) {
        // Normalise input so diagonal isn't faster
        _moveDir.set(inputX / mag, 0, inputZ / mag);
        const speedScale = Math.min(1, mag);
        _desiredVel.copy(_moveDir).multiplyScalar(FREE_SPEED * speedScale);
        velRef.current.lerp(_desiredVel, Math.min(1, FREE_ACCEL * dtC));

        const nextX = group.position.x + velRef.current.x * dtC;
        const nextZ = group.position.z + velRef.current.z * dtC;
        const resolved = resolveMovement(
          group.position.x, group.position.z, nextX, nextZ, COLLISION_RADIUS,
          velRef.current
        );
        group.position.x = resolved.x;
        group.position.z = resolved.z;
        targetRef.current = [group.position.x, 0, group.position.z];

        avatarState.isMoving = true;
        if (!wasMoving.current) {
          wasMoving.current = true;
          avatarState.animState = 'WALK';
        }
        const targetYaw = Math.atan2(velRef.current.x, velRef.current.z);
        smoothTurn(group, targetYaw, dtC, TURN_SPEED_FREE);
        return;
      }

      // ── Friction slide-to-stop ──
      velRef.current.lerp(_desiredVel.set(0, 0, 0), Math.min(1, FREE_DECEL * dtC));
      if (velRef.current.lengthSq() > STOP_SQ) {
        const nextX = group.position.x + velRef.current.x * dtC;
        const nextZ = group.position.z + velRef.current.z * dtC;
        const resolved = resolveMovement(
          group.position.x, group.position.z, nextX, nextZ, COLLISION_RADIUS,
          velRef.current
        );
        group.position.x = resolved.x;
        group.position.z = resolved.z;
        targetRef.current = [group.position.x, 0, group.position.z];
        const targetYaw = Math.atan2(velRef.current.x, velRef.current.z);
        smoothTurn(group, targetYaw, dtC, TURN_SPEED_FREE);
        avatarState.isMoving = true;
        if (!wasMoving.current) {
          wasMoving.current = true;
          avatarState.animState = 'WALK';
        }
        return;
      }

      // Fully stopped
      velRef.current.set(0, 0, 0);
      if (wasMoving.current) {
        wasMoving.current     = false;
        avatarState.isMoving  = false;
        avatarState.animState = 'IDLE';
      }
      return;
    }

    // ── STORY MODE ─────────────────────────────────────────────────────────
    _target.set(target[0], 0, target[2]);
    const pos  = group.position;
    _dir.copy(_target).sub(pos);
    const dist = _dir.length();

    if (dist < ARRIVE_D) {
      if (wasMoving.current) {
        wasMoving.current          = false;
        avatarState.isMoving       = false;
        avatarState.animState      = mode === 'story' ? 'ARRIVE' : 'IDLE';
        if (mode === 'story') {
          setTimeout(() => {
            if (!avatarState.isMoving) avatarState.animState = 'IDLE';
          }, 1400);
        }
      }
      return;
    }

    avatarState.isMoving = true;
    if (!wasMoving.current) {
      wasMoving.current     = true;
      avatarState.animState = 'WALK';
    }

    _dir.normalize();
    _desiredVel.copy(_dir).multiplyScalar(SPEED);
    velRef.current.lerp(_desiredVel, Math.min(1, STORY_ACCEL * dtC));
    const stepX   = velRef.current.x * dtC;
    const stepZ   = velRef.current.z * dtC;
    const stepMag = Math.hypot(stepX, stepZ);
    const clamped = stepMag > dist && stepMag > 0.00001 ? (dist / stepMag) : 1;
    const nextX   = pos.x + stepX * clamped;
    const nextZ   = pos.z + stepZ * clamped;
    const resolved = resolveMovement(pos.x, pos.z, nextX, nextZ, COLLISION_RADIUS, velRef.current);
    pos.x = resolved.x;
    pos.z = resolved.z;

    const targetYaw = Math.atan2(_dir.x, _dir.z);
    smoothTurn(group, targetYaw, dtC, TURN_SPEED_STORY);
  });
}
