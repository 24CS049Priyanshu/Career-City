/**
 * ProjectBuilding.jsx — Realistic landmark building for each project
 * Different architectural style per building
 */
import { useState } from 'react';
import { Text }             from '@react-three/drei';
import useStore             from '../store/useStore';

export default function ProjectBuilding({ project, position, styleIdx = 0, approachTarget }) {
  const [hovered, setHovered] = useState(false);
  const setInfoPanel = useStore(s => s.setInfoPanel);
  const setAvatarTarget = useStore(s => s.setAvatarTarget);

  const styles = [
    { bodyColor:'#3d4f5a', glassColor:'#506878', podiumColor:'#393939', roofColor:'#2a3440', h:14 },
    { bodyColor:'#4a5545', glassColor:'#608060', podiumColor:'#3d3d3d', roofColor:'#2a3028', h:11 },
    { bodyColor:'#5a4838', glassColor:'#786050', podiumColor:'#403530', roofColor:'#382820', h:13 },
    { bodyColor:'#3a3a5a', glassColor:'#505878', podiumColor:'#302838', roofColor:'#202030', h:12 },
  ];
  const s = styles[styleIdx % styles.length];

  function handleClick(e) {
    e.stopPropagation();
    setAvatarTarget(approachTarget ?? [position[0], 0, position[2] + 9]);
    setInfoPanel({ type:'project', project });
  }

  const W = 7, D = 7;
  const podH = 4;

  return (
    <group position={position}>
      {/* Base plinth */}
      <mesh position={[0, podH/2, 0]} castShadow receiveShadow
        onPointerOver={e=>{e.stopPropagation();setHovered(true);document.body.style.cursor='pointer';}}
        onPointerOut={()=>{setHovered(false);document.body.style.cursor='crosshair';}}
        onClick={handleClick}
      >
        <boxGeometry args={[W+2, podH, D+2]} />
        <meshStandardMaterial color={s.podiumColor} roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Main tower */}
      <mesh position={[0, podH + s.h/2, 0]} castShadow
        onPointerOver={e=>{e.stopPropagation();setHovered(true);document.body.style.cursor='pointer';}}
        onPointerOut={()=>{setHovered(false);document.body.style.cursor='crosshair';}}
        onClick={handleClick}
      >
        <boxGeometry args={[W, s.h, D]} />
        <meshStandardMaterial color={s.glassColor} roughness={0.14} metalness={0.7} transparent opacity={0.94} />
      </mesh>

      {/* Floor lines */}
      {Array.from({length: Math.floor(s.h/1.4)}, (_,i) => (
        <mesh key={i} position={[0, podH+i*1.4+0.7, 0]}>
          <boxGeometry args={[W+0.02, 0.07, D+0.02]} />
          <meshStandardMaterial color="#1e2830" roughness={0.6} metalness={0.5} />
        </mesh>
      ))}

      {/* Vertical fins — front face */}
      {[-2.3, -0.8, 0.8, 2.3].map((x,i) => (
        <mesh key={`vf${i}`} position={[x, podH+s.h/2, D/2+0.25]}>
          <boxGeometry args={[0.12, s.h+0.5, 0.4]} />
          <meshStandardMaterial color={s.bodyColor} roughness={0.8} metalness={0.2} />
        </mesh>
      ))}

      {/* Company sign / billboard on front */}
      <mesh position={[0, podH+s.h*0.6, D/2+0.12]}>
        <boxGeometry args={[5.5, 2.2, 0.1]} />
        <meshStandardMaterial color="#0a0c10" roughness={0.9} />
      </mesh>
      <mesh position={[0, podH+s.h*0.6, D/2+0.18]}>
        <boxGeometry args={[4.8, 1.6, 0.02]} />
        <meshStandardMaterial color={project.color} emissive={project.color} emissiveIntensity={0.25} roughness={0.5} />
      </mesh>

      {/* Roof cap */}
      <mesh position={[0, podH+s.h+0.5, 0]}>
        <boxGeometry args={[W+0.5, 1.0, D+0.5]} />
        <meshStandardMaterial color={s.roofColor} roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Antennae / comms */}
      <mesh position={[2, podH+s.h+2.2, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 2.4, 6]} />
        <meshStandardMaterial color="#5a5a5a" metalness={0.7} roughness={0.4} />
      </mesh>
      <pointLight position={[2, podH+s.h+3.5, 0]} intensity={0.8} color="#ff3300" distance={6} />

      {/* Hover ring */}
      {hovered && (
        <mesh rotation={[Math.PI/2,0,0]} position={[0, 0.06, 0]}>
          <torusGeometry args={[6, 0.1, 6, 36]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.4} transparent opacity={0.4} />
        </mesh>
      )}

      {/* Name label */}
      <Text position={[0, podH+s.h+4, 0]} fontSize={0.9} color="#c8d8e8" anchorX="center">
        {project.name}
      </Text>
    </group>
  );
}
