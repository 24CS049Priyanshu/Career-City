/** particles.js — ambient floating particle cloud */
export function buildParticles(scene) {
  const count = 700;
  const pos   = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 90;
    pos[i*3+1] = 0.4 + Math.random() * 14;
    pos[i*3+2] = (Math.random() - 0.5) * 90;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x00f0ff, size: 0.07, sizeAttenuation: true,
    transparent: true, opacity: 0.5,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return pts;
}

export function animateParticles(pts, dt) {
  pts.rotation.y += dt * 0.009;
}
