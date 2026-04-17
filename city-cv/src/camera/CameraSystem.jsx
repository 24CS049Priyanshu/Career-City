/**
 * CameraSystem.jsx — GTA5-style third-person orbit camera.
 *
 * HOW GTA5 CAMERA WORKS:
 * 1. Camera orbits around the player on a sphere defined by (theta, phi, distance).
 * 2. Mouse/trackpad drag rotates the orbit (theta = yaw, phi = pitch).
 * 3. Camera position lerps toward the desired orbit point with heavy lag
 *    (this gives the cinematic "crane on rails" feeling).
 * 4. LookAt target also lerps separately (slightly faster than position).
 * 5. When the player stops, the camera gently drifts into an idle orbit.
 *
 * MOUSE CONTROL:
 * - Drag (any button) on the 3D canvas rotates the camera.
 * - Quick clicks (<200ms, <5px) still register as building interactions.
 * - Works with both mouse and laptop trackpad.
 *
 * STORY MODE:
 * - Camera auto-positions behind the avatar (no mouse control).
 */
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { avatarState } from '../player/avatarState';
import { cameraState } from '../player/cameraState';
import useStore from '../store/useStore';

// ── Reusable vectors (avoid GC) ──
const _desiredPos  = new THREE.Vector3();
const _desiredLook = new THREE.Vector3();
const _smoothPos   = new THREE.Vector3(0, 15, 28);
const _smoothLook  = new THREE.Vector3(0, 1.8, 0);

// ── Configuration ──
const ORBIT_DIST      = 22;     // distance from player
const ORBIT_MIN_PHI   = 0.15;   // min vertical angle (near horizontal)
const ORBIT_MAX_PHI   = 1.2;    // max vertical angle (near top-down)
const LOOK_HEIGHT     = 1.8;    // look slightly above player feet
const FOLLOW_SPEED    = 2.0;    // camera position lerp speed (lower = more cinematic)
const LOOK_SPEED      = 3.0;    // lookAt lerp speed (slightly faster than position)
const MOUSE_SENS_X    = 0.004;  // horizontal mouse sensitivity
const MOUSE_SENS_Y    = 0.003;  // vertical mouse sensitivity
const DRAG_THRESHOLD  = 5;      // pixels before a click becomes a drag
const IDLE_ORBIT_SPEED = 0.08;  // radians/sec idle orbit
const IDLE_DELAY       = 2.5;   // seconds before idle orbit starts

export default function CameraSystem({ avatarRef }) {
  const { camera, gl } = useThree();

  const initialized = useRef(false);
  const idleTimer   = useRef(0);
  const idleAngle   = useRef(0);

  // ── Mouse drag state ──
  const pointerDown  = useRef(false);
  const dragStart    = useRef({ x: 0, y: 0 });
  const isDragging   = useRef(false);

  // ── Setup mouse/trackpad listeners ──
  useEffect(() => {
    const canvas = gl.domElement;

    function onPointerDown(e) {
      if (useStore.getState().mode !== 'free') return;
      pointerDown.current = true;
      isDragging.current = false;
      dragStart.current = { x: e.clientX, y: e.clientY };
    }

    function onPointerMove(e) {
      if (!pointerDown.current) return;
      if (useStore.getState().mode !== 'free') return;

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      // Dead zone: don't start rotating until mouse has moved beyond threshold
      if (!isDragging.current) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        isDragging.current = true;
      }

      // Apply rotation
      cameraState.theta -= e.movementX * MOUSE_SENS_X;
      cameraState.phi   -= e.movementY * MOUSE_SENS_Y;
      cameraState.phi    = THREE.MathUtils.clamp(cameraState.phi, ORBIT_MIN_PHI, ORBIT_MAX_PHI);
    }

    function onPointerUp() {
      pointerDown.current = false;
      isDragging.current = false;
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup',   onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup',   onPointerUp);
    };
  }, [gl]);

  useFrame((_, dt) => {
    const group = avatarRef?.current;
    if (!group) return;

    const dtC = Math.min(dt, 0.05);
    const pos = group.position;
    const mode = useStore.getState().mode;

    // ── Seed on first frame (prevent camera pop) ──
    if (!initialized.current) {
      const t = cameraState.theta;
      const p = cameraState.phi;
      _smoothPos.set(
        pos.x + ORBIT_DIST * Math.sin(t) * Math.cos(p),
        pos.y + ORBIT_DIST * Math.sin(p),
        pos.z + ORBIT_DIST * Math.cos(t) * Math.cos(p),
      );
      _smoothLook.set(pos.x, pos.y + LOOK_HEIGHT, pos.z);
      camera.position.copy(_smoothPos);
      camera.lookAt(_smoothLook);
      initialized.current = true;
      return;
    }

    // ═══════════════════════════════════════════
    // FREE MODE — mouse-controlled orbit
    // ═══════════════════════════════════════════
    if (mode === 'free') {
      const isMoving = avatarState.isMoving;

      if (isMoving) {
        idleTimer.current = 0;
        idleAngle.current = 0;
      } else {
        // Idle orbit: gently rotate after delay
        idleTimer.current += dtC;
        if (idleTimer.current > IDLE_DELAY) {
          idleAngle.current += dtC * IDLE_ORBIT_SPEED;
        }
      }

      const t = cameraState.theta + idleAngle.current;
      const p = cameraState.phi;

      _desiredPos.set(
        pos.x + ORBIT_DIST * Math.sin(t) * Math.cos(p),
        pos.y + ORBIT_DIST * Math.sin(p),
        pos.z + ORBIT_DIST * Math.cos(t) * Math.cos(p),
      );

    // ═══════════════════════════════════════════
    // STORY MODE — auto follow behind player
    // ═══════════════════════════════════════════
    } else {
      const yaw = group.rotation.y;
      _desiredPos.set(
        pos.x - Math.sin(yaw) * 18,
        pos.y + 12,
        pos.z - Math.cos(yaw) * 18,
      );
    }

    // ── LookAt target ──
    _desiredLook.set(pos.x, pos.y + LOOK_HEIGHT, pos.z);

    // ── Smooth follow (this is what makes it feel like GTA5) ──
    _smoothPos.lerp(_desiredPos,  Math.min(1, FOLLOW_SPEED * dtC));
    _smoothLook.lerp(_desiredLook, Math.min(1, LOOK_SPEED * dtC));

    camera.position.copy(_smoothPos);
    camera.lookAt(_smoothLook);
  });

  return null;
}
