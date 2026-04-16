/**
 * Minimap.jsx — Live 2D minimap
 */
import { useRef, useEffect } from 'react';
import { ZONES }             from '../utils/constants';

const WORLD = 90;
const SIZE  = 128;

function worldToMap(wx, wz) {
  return [
    ((wx + WORLD / 2) / WORLD) * SIZE,
    ((wz + WORLD / 2) / WORLD) * SIZE,
  ];
}

export default function Minimap() {
  const canvasRef  = useRef();
  const frameRef   = useRef();
  const avatarPos  = useRef({ x: 0, z: 8 });

  // Expose setter for SceneManager to update avatar pos
  Minimap.setAvatarPos = (x, z) => { avatarPos.current = { x, z }; };

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, SIZE, SIZE);

    // BG
    ctx.fillStyle = 'rgba(1,10,24,0.88)';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Grid dots
    ctx.fillStyle = 'rgba(0,240,255,0.06)';
    for (let r = 0; r < SIZE; r += 10) for (let c = 0; c < SIZE; c += 10) ctx.fillRect(c, r, 1.5, 1.5);

    // Roads
    ctx.fillStyle = 'rgba(8,12,20,0.9)';
    const ctr = SIZE / 2;
    ctx.fillRect(0, ctr - 7, SIZE, 14);
    ctx.fillRect(ctr - 7, 0, 14, SIZE);

    // Zones
    Object.values(ZONES).forEach(z => {
      const [mx, my] = worldToMap(z.pos[0], z.pos[2]);
      ctx.beginPath();
      ctx.arc(mx, my, 8, 0, Math.PI * 2);
      ctx.fillStyle   = z.color + '30';
      ctx.fill();
      ctx.strokeStyle = z.color;
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    });

    // Avatar
    const [ax, ay] = worldToMap(avatarPos.current.x, avatarPos.current.z);
    const pulse = 4 + Math.sin(Date.now() * 0.005) * 1.5;
    ctx.beginPath();
    ctx.arc(ax, ay, pulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth   = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ax, ay, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    frameRef.current = requestAnimationFrame(draw);
  }

  useEffect(() => {
    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="minimap-wrap">
      <canvas ref={canvasRef} width={SIZE} height={SIZE} style={{ borderRadius:6, border:'1px solid rgba(0,240,255,.12)' }} />
      <div className="minimap-label">MAP</div>
    </div>
  );
}
