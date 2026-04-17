/**
 * colliders.js — Approximate world collision blocks for buildings.
 * Keeps avatar outside structures while preserving existing map layout.
 */

// Axis-aligned blocking volumes on the XZ plane.
// { minX, maxX, minZ, maxZ }
export const BUILDING_COLLIDERS = [
  // Skills district towers (around x -35)
  // Adjusted bounds to strictly enforce no entering
  { minX: -46.0, maxX: -36.0, minZ: -11.0, maxZ: -1.0 },
  { minX: -40.0, maxX: -30.0, minZ: -11.0, maxZ: -1.0 },
  { minX: -34.0, maxX: -24.0, minZ: -11.0, maxZ: -1.0 },
  { minX: -46.0, maxX: -36.0, minZ: -1.0, maxZ: 9.0 },
  { minX: -40.0, maxX: -30.0, minZ: -1.0, maxZ: 9.0 },
  { minX: -34.0, maxX: -24.0, minZ: -1.0, maxZ: 9.0 },

  // Project district towers (around x 35)
  { minX: 23.0, maxX: 33.0, minZ: -12.0, maxZ: -2.0 },
  { minX: 37.0, maxX: 47.0, minZ: -12.0, maxZ: -2.0 },
  { minX: 23.0, maxX: 33.0, minZ: 2.0, maxZ: 12.0 },
  { minX: 37.0, maxX: 47.0, minZ: 2.0, maxZ: 12.0 },

  // Contact hub
  { minX: -12.0, maxX: 12.0, minZ: -50.0, maxZ: -30.0 },
  { minX: -14.5, maxX: -8.0, minZ: -46.0, maxZ: -34.0 },
  { minX: 8.0, maxX: 14.5, minZ: -46.0, maxZ: -34.0 },
];

// Inner Playable Boundary limits player to city center and prevents 
// wandering into the randomly generated InstancedSkyline background.
export const WORLD_LIMIT = 58;

export function isBlockedPosition(x, z, radius = 0.85) {
  for (const b of BUILDING_COLLIDERS) {
    if (
      x > b.minX - radius &&
      x < b.maxX + radius &&
      z > b.minZ - radius &&
      z < b.maxZ + radius
    ) {
      return true;
    }
  }
  return false;
}

export function clampWorld(x, z) {
  return {
    x: Math.max(-WORLD_LIMIT, Math.min(WORLD_LIMIT, x)),
    z: Math.max(-WORLD_LIMIT, Math.min(WORLD_LIMIT, z)),
  };
}

export function resolveMovement(prevX, prevZ, nextX, nextZ, radius = 0.85) {
  const cNext = clampWorld(nextX, nextZ);

  if (!isBlockedPosition(cNext.x, cNext.z, radius)) {
    return cNext;
  }

  // Slide against X wall
  const slideX = clampWorld(cNext.x, prevZ);
  if (!isBlockedPosition(slideX.x, slideX.z, radius)) {
    return slideX;
  }

  // Slide against Z wall
  const slideZ = clampWorld(prevX, cNext.z);
  if (!isBlockedPosition(slideZ.x, slideZ.z, radius)) {
    return slideZ;
  }

  // Stuck, simply refuse movement
  return clampWorld(prevX, prevZ);
}
