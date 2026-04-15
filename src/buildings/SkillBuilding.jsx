/**
 * SkillBuilding.jsx — Realistic office tower representing a skill
 * Architectural style: glass curtain wall + concrete podium
 */
import { useState } from 'react';
import { Text }             from '@react-three/drei';
import useStore             from '../store/useStore';

// Architectural style variants
const STYLES = [
  { facade:'#4a6580', glass:'#6a8ca4', podium:'#5a5a5a' },  // blue-gray glass tower
  { facade:'#526358', glass:'#7a9870', podium:'#4d5450' },  // green office
  { facade:'#6b5f50', glass:'#9e8060', podium:'#5a5040' },  // warm concrete
  { facade:'#504870', glass:'#7068a0', podium:'#454060' },  // slate violet
  { facade:'#3d5c70', glass:'#5a85a0', podium:'#3a4a55' },  // steel blue
  { facade:'#5a4848', glass:'#886868', podium:'#484040' },  // brick-ish
];

export default function SkillBuilding({ skill, position, index, approachTarget }) {
  const [hovered, setHovered] = useState(false);
  const setInfoPanel = useStore(s => s.setInfoPanel);
  const setAvatarTarget = useStore(s => s.setAvatarTarget);
  const style = STYLES[index % STYLES.length];

  // floors: proportional to skill level (8–18 floors)
  const floors = Math.round(skill.level / 100 * 10 + 8);
  const podiumH = 3.6;          // ~2 floors concrete podium
  const floorH  = 1.4;          // height per floor
  const towerH  = floors * floorH;
  const width   = 5.5;
  const depth   = 5.5;

  function handleClick(e) {
    e.stopPropagation();
    // Walk avatar to the front side of this building before opening details.
    setAvatarTarget(approachTarget ?? [position[0], 0, position[2] + 8]);
    setInfoPanel({ type:'skill', title:skill.name, level:skill.level, color:skill.color });
  }

  return (
    <group position={position}>
      {/* Concrete podium base */}
      <mesh position={[0, podiumH/2, 0]} castShadow receiveShadow
        onPointerOver={e=>{ e.stopPropagation(); setHovered(true); document.body.style.cursor='pointer'; }}
        onPointerOut={()=>{ setHovered(false); document.body.style.cursor='crosshair'; }}
        onClick={handleClick}
      >
        <boxGeometry args={[width+1.2, podiumH, depth+1.2]} />
        <meshStandardMaterial color={style.podium} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Main glass tower */}
      <mesh position={[0, podiumH + towerH/2, 0]} castShadow
        onPointerOver={e=>{ e.stopPropagation(); setHovered(true); document.body.style.cursor='pointer'; }}
        onPointerOut={()=>{ setHovered(false); document.body.style.cursor='crosshair'; }}
        onClick={handleClick}
      >
        <boxGeometry args={[width, towerH, depth]} />
        <meshStandardMaterial color={style.glass} roughness={0.12} metalness={0.72} transparent opacity={0.92} />
      </mesh>

      {/* Window grid (horizontal floor lines) */}
      {Array.from({length:floors}, (_,i) => (
        <mesh key={`fl${i}`} position={[0, podiumH + i*floorH + floorH*0.5, 0]}>
          <boxGeometry args={[width+0.02, 0.06, depth+0.02]} />
          <meshStandardMaterial color="#2a3540" roughness={0.6} metalness={0.4} />
        </mesh>
      ))}

      {/* Vertical window dividers — front & back */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <mesh key={`vd${i}`} position={[x, podiumH + towerH/2, depth/2+0.01]}>
          <boxGeometry args={[0.06, towerH, 0.04]} />
          <meshStandardMaterial color="#2a3540" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* Roof mechanical floor */}
      <mesh position={[0, podiumH+towerH+0.4, 0]}>
        <boxGeometry args={[width, 0.8, depth]} />
        <meshStandardMaterial color={style.podium} roughness={0.85} />
      </mesh>

      {/* Rooftop hvac units */}
      {[[-1,0,-1],[1,0,-1],[-1,0,1],[1,0,1]].map(([rx,,rz],i)=>(
        <mesh key={`ac${i}`} position={[rx, podiumH+towerH+1.0, rz]}>
          <boxGeometry args={[1.2, 0.8, 0.9]} />
          <meshStandardMaterial color="#484848" roughness={0.9} />
        </mesh>
      ))}

      {/* Skill level bar on podium face */}
      <mesh position={[0, 1.2, depth/2+0.62]}>
        <boxGeometry args={[4.6, 0.28, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      <mesh position={[-(4.6*(1-skill.level/100))/2, 1.2, depth/2+0.63]}>
        <boxGeometry args={[4.6 * skill.level/100, 0.25, 0.08]} />
        <meshStandardMaterial color={skill.color} emissive={skill.color} emissiveIntensity={0.5} />
      </mesh>

      {/* Hover outline ring */}
      {hovered && (
        <mesh rotation={[Math.PI/2,0,0]} position={[0,0.05,0]}>
          <torusGeometry args={[5, 0.1, 6, 36]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} transparent opacity={0.5}/>
        </mesh>
      )}

      {/* Name label */}
      <Text position={[0, podiumH+towerH+2.5, 0]} fontSize={0.75} color="#d8e4f0" anchorX="center">
        {skill.name}
      </Text>
    </group>
  );
}
