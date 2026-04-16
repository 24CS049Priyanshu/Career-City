/** scene.js — Scene, fog, and all lights */
export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x010a18);
  scene.fog = new THREE.FogExp2(0x010a18, 0.016);
  addLights(scene);
  return scene;
}

function addLights(scene) {
  scene.add(new THREE.AmbientLight(0x112244, 0.7));

  const sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(8, 24, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far  = 120;
  sun.shadow.camera.left = sun.shadow.camera.bottom = -60;
  sun.shadow.camera.right = sun.shadow.camera.top   =  60;
  scene.add(sun);

  // Per-zone coloured point lights
  const zoneLights = [
    { c: 0x00f0ff, x: -22, z: -10 },
    { c: 0xa855f7, x:  22, z: -10 },
    { c: 0xf0a500, x:   0, z: -28 },
    { c: 0x39ff14, x: -22, z:  12 },
    { c: 0xff3a5c, x:  22, z:  12 },
  ];
  zoneLights.forEach(({ c, x, z }) => {
    const pl = new THREE.PointLight(c, 2.8, 20);
    pl.position.set(x, 3.5, z);
    scene.add(pl);
  });

  // Central hub glow
  const hub = new THREE.PointLight(0x00c8ff, 1.5, 22);
  hub.position.set(0, 6, 0);
  scene.add(hub);
}
