/**
 * Lighting.jsx — Realistic PBR lighting (no neon, sun + sky approach)
 */
export default function Lighting() {
  return (
    <>
      {/* SKY: cool day sky ambient — replaces per-zone colored lights */}
      <hemisphereLight
        skyColor="#94aec8"
        groundColor="#2d2d2d"
        intensity={0.8}
      />

      {/* SUN: warm directional cast from upper-right */}
      <directionalLight
        position={[40, 65, 30]}
        intensity={2.4}
        color="#fff5e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={260}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
      />

      {/* FILL: cool bounce light from opposite side */}
      <directionalLight
        position={[-25, 25, -20]}
        intensity={0.45}
        color="#c0d0e8"
      />

      {/* DISTRICT accent lights: subtle, not neon — just enough colour */}
      {/* Skills — cool daylight */}
      <pointLight position={[-35, 12, 0]}  intensity={0.9}  color="#aec6cf" distance={40} />
      {/* Projects — warm afternoon */}
      <pointLight position={[35, 12, 0]}   intensity={0.9}  color="#d4b896" distance={40} />
      {/* Contact — neutral civic */}
      <pointLight position={[0, 12, -40]}  intensity={0.8}  color="#b8c4c0" distance={35} />
      {/* About/Plaza centre */}
      <pointLight position={[0, 15, 8]}    intensity={0.7}  color="#d0c8b8" distance={30} />
    </>
  );
}
