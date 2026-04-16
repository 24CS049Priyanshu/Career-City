/** zones.js — zone platforms, rings, pillars and hub path lines */
import { ZONES } from '../data/content.js';

/**
 * Builds all zone platforms.
 * Returns: { rings: Mesh[], clickMeshes: Mesh[] }
 */
export function buildZones(scene) {
  const rings      = [];
  const clickMeshes = [];

  Object.entries(ZONES).forEach(([key, z]) => {
    const [px, py, pz] = z.pos;
    const g = new THREE.Group();
    g.position.set(px, py, pz);

    // Platform disc
    const platGeo = new THREE.CylinderGeometry(4.6, 5.0, 0.28, 36);
    const platMat = new THREE.MeshStandardMaterial({
      color: z.color, emissive: z.color, emissiveIntensity: 0.22,
      roughness: 0.35, metalness: 0.85,
    });
    const plat = new THREE.Mesh(platGeo, platMat);
    plat.receiveShadow = true;
    plat.userData = { zone: key };
    g.add(plat);
    clickMeshes.push(plat);

    // Vertical pillar
    const pilMat = new THREE.MeshStandardMaterial({
      color: z.color, emissive: z.color, emissiveIntensity: 0.55,
      transparent: true, opacity: 0.6,
    });
    const pil = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 7, 8), pilMat);
    pil.position.y = 3.6;
    g.add(pil);

    // Floating orbit ring
    const ringMat = new THREE.MeshStandardMaterial({
      color: z.color, emissive: z.color, emissiveIntensity: 1.4,
      transparent: true, opacity: 0.85,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.08, 8, 52), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.8;
    ring.userData = {
      baseY:  1.8,
      speed:  0.45 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
    };
    g.add(ring);
    rings.push(ring);

    // Outer decorative thin ring
    const rimMat = new THREE.MeshStandardMaterial({
      color: z.color, emissive: z.color, emissiveIntensity: 0.6,
      transparent: true, opacity: 0.4,
    });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(4.7, 0.04, 6, 48), rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.18;
    g.add(rim);

    scene.add(g);
  });

  // Hub path lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.14 });
  Object.values(ZONES).forEach(z => {
    const pts = [
      new THREE.Vector3(0, 0.06, 0),
      new THREE.Vector3(...z.pos).setY(0.06),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    scene.add(new THREE.Line(geo, lineMat));
  });

  return { rings, clickMeshes };
}

/** Animate floating rings — call every frame */
export function animateRings(rings, t) {
  rings.forEach(ring => {
    const { baseY, speed, offset } = ring.userData;
    ring.position.y = baseY + Math.sin(t * speed + offset) * 0.35;
    ring.rotation.z += 0.008;
  });
}
