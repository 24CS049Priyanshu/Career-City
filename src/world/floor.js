/** floor.js — ground plane, grid, star field, hologram rings */
export function buildFloor(scene) {
  // Ground
  const geo = new THREE.PlaneGeometry(140, 140);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x020d1e, roughness: 0.8, metalness: 0.2,
  });
  const floor = new THREE.Mesh(geo, mat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Coarse grid
  const g1 = new THREE.GridHelper(140, 70, 0x00f0ff, 0x051830);
  g1.position.y = 0.01;
  g1.material.opacity = 0.3;
  g1.material.transparent = true;
  scene.add(g1);

  // Fine grid
  const g2 = new THREE.GridHelper(80, 160, 0x092040, 0x092040);
  g2.position.y = 0.02;
  g2.material.opacity = 0.18;
  g2.material.transparent = true;
  scene.add(g2);
}

export function buildStars(scene) {
  const count = 1400;
  const pos   = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 220;
    pos[i*3+1] = 18 + Math.random() * 90;
    pos[i*3+2] = (Math.random() - 0.5) * 220;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xaaccff, size: 0.18, sizeAttenuation: true });
  scene.add(new THREE.Points(geo, mat));
}

/** Central hologram torus pair — returned so main can rotate them */
export function buildHologram(scene) {
  const mk = (radius, color) => {
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.06, 8, 64),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.6, transparent: true, opacity: 0.7 })
    );
    m.position.y = 6;
    scene.add(m);
    return m;
  };
  const t1 = mk(2.4, 0x00f0ff);
  const t2 = mk(1.7, 0xa855f7);
  t1.rotation.x = Math.PI / 4;
  t2.rotation.y = Math.PI / 4;
  return { t1, t2 };
}
