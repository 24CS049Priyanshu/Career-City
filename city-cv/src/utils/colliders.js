/**
 * colliders.js — 4-pass slide resolution: no wall sticking, no corner clipping.
 * Velocity is bounced/cancelled on the blocked axis.
 */

export const BUILDING_COLLIDERS = [
  // Skills district towers (around x -35)
  { minX: -44.8, maxX: -37.2, minZ: -10.2, maxZ: -2.2 },
  { minX: -38.8, maxX: -31.2, minZ: -10.2, maxZ: -2.2 },
  { minX: -32.8, maxX: -25.2, minZ: -10.2, maxZ: -2.2 },
  { minX: -44.8, maxX: -37.2, minZ: -0.2,  maxZ:  7.8 },
  { minX: -38.8, maxX: -31.2, minZ: -0.2,  maxZ:  7.8 },
  { minX: -32.8, maxX: -25.2, minZ: -0.2,  maxZ:  7.8 },

  // Project district towers (around x 35)
  { minX: 24.0, maxX: 32.0, minZ: -11.0, maxZ: -3.0 },
  { minX: 38.0, maxX: 46.0, minZ: -11.0, maxZ: -3.0 },
  { minX: 24.0, maxX: 32.0, minZ:   3.0, maxZ: 11.0 },
  { minX: 38.0, maxX: 46.0, minZ:   3.0, maxZ: 11.0 },

  // Contact hub
  { minX: -11.0, maxX: 11.0, minZ: -49.0, maxZ: -31.0 },
  { minX: -13.5, maxX:  -9.0, minZ: -45.0, maxZ: -35.0 },
  { minX:   9.0, maxX:  13.5, minZ: -45.0, maxZ: -35.0 },

  // Filler city blocks
  { minX:  14.8, maxX:  21.2, minZ: -23.2, maxZ: -16.8 },
  { minX: -21.7, maxX: -14.3, minZ: -22.7, maxZ: -17.3 },
  { minX:  22.3, maxX:  27.7, minZ: -35.7, maxZ: -28.3 },
  { minX: -28.2, maxX: -21.8, minZ: -35.2, maxZ: -28.8 },
  { minX:  15.3, maxX:  20.7, minZ:  21.3, maxZ:  26.7 },
  { minX: -22.2, maxX: -13.8, minZ:  21.3, maxZ:  26.7 },
  { minX:  21.8, maxX:  28.2, minZ:  34.8, maxZ:  41.2 },
  { minX: -27.7, maxX: -22.3, minZ:  33.8, maxZ:  42.2 },
  { minX: -59.2, maxX: -50.8, minZ: -16.2, maxZ:  -7.8 },
  { minX: -58.7, maxX: -51.3, minZ:   8.3, maxZ:  15.7 },
  { minX:  50.8, maxX:  59.2, minZ: -16.2, maxZ:  -7.8 },
  { minX:  51.3, maxX:  58.7, minZ:   8.3, maxZ:  15.7 },
];

export const WORLD_LIMIT = 96;

export function isBlockedPosition(x, z, radius = 0.8) {
  for (const b of BUILDING_COLLIDERS) {
    if (
      x > b.minX - radius && x < b.maxX + radius &&
      z > b.minZ - radius && z < b.maxZ + radius
    ) return true;
  }
  return false;
}

export function clampWorld(x, z) {
  return {
    x: Math.max(-WORLD_LIMIT, Math.min(WORLD_LIMIT, x)),
    z: Math.max(-WORLD_LIMIT, Math.min(WORLD_LIMIT, z)),
  };
}

/**
 * 4-pass slide resolution.
 * velRef (optional THREE.Vector3) — velocity is zeroed on blocked axis so
 * the avatar never "clings" to a wall.
 */
export function resolveMovement(prevX, prevZ, nextX, nextZ, radius = 0.8, velRef = null) {
  const cNext = clampWorld(nextX, nextZ);

  // Pass 1: try full movement
  if (!isBlockedPosition(cNext.x, cNext.z, radius)) {
    return cNext;
  }

  // Pass 2: slide along X only (keep Z from previous frame)
  const slideX = clampWorld(cNext.x, prevZ);
  if (!isBlockedPosition(slideX.x, slideX.z, radius)) {
    if (velRef) velRef.z = 0; // cancel Z velocity
    return slideX;
  }

  // Pass 3: slide along Z only (keep X from previous frame)
  const slideZ = clampWorld(prevX, cNext.z);
  if (!isBlockedPosition(slideZ.x, slideZ.z, radius)) {
    if (velRef) velRef.x = 0; // cancel X velocity
    return slideZ;
  }

  // Pass 4: fully blocked — stay put and kill velocity
  if (velRef) { velRef.x = 0; velRef.z = 0; }
  return clampWorld(prevX, prevZ);
}
