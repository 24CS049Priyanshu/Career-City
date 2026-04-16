/**
 * CityMap.jsx — Assembles all city world elements + traffic + NPCs
 */
import Ground          from './Ground';
import Roads           from './Roads';
import SkillsDistrict  from '../zones/SkillsDistrict';
import ProjectDistrict from '../zones/ProjectDistrict';
import ContactDistrict from '../zones/ContactDistrict';
import NPCManager      from '../npc/NPCManager';
import Car             from '../vehicles/Car';
import { CAR_ROUTES }  from '../utils/paths';

// Filler buildings for the rest of the city (random blocks)
function CityBlock({ position, width=5, depth=5, height=8, color='#404040' }) {
  return (
    <group position={position}>
      <mesh position={[0, height/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.82} metalness={0.08} />
      </mesh>
      {/* Roof line */}
      <mesh position={[0, height+0.22, 0]}>
        <boxGeometry args={[width+0.3, 0.44, depth+0.3]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.85} />
      </mesh>
    </group>
  );
}

const FILLER_BUILDINGS = [
  // North cityscape blocks
  { pos:[18, 0,-20], w:6, d:6, h:10, c:'#505050' },
  { pos:[-18,0,-20], w:7, d:5, h:12, c:'#3d4a50' },
  { pos:[25, 0,-32], w:5, d:7, h:8,  c:'#504040' },
  { pos:[-25,0,-32], w:6, d:6, h:15, c:'#484060' },
  { pos:[18, 0, 24], w:5, d:5, h:7,  c:'#404840' },
  { pos:[-18,0, 24], w:8, d:5, h:9,  c:'#505040' },
  { pos:[25, 0, 38], w:6, d:6, h:11, c:'#403840' },
  { pos:[-25,0, 38], w:5, d:8, h:6,  c:'#485050' },
  // Far corners
  { pos:[-55,0,-12], w:8, d:8, h:16, c:'#404858' },
  { pos:[-55,0, 12], w:7, d:7, h:10, c:'#3a4848' },
  { pos:[ 55,0,-12], w:8, d:8, h:13, c:'#485040' },
  { pos:[ 55,0, 12], w:7, d:7, h:9,  c:'#404040' },
];

// 3 offset instances per E-W route (distribute cars on road)
function TrafficLayer() {
  const routes = CAR_ROUTES.map(r => [
    { ...r, startOffset: 0 },
    { ...r, startOffset: Math.floor(r.path.length * 0.5) },
  ]).flat().slice(0, 8); // cap traffic for smoother frame rate

  return (
    <>
      {routes.map((route, i) => (
        <Car key={i} route={route} startOffset={route.startOffset} />
      ))}
    </>
  );
}

export default function CityMap() {
  return (
    <>
      {/* Subtle grey mist towards the horizon (not thick neon fog) */}
      <fog attach="fog" args={['#8898a8', 90, 220]} />

      {/* Sky colour — blue-gray day sky (set in App.jsx Canvas gl on bg) */}

      <Ground />
      <Roads />
      <SkillsDistrict />
      <ProjectDistrict />
      <ContactDistrict />
      <NPCManager />
      <TrafficLayer />

      {/* Filler city blocks */}
      {FILLER_BUILDINGS.map((b, i) => (
        <CityBlock key={i} position={b.pos} width={b.w} depth={b.d} height={b.h} color={b.c} />
      ))}
    </>
  );
}
