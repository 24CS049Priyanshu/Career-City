/**
 * Roads.jsx — Realistic road network with lane markings and street furniture
 */
export default function Roads() {
  return (
    <group position={[0, 0.04, 0]}>
      {/* E-W main road surface */}
      <mesh rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[200, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.92} />
      </mesh>

      {/* N-S main road surface */}
      <mesh rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[12, 200]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.92} />
      </mesh>

      {/* ── Lane markings (white dashes) E-W ── */}
      {Array.from({length:28}, (_,i) => i*7 - 95).map((x,i) => (
        <mesh key={`ew${i}`} rotation={[-Math.PI/2,0,0]} position={[x, 0.002, 0]}>
          <planeGeometry args={[4.5, 0.2]} />
          <meshStandardMaterial color="#e0e0d0" roughness={0.8} />
        </mesh>
      ))}

      {/* Center double yellow E-W */}
      {[-0.18, 0.18].map((z,i) => (
        <mesh key={`cy_ew${i}`} rotation={[-Math.PI/2,0,0]} position={[0, 0.003, z]}>
          <planeGeometry args={[200, 0.12]} />
          <meshStandardMaterial color="#e8c030" roughness={0.8} />
        </mesh>
      ))}

      {/* ── Lane markings N-S ── */}
      {Array.from({length:28}, (_,i) => i*7 - 95).map((z,i) => (
        <mesh key={`ns${i}`} rotation={[-Math.PI/2,0,0]} position={[0, 0.002, z]}>
          <planeGeometry args={[0.2, 4.5]} />
          <meshStandardMaterial color="#e0e0d0" roughness={0.8} />
        </mesh>
      ))}

      {/* Center double yellow N-S */}
      {[-0.18, 0.18].map((x,i) => (
        <mesh key={`cy_ns${i}`} rotation={[-Math.PI/2,0,0]} position={[x, 0.003, 0]}>
          <planeGeometry args={[0.12, 200]} />
          <meshStandardMaterial color="#e8c030" roughness={0.8} />
        </mesh>
      ))}

      {/* Intersection box (slightly different shade) */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#191919" roughness={0.93} />
      </mesh>

      {/* Crosswalk stripes N-S */}
      {Array.from({length:5}, (_,i) => -2 + i * 1).map((x,i) => (
        <mesh key={`cw${i}`} rotation={[-Math.PI/2,0,0]} position={[x, 0.003, 13]}>
          <planeGeometry args={[0.8, 3.5]} />
          <meshStandardMaterial color="#d8d8c8" roughness={0.8} />
        </mesh>
      ))}

      {/* ── Street lights ── */}
      {[
        [-20,5.5],[-20,-5.5],[20,5.5],[20,-5.5],
        [-38,5.5],[-38,-5.5],[38,5.5],[38,-5.5],
        [-56,5.5],[-56,-5.5],[56,5.5],[56,-5.5],
        [5.5,-18],[5.5,-36],[5.5,-56],[-5.5,-18],[-5.5,-36],[-5.5,-56],
        [5.5, 22],[5.5, 36],[-5.5, 22],[-5.5, 36],
      ].map(([x, z], i) => (
        <group key={`sl${i}`} position={[x, 0, z]}>
          {/* Pole */}
          <mesh position={[0, 3.8, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 7.6, 7]} />
            <meshStandardMaterial color="#5a5a5a" metalness={0.5} roughness={0.6} />
          </mesh>
          {/* Arm */}
          <mesh position={[0, 7.7, 0.6]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1.4, 6]} />
            <meshStandardMaterial color="#5a5a5a" metalness={0.5} roughness={0.6} />
          </mesh>
          {/* Light head */}
          <mesh position={[0, 7.6, 1.2]}>
            <boxGeometry args={[0.55, 0.2, 0.85]} />
            <meshStandardMaterial color="#333" metalness={0.4} />
          </mesh>
          <mesh position={[0, 7.48, 1.2]}>
            <boxGeometry args={[0.42, 0.06, 0.72]} />
            <meshStandardMaterial color="#fffde0" emissive="#fffcc0" emissiveIntensity={1.2} />
          </mesh>
          <pointLight position={[0, 7.2, 1.2]} intensity={1.4} color="#ffe8a0" distance={16} />
        </group>
      ))}
    </group>
  );
}
