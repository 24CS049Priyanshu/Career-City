/**
 * avatarState.js — Shared mutable singleton for avatar animation
 * (Plain object — no React, no re-renders. useMovement writes it; Avatar reads it.)
 */
export const avatarState = {
  animState: 'IDLE',  // 'IDLE' | 'WALK' | 'ARRIVE' | 'GREET'
  isMoving:  false,
};
