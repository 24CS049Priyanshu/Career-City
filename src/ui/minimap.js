/** minimap.js — MinimapRenderer: canvas 2D live map */
import { ZONES } from '../data/content.js';

const WORLD_SIZE = 72;   // world spans ~[-36..36]
const MAP_SIZE   = 132;

function worldToMap(wx, wz) {
  return [
    ((wx + WORLD_SIZE / 2) / WORLD_SIZE) * MAP_SIZE,
    ((wz + WORLD_SIZE / 2) / WORLD_SIZE) * MAP_SIZE,
  ];
}

export class MinimapRenderer {
  constructor() {
    this._canvas = document.getElementById('minimap-canvas');
    this._ctx    = this._canvas.getContext('2d');
  }

  draw(avatarGroup) {
    const ctx = this._ctx;
    ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);

    // BG
    ctx.fillStyle = 'rgba(1,10,24,0.88)';
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Grid dots
    ctx.fillStyle = 'rgba(0,240,255,0.07)';
    for (let r = 0; r < MAP_SIZE; r += 9)
      for (let c = 0; c < MAP_SIZE; c += 9)
        ctx.fillRect(c, r, 1.5, 1.5);

    // Zone circles
    Object.values(ZONES).forEach(z => {
      const [mx, my] = worldToMap(z.pos[0], z.pos[2]);
      ctx.beginPath();
      ctx.arc(mx, my, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = z.hex + '44';
      ctx.fill();
      ctx.strokeStyle = z.hex;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    });

    // Avatar position
    if (avatarGroup) {
      const [ax, ay] = worldToMap(avatarGroup.position.x, avatarGroup.position.z);
      // Outer pulse ring
      const pulse = 4 + Math.sin(Date.now() * 0.004) * 2;
      ctx.beginPath();
      ctx.arc(ax, ay, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth   = 1;
      ctx.stroke();
      // Inner dot
      ctx.beginPath();
      ctx.arc(ax, ay, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }
}
