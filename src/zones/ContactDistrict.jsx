/**
 * ContactDistrict.jsx — Realistic civic centre / contact hub
 */
import { useRef }   from 'react';
import { useFrame } from '@react-three/fiber';
import { Text }     from '@react-three/drei';
import useStore     from '../store/useStore';
import { OWNER }    from '../utils/constants';

export default function ContactDistrict() {
  const flagRef = useRef();
  const setInfoPanel = useStore(s => s.setInfoPanel);
  const setAvatarTarget = useStore(s => s.setAvatarTarget);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (flagRef.current) {
      flagRef.current.rotation.z = Math.sin(t * 1.8) * 0.15;
    }
  });

  function open(e) {
    e.stopPropagation();
    setAvatarTarget([0, 0, -26]);
    setInfoPanel({ type:'contact' });
  }

  return (
    <group position={[0, 0, -40]}>
      {/* ── Civic plaza ground ── */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, 0.04, 0]} receiveShadow>
        <circleGeometry args={[18, 32]} />
        <meshStandardMaterial color="#3a3530" roughness={0.85} />
      </mesh>

      {/* ── Approach steps ── */}
      {[0,1,2].map(i => (
        <mesh key={i} position={[0, i*0.25+0.12, 14-i*1.2]} receiveShadow>
          <boxGeometry args={[14-i*1.5, 0.25, 1.3]} />
          <meshStandardMaterial color="#5a5550" roughness={0.8} />
        </mesh>
      ))}

      {/* ── Podium base ── */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 2.4, 18]} />
        <meshStandardMaterial color="#4a4540" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* ── Main building (red/brick civic) ── */}
      <mesh position={[0, 1.2+7, 0]} castShadow
        onPointerOver={()=>{ document.body.style.cursor='pointer'; }}
        onPointerOut={()=>{ document.body.style.cursor='crosshair'; }}
        onClick={open}
      >
        <boxGeometry args={[18, 14, 14]} />
        <meshStandardMaterial color="#6b4040" roughness={0.8} metalness={0.08} />
      </mesh>

      {/* Side wings */}
      {[-11, 11].map((x,i) => (
        <mesh key={i} position={[x, 1.2+4.5, 0]} castShadow>
          <boxGeometry args={[4, 9, 10]} />
          <meshStandardMaterial color="#604040" roughness={0.82} />
        </mesh>
      ))}

      {/* Columns */}
      {[-7,-3.5,0,3.5,7].map((x,i) => (
        <mesh key={i} position={[x, 1.2+7, 7.1]} castShadow>
          <cylinderGeometry args={[0.45, 0.52, 14, 10]} />
          <meshStandardMaterial color="#b8b0a0" roughness={0.75} metalness={0.05} />
        </mesh>
      ))}

      {/* Triangular pediment / gable */}
      <mesh position={[0, 1.2+15.5, 7.0]}>
        <coneGeometry args={[9.5, 3.5, 4]} />
        <meshStandardMaterial color="#5a4a40" roughness={0.82} />
      </mesh>

      {/* Dome */}
      <mesh position={[0, 1.2+16.5, 0]}>
        <sphereGeometry args={[4.5, 24, 14, 0, Math.PI*2, 0, Math.PI/2]} />
        <meshStandardMaterial color="#8c7865" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Dome drum */}
      <mesh position={[0, 1.2+15.5, 0]}>
        <cylinderGeometry args={[4.6, 4.6, 2.5, 18]} />
        <meshStandardMaterial color="#7a6a58" roughness={0.75} />
      </mesh>

      {/* Flagpole */}
      <mesh position={[0, 1.2+22, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 7.5, 6]} />
        <meshStandardMaterial color="#9a9a9a" metalness={0.75} roughness={0.3} />
      </mesh>
      {/* Flag */}
      <mesh ref={flagRef} position={[1.2, 1.2+24.5, 0]}>
        <boxGeometry args={[2.8, 1.5, 0.05]} />
        <meshStandardMaterial color="#c0392b" roughness={0.8} />
      </mesh>

      {/* Windows on facade — grid */}
      {Array.from({length:4}, (_,row) =>
        Array.from({length:5}, (_,col) => (
          <mesh key={`w${row}-${col}`} position={[-6+col*3, 1.2+3+row*3, 7.06]}>
            <boxGeometry args={[1.6, 1.8, 0.06]} />
            <meshStandardMaterial color="#88aabb" roughness={0.1} metalness={0.8} transparent opacity={0.72} />
          </mesh>
        ))
      )}

      {/* Name plate */}
      <mesh position={[0, 4.0, 7.4]}>
        <boxGeometry args={[10, 1.5, 0.15]} />
        <meshStandardMaterial color="#1a0a0a" roughness={0.9} />
      </mesh>
      <Text position={[0, 4.0, 7.5]} fontSize={0.65} color="#d8c0b0" anchorX="center">
        CONTACT CENTRE
      </Text>
      <Text position={[0, 2.8, 7.5]} fontSize={0.42} color="#c0a898" anchorX="center">
        {OWNER.email}
      </Text>

      {/* Street sign */}
      <Text position={[0, 25.5, 0]} fontSize={1.2} color="#d0c0b8" anchorX="center">
        📡 Contact Hub
      </Text>
    </group>
  );
}
