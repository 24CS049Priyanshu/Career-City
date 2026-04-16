/**
 * avatar.js — Procedural humanoid avatar
 *
 * Skeleton hierarchy (all groups allow rotation for animation):
 *
 *  avatarRoot
 *    ├── leftLegGrp   (pivot at left hip,  y = 0.55)
 *    │     └── leftShinGrp  (pivot at left knee, y = -0.62 rel to leg)
 *    ├── rightLegGrp  (pivot at right hip, y = 0.55)
 *    │     └── rightShinGrp
 *    ├── bodyGrp      (pivot at waist,     y = 0.55)
 *    │     ├── torsoMesh
 *    │     ├── leftArmGrp  (pivot at left shoulder)
 *    │     │     └── leftForeArmGrp
 *    │     ├── rightArmGrp (pivot at right shoulder)
 *    │     │     └── rightForeArmGrp
 *    │     ├── neckMesh
 *    │     └── headGrp     (pivot at top of neck)
 *    │           ├── skullMesh
 *    │           ├── visorMesh
 *    │           └── antennaMesh
 *    └── auraRing      (torus at feet level)
 */

const MAT = {
  body:    () => new THREE.MeshStandardMaterial({ color: 0x00bcd4, emissive: 0x003344, emissiveIntensity: 0.3, roughness: 0.25, metalness: 0.75 }),
  dark:    () => new THREE.MeshStandardMaterial({ color: 0x003344, emissive: 0x001122, emissiveIntensity: 0.2, roughness: 0.35, metalness: 0.85 }),
  head:    () => new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x004455, emissiveIntensity: 0.4, roughness: 0.2,  metalness: 0.8  }),
  visor:   () => new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x88ffff, emissiveIntensity: 1.0, roughness: 0.0,  metalness: 1.0, transparent: true, opacity: 0.85 }),
  accent:  () => new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 2.0, transparent: true, opacity: 0.9  }),
  aura:    () => new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.7  }),
  pants:   () => new THREE.MeshStandardMaterial({ color: 0x004466, emissive: 0x001122, emissiveIntensity: 0.15, roughness: 0.4, metalness: 0.7 }),
  boot:    () => new THREE.MeshStandardMaterial({ color: 0x001a33, emissive: 0x000811, emissiveIntensity: 0.1, roughness: 0.5, metalness: 0.6 }),
  antenna: () => new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 3.0, transparent: true, opacity: 0.9 }),
};

function mesh(geo, mat) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  return m;
}

function buildLeg(side) {
  // side: -1 = left, +1 = right
  const grp = new THREE.Group();
  grp.position.set(side * 0.22, 0.55, 0);

  // Thigh
  const thigh = mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.62, 10), MAT.pants());
  thigh.position.y = -0.31;
  grp.add(thigh);

  // Shin group (pivot at knee)
  const shinGrp = new THREE.Group();
  shinGrp.position.y = -0.62;
  grp.add(shinGrp);

  // Shin
  const shin = mesh(new THREE.CylinderGeometry(0.10, 0.09, 0.58, 10), MAT.pants());
  shin.position.y = -0.29;
  shinGrp.add(shin);

  // Boot
  const boot = mesh(new THREE.BoxGeometry(0.18, 0.14, 0.28), MAT.boot());
  boot.position.set(0, -0.62, 0.04);
  shinGrp.add(boot);

  // Knee accent dot
  const knee = mesh(new THREE.SphereGeometry(0.05, 8, 8), MAT.accent());
  knee.position.y = 0;
  shinGrp.add(knee);

  return { grp, shinGrp };
}

function buildArm(side) {
  // side: -1 = left, +1 = right
  const grp = new THREE.Group();
  grp.position.set(side * 0.44, 0.28, 0); // relative to body group

  // Upper arm (hangs from shoulder pivot)
  const upper = mesh(new THREE.CylinderGeometry(0.10, 0.09, 0.50, 10), MAT.body());
  upper.position.y = -0.25;
  grp.add(upper);

  // Elbow group (pivot at elbow)
  const foreGrp = new THREE.Group();
  foreGrp.position.y = -0.50;
  grp.add(foreGrp);

  // Forearm
  const fore = mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.44, 10), MAT.body());
  fore.position.y = -0.22;
  foreGrp.add(fore);

  // Hand
  const hand = mesh(new THREE.SphereGeometry(0.09, 10, 10), MAT.dark());
  hand.position.y = -0.46;
  foreGrp.add(hand);

  // Shoulder pad
  const pad = mesh(new THREE.SphereGeometry(0.12, 10, 10), MAT.dark());
  pad.scale.set(1.1, 0.7, 1);
  pad.position.y = -0.02;
  grp.add(pad);

  return { grp, foreGrp };
}

