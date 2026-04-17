/**
 * cameraState.js — Shared mutable state for the camera orbit.
 *
 * CameraSystem writes theta/phi; useMovement reads theta to compute
 * camera-relative movement direction (WASD moves relative to where
 * the camera is looking, exactly like GTA5).
 *
 * Plain object — no React, no re-renders.
 */
export const cameraState = {
  theta: 0,       // horizontal orbit angle (radians). 0 = camera at +Z from player
  phi: 0.45,      // vertical angle (radians from horizontal). Higher = looking more from above
};
