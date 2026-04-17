import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import Ground from './Ground';
import Roads from './Roads';
import SkillsDistrict from '../zones/SkillsDistrict';
import ProjectDistrict from '../zones/ProjectDistrict';
import ContactDistrict from '../zones/ContactDistrict';
import NPCManager from '../npc/NPCManager';
import Car from '../vehicles/Car';
import { CAR_ROUTES } from '../utils/paths';

// ── Instanced City Blocks for Extreme Performance ──
// This uses a single Draw Call to render hundreds of background buildings.
function InstancedSkyline({ count = 150, limit = 200 }) {
  const meshRef = useRef();
  const roofRef = useRef();
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current || !roofRef.current) return;

    let idx = 0;
    // We want a ring of buildings just outside the main playable area (radius ~60)
    for (let i = 0; i < count; i++) {
        // Randomly place them between distance 60 and 'limit'
        let dist = 60 + Math.random() * (limit - 60);
        let angle = Math.random() * Math.PI * 2;
        
        let cx = Math.cos(angle) * dist;
        let cz = Math.sin(angle) * dist;

        let w = 5 + Math.random() * 8;
        let d = 5 + Math.random() * 8;
        let h = 8 + Math.random() * 25; // Random skyline heights

        // Base Building
        dummy.position.set(cx, h / 2, cz);
        dummy.scale.set(w, h, d);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(idx, dummy.matrix);
        
        // Randomize color slightly per building
        const r = 0.2 + Math.random() * 0.1;
        const col = new THREE.Color(r, r + 0.05, r + 0.1);
        meshRef.current.setColorAt(idx, col);

        // Roof Line
        dummy.position.set(cx, h + 0.22, cz);
        dummy.scale.set(w + 0.3, 0.44, d + 0.3);
        dummy.updateMatrix();
        roofRef.current.setMatrixAt(idx, dummy.matrix);

        idx++;
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    roofRef.current.instanceMatrix.needsUpdate = true;
  }, [count, limit, dummy]);

  return (
    <group>
      <instancedMesh ref={meshRef} args={[null, null, count]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.82} metalness={0.08} />
      </instancedMesh>
      
      <instancedMesh ref={roofRef} args={[null, null, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.85} />
      </instancedMesh>
    </group>
  );
}

// Ensure cars don't spawn 100 times to kill performance, restrict to 8
function TrafficLayer() {
  const routes = CAR_ROUTES.map(r => [
    { ...r, startOffset: 0 },
    { ...r, startOffset: Math.floor(r.path.length * 0.5) },
  ]).flat().slice(0, 8); 

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
      <fog attach="fog" args={['#8898a8', 80, 250]} />

      <Ground />
      <Roads />
      <SkillsDistrict />
      <ProjectDistrict />
      <ContactDistrict />
      <NPCManager />
      <TrafficLayer />

      <InstancedSkyline count={250} limit={240} />
    </>
  );
}
