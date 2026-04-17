/**
 * CityMap.jsx — Assembles all city world elements + traffic + NPCs
 * Massive scale city background via InstancedMesh for zero lag.
 */
import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import Ground          from './Ground';
import Roads           from './Roads';
import SkillsDistrict  from '../zones/SkillsDistrict';
import ProjectDistrict from '../zones/ProjectDistrict';
import ContactDistrict from '../zones/ContactDistrict';
import NPCManager      from '../npc/NPCManager';
import Car             from '../vehicles/Car';
import { CAR_ROUTES }  from '../utils/paths';

const INSTANCE_COUNT = 300;
const DUMMY = new THREE.Object3D();

function InstancedCityBlocks() {
  const meshRef = useRef();
  const roofRef = useRef();

  const blocks = useMemo(() => {
    const data = [];
    // Generate massive outer ring of buildings, pushing them past the main districts
    for (let i = 0; i < INSTANCE_COUNT; i++) {
        // Distribute them well beyond distance 60 so they don't clip into main zones
        const radius = 65 + Math.random() * 120;
        const angle = Math.random() * Math.PI * 2;
        
        let x = Math.cos(angle) * radius;
        let z = Math.sin(angle) * radius;
        
        // Prevent them from spawning on the main central axes 
        if (Math.abs(x) < 12) x += (x > 0 ? 15 : -15);
        if (Math.abs(z) < 12) z += (z > 0 ? 15 : -15);

        const w = 5 + Math.random() * 8;
        const d = 5 + Math.random() * 8;
        const h = 10 + Math.random() * 30;
        data.push({ x, z, w, d, h });
    }
    return data;
  }, []);

  useEffect(() => {
     if (!meshRef.current || !roofRef.current) return;
     blocks.forEach((b, i) => {
        // building body
        DUMMY.position.set(b.x, b.h/2, b.z);
        DUMMY.scale.set(b.w, b.h, b.d);
        DUMMY.updateMatrix();
        meshRef.current.setMatrixAt(i, DUMMY.matrix);
        // color variation: nice corporate blue/grey tones
        const c = new THREE.Color().setHSL(0.6, 0.1, 0.15 + Math.random()*0.15);
        meshRef.current.setColorAt(i, c);

        // roof line
        DUMMY.position.set(b.x, b.h + 0.22, b.z);
        DUMMY.scale.set(b.w + 0.3, 0.44, b.d + 0.3);
        DUMMY.updateMatrix();
        roofRef.current.setMatrixAt(i, DUMMY.matrix);
     });
     meshRef.current.instanceMatrix.needsUpdate = true;
     if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
     roofRef.current.instanceMatrix.needsUpdate = true;
  }, [blocks]);

  return (
    <group>
      <instancedMesh ref={meshRef} args={[null, null, INSTANCE_COUNT]} castShadow receiveShadow>
         <boxGeometry args={[1,1,1]} />
         <meshStandardMaterial roughness={0.8} metalness={0.1} />
      </instancedMesh>
      <instancedMesh ref={roofRef} args={[null, null, INSTANCE_COUNT]} castShadow>
         <boxGeometry args={[1,1,1]} />
         <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </instancedMesh>
    </group>
  );
}

// Limit traffic to avoid heavy updates per frame
function TrafficLayer() {
  const routes = CAR_ROUTES.map(r => [
    { ...r, startOffset: 0 },
    { ...r, startOffset: Math.floor(r.path.length * 0.5) },
  ]).flat().slice(0, 6); 

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
      <fog attach="fog" args={['#8898a8', 50, 180]} />
      <Ground />
      <Roads />
      <SkillsDistrict />
      <ProjectDistrict />
      <ContactDistrict />
      <NPCManager />
      <TrafficLayer />
      <InstancedCityBlocks />
    </>
  );
}

