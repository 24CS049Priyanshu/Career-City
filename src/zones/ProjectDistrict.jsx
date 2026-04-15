/**
 * ProjectDistrict.jsx — Realistic project arena district
 */
import ProjectBuilding from '../buildings/ProjectBuilding';
import { PROJECTS }    from '../utils/constants';
import { Text }        from '@react-three/drei';

const OFFSETS = [[-7,0,-7],[7,0,-7],[-7,0,7],[7,0,7]];

export default function ProjectDistrict() {
  return (
    <group position={[35, 0, 0]}>
      {/* District sign */}
      <group position={[0, 0, -17]}>
        <mesh position={[0, 4, 0]}>
          <boxGeometry args={[18, 2.4, 0.3]} />
          <meshStandardMaterial color="#24201a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 4.05, 0.16]}>
          <boxGeometry args={[17, 1.8, 0.06]} />
          <meshStandardMaterial color="#3a3020" emissive="#3a3020" emissiveIntensity={0.15} />
        </mesh>
        <Text position={[0, 4.1, 0.22]} fontSize={0.9} color="#d4c890" anchorX="center">
          PROJECT ARENA
        </Text>
        {[-7.5, 7.5].map((x,i) => (
          <mesh key={i} position={[x, 2, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 8, 7]} />
            <meshStandardMaterial color="#5a5a5a" metalness={0.5} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Project landmark buildings */}
      {PROJECTS.map((proj, i) => (
        <ProjectBuilding
          key={proj.id}
          project={proj}
          position={OFFSETS[i]}
          styleIdx={i}
          approachTarget={[
            35 + OFFSETS[i][0],
            0,
            OFFSETS[i][2] + 9,
          ]}
        />
      ))}

      {/* Central courtyard */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[6, 24]} />
        <meshStandardMaterial color="#3a3530" roughness={0.85} />
      </mesh>
      {/* Fountain pool */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[2.5, 20]} />
        <meshStandardMaterial color="#1a3080" roughness={0.1} metalness={0.6} transparent opacity={0.7} />
      </mesh>
      {/* Fountain pillar */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 2.4, 8]} />
        <meshStandardMaterial color="#8a8a8a" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Trees */}
      {[[-18,0,-14],[18,0,-14],[-18,0,14],[18,0,14]].map(([tx,ty,tz], i) => (
        <group key={`tr${i}`} position={[tx, ty, tz]}>
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.15, 0.22, 3.6, 7]} />
            <meshStandardMaterial color="#4a3020" roughness={0.95} />
          </mesh>
          <mesh position={[0, 5.5, 0]}>
            <sphereGeometry args={[2.5, 10, 8]} />
            <meshStandardMaterial color="#2d5028" roughness={0.95} />
          </mesh>
          <mesh position={[0, 7.5, 0]}>
            <sphereGeometry args={[1.8, 10, 8]} />
            <meshStandardMaterial color="#38603a" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
