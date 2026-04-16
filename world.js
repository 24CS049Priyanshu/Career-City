export const zones = [
  {
    name: "About Me",
    position: { x: 0, z: -15 },
    color: 0x3498db,
    content: "Hi, I'm Priyanshu...\nComputer Science student..."
  },
  {
    name: "Skills",
    position: { x: 15, z: 0 },
    color: 0x2ecc71,
    content: "C, C++, JavaScript, React..."
  },
  {
    name: "Projects",
    position: { x: -15, z: 0 },
    color: 0xe67e22,
    content: "ESP32 Attendance System\nReWear Project..."
  },
  {
    name: "Achievements",
    position: { x: 0, z: 15 },
    color: 0x9b59b6,
    content: "Hackathons, Certifications..."
  },
  {
    name: "Contact",
    position: { x: 25, z: 15 },
    color: 0xe74c3c,
    content: "Email: ...\nGitHub: ..."
  }
];

export function createCity(scene) {
  const buildings = [];

  zones.forEach(zone => {
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(5, 5, 5),
      new THREE.MeshBasicMaterial({ color: zone.color })
    );

    building.position.set(zone.position.x, 2.5, zone.position.z);
    scene.add(building);
    buildings.push(building);
  });

  return buildings;
}