export function buildAvatar(scene, clickables) {
  const root = new THREE.Group();

  // ── Legs ─────────────────────────────────────────────────
  const leftLeg  = buildLeg(-1);
  const rightLeg = buildLeg( 1);
  root.add(leftLeg.grp, rightLeg.grp);

  // ── Body group (waist pivot) ──────────────────────────────
  const bodyGrp = new THREE.Group();
  bodyGrp.position.y = 0.55;
  root.add(bodyGrp);

  // Torso
  const torso = mesh(new THREE.CylinderGeometry(0.30, 0.25, 0.80, 14), MAT.body());
  torso.position.y = 0.40;
  torso.userData = { isAvatar: true };
  bodyGrp.add(torso);

  // Chest panel glow strip
  const strip = mesh(new THREE.BoxGeometry(0.18, 0.22, 0.05), MAT.accent());
  strip.position.set(0, 0.44, 0.29);
  bodyGrp.add(strip);

  // Chest side stripes
  [-0.22, 0.22].forEach(x => {
    const s = mesh(new THREE.BoxGeometry(0.05, 0.30, 0.04), MAT.accent());
    s.position.set(x, 0.44, 0.29);
    bodyGrp.add(s);
  });

  // Waist ring
  const waist = mesh(new THREE.TorusGeometry(0.28, 0.04, 8, 32), MAT.dark());
  waist.rotation.x = Math.PI / 2;
  waist.position.y = 0.02;
  bodyGrp.add(waist);

  // ── Arms ─────────────────────────────────────────────────
  const leftArm  = buildArm(-1);
  const rightArm = buildArm( 1);
  bodyGrp.add(leftArm.grp, rightArm.grp);

  // ── Neck ─────────────────────────────────────────────────
  const neck = mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.18, 10), MAT.dark());
  neck.position.y = 0.89;
  bodyGrp.add(neck);

  // ── Head group (pivot at neck top) ───────────────────────
  const headGrp = new THREE.Group();
  headGrp.position.y = 1.0;
  bodyGrp.add(headGrp);

  // Skull
  const skull = mesh(new THREE.SphereGeometry(0.26, 16, 16), MAT.head());
  skull.scale.y = 1.12;
  skull.userData = { isAvatar: true };
  headGrp.add(skull);

  // Visor (glowing face plate)
  const visor = mesh(new THREE.SphereGeometry(0.17, 12, 12), MAT.visor());
  visor.scale.set(1.35, 0.55, 0.65);
  visor.position.set(0, -0.02, 0.18);
  visor.userData = { isAvatar: true };
  headGrp.add(visor);

  // Helmet band
  const band = mesh(new THREE.TorusGeometry(0.265, 0.035, 6, 32), MAT.dark());
  band.position.y = 0.04;
  headGrp.add(band);

  // Antenna
  const antStick = mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 6), MAT.antenna());
  antStick.position.set(0.12, 0.32, 0);
  headGrp.add(antStick);
  const antTip = mesh(new THREE.SphereGeometry(0.035, 8, 8), MAT.antenna());
  antTip.position.set(0.12, 0.47, 0);
  headGrp.add(antTip);

  // ── Aura ring at feet ────────────────────────────────────
  const aura = mesh(
    new THREE.TorusGeometry(0.58, 0.055, 8, 36),
    MAT.aura()
  );
  aura.rotation.x = Math.PI / 2;
  aura.position.y  = 0.06;
  root.add(aura);

  scene.add(root);

  // Register clickable surfaces
  clickables.push(torso, skull, visor);

  return {
    root,
    bones: {
      bodyGrp,
      headGrp,
      leftLegGrp:  leftLeg.grp,
      rightLegGrp: rightLeg.grp,
      leftShinGrp: leftLeg.shinGrp,
      rightShinGrp:rightLeg.shinGrp,
      leftArmGrp:  leftArm.grp,
      rightArmGrp: rightArm.grp,
      leftForeGrp: leftArm.foreGrp,
      rightForeGrp:rightArm.foreGrp,
    },
    aura,
  };
}
