/**
 * Ground.jsx — Realistic city ground: asphalt + sidewalks + zone pads
 */
export default function Ground() {
  return (
    <group>
      {/* Base asphalt ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Sidewalk strips (lighter concrete) — E-W */}
      {[-14, 14].map((z, i) => (
        <mesh key={`sw-ew${i}`} rotation={[-Math.PI/2,0,0]} position={[0, 0.025, z]}>
          <planeGeometry args={[200, 3.5]} />
          <meshStandardMaterial color="#4a4440" roughness={0.9} />
        </mesh>
      ))}

      {/* Sidewalk strips — N-S */}
      {[-14, 14].map((x, i) => (
        <mesh key={`sw-ns${i}`} rotation={[-Math.PI/2,0,0]} position={[x, 0.025, 0]}>
          <planeGeometry args={[3.5, 200]} />
          <meshStandardMaterial color="#4a4440" roughness={0.9} />
        </mesh>
      ))}

      {/* Curb lines (raised slightly) — edging the sidewalks */}
      {[12.25, -12.25].map((z, i) => (
        <mesh key={`curb${i}`} position={[0, 0.05, z]}>
          <boxGeometry args={[200, 0.1, 0.25]} />
          <meshStandardMaterial color="#555" roughness={0.85} />
        </mesh>
      ))}

      {/* District pads: slightly lighter asphalt to mark the zones */}
      {[
        { pos:[-35, 0, 0], sz:[38, 38], color:'#313131' },
        { pos:[ 35, 0, 0], sz:[38, 38], color:'#2f2f2f' },
        { pos:[ 0, 0,-40], sz:[32, 32], color:'#313030' },
        { pos:[ 0, 0,  8], sz:[26, 26], color:'#303030' },
      ].map(({ pos, sz, color }, i) => (
        <mesh key={`pad${i}`} rotation={[-Math.PI/2,0,0]} position={[pos[0], 0.022, pos[2]]} receiveShadow>
          <planeGeometry args={sz} />
          <meshStandardMaterial color={color} roughness={0.92} />
        </mesh>
      ))}

      {/* Central plaza: stone/concrete tile look */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, 0.03, 8]}>
        <circleGeometry args={[11, 32]} />
        <meshStandardMaterial color="#3d3830" roughness={0.85} metalness={0.05} />
      </mesh>
    </group>
  );
}
