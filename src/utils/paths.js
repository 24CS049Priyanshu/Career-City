/**
 * paths.js — Road routes for cars and NPC walking paths
 * All positions are [x, y, z] world coordinates
 */

// ── CAR ROUTES (rectangular loops on actual roads) ──────────────
// E-W road: cars go along z ≈ ±3 lanes
// N-S road: cars go along x ≈ ±3 lanes

export const CAR_ROUTES = [
  // Route 0: E-W lane heading east (z = -3)
  { path: [[-90,0,-3],[90,0,-3],[90,0,-6],[-90,0,-6]], color:'#c0392b', speed:10 },
  // Route 1: E-W lane heading west (z = +3)
  { path: [[90,0,3],[-90,0,3],[-90,0,6],[90,0,6]],   color:'#2980b9', speed:9  },
  // Route 2: N-S lane heading south (x = +3)
  { path: [[3,0,-90],[3,0,90],[6,0,90],[6,0,-90]],    color:'#27ae60', speed:11 },
  // Route 3: N-S lane heading north (x = -3)
  { path: [[-3,0,90],[-3,0,-90],[-6,0,-90],[-6,0,90]],color:'#8e44ad',speed:10 },
  // Route 4: second E-W car, offset start
  { path: [[-90,0,-3],[90,0,-3],[90,0,-6],[-90,0,-6]], color:'#d4a017', speed:8  },
  // Route 5: second E-W west-bound
  { path: [[90,0,3],[-90,0,3],[-90,0,6],[90,0,6]],    color:'#1a6b6b', speed:12 },
  // Route 6: inner plaza loop (taxi-style)
  { path: [[-17,0,-5],[17,0,-5],[17,0,5],[-17,0,5]],   color:'#f39c12', speed:7  },
];

// ── NPC WALKING PATHS (sidewalks near each district) ──────────────
export const NPC_PATHS = [
  // Skills district sidewalk loop (left side, z near 0)
  { path: [[-28,0,-8],[-42,0,-8],[-42,0,8],[-28,0,8]] },
  // Projects district sidewalk loop (right side)
  { path: [[28,0,-8],[42,0,-8],[42,0,8],[28,0,8]] },
  // Contact hub approach path
  { path: [[-5,0,-30],[5,0,-30],[5,0,-50],[-5,0,-50]] },
  // Central plaza strollers
  { path: [[-8,0,5],[8,0,5],[8,0,15],[-8,0,15]] },
  // Road-crossing NPC (east side)
  { path: [[15,0,-8],[22,0,-8],[22,0,8],[15,0,8]] },
];
