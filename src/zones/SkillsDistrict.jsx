/**
 * SkillsDistrict.jsx — Realistic office park for skills
 */
import SkillBuilding from '../buildings/SkillBuilding';
import { SKILLS }   from '../utils/constants';
import { Text }     from '@react-three/drei';

const OFFSETS = [
  [-6, 0, -6], [0, 0, -6], [6, 0, -6],
  [-6, 0,  4], [0, 0,  4], [6, 0,  4],
];

export default function SkillsDistrict() {
  return (
    <group position={[-35, 0, 0]}>
      {/* District street sign */}
      <group position={[0, 0, -16]}>
        <mesh position={[0, 4, 0]}>
          <boxGeometry args={[18, 2.4, 0.3]} />
          <meshStandardMaterial color="#1e2530" roughness={0.8} />
        </mesh>
        <mesh position={[0, 4.05, 0.16]}>
          <boxGeometry args={[17, 1.8, 0.06]} />
          <meshStandardMaterial color="#2a3a50" emissive="#2a3a50" emissiveIntensity={0.2} />
        </mesh>
        <Text position={[0, 4.1, 0.22]} fontSize={0.9} color="#a8c4e0" anchorX="center" fontWeight="bold">
          SKILLS DISTRICT
        </Text>
        {/* Sign posts */}
        {[-7.5, 7.5].map((x,i) => (
          <mesh key={i} position={[x, 2, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 8, 7]} />
            <meshStandardMaterial color="#5a5a5a" metalness={0.5} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Skill office towers */}
      {SKILLS.map((skill, i) => (
        <SkillBuilding
          key={skill.name}
          skill={skill}
          position={OFFSETS[i] || [0,0,0]}
          index={i}
          approachTarget={[
            -35 + (OFFSETS[i]?.[0] ?? 0),
            0,
            (OFFSETS[i]?.[2] ?? 0) + 8,
          ]}
        />
      ))}

      {/* District interior road */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, 0.03, -1]}>
        <planeGeometry args={[3, 22]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.92} />
      </mesh>

      {/* Small park elements */}
      {/* Trees (simple cones) */}
      {[[-10, 0, -12],[10, 0, -12],[-10, 0, 10],[10, 0, 10]].map(([tx,ty,tz], i) => (
        <group key={`tr${i}`} position={[tx, ty, tz]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 3, 7]} />
            <meshStandardMaterial color="#5a4030" roughness={0.95} />
          </mesh>
          <mesh position={[0, 3.8, 0]}>
            <coneGeometry args={[1.8, 4.5, 8]} />
            <meshStandardMaterial color="#2d5a30" roughness={0.95} />
          </mesh>
          <mesh position={[0, 5.5, 0]}>
            <coneGeometry args={[1.2, 3.5, 8]} />
            <meshStandardMaterial color="#365c38" roughness={0.95} />
          </mesh>
          <mesh position={[0, 6.8, 0]}>
            <coneGeometry args={[0.7, 2.5, 8]} />
            <meshStandardMaterial color="#3d6640" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
