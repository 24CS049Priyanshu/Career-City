import { useMemo } from 'react';
import { useFBX } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

// Cache to ensure we only rename animations
// on the first load of these references.
let isAnimationSetup = false;

export default function useCharacterLoader({ customColor, isNPC } = {}) {
  // Load models and animations
  // Drei caches these based on the URL, so it only happens once globally.
  const fbx = useFBX('/character/Ch09_nonPBR.fbx');
  const idleFbx = useFBX('/character/ginga sideways 2.fbx');
  const walkFbx = useFBX('/character/ginga forward.fbx');
  const greetFbx = useFBX('/character/esquiva 1.fbx'); // using esquiva as a greeting movement
  const arriveFbx = useFBX('/character/macaco side.fbx'); // macaco side looks cool for arriving at a district!

  // Deep clone the skeleton so each character can animate independently.
  const clone = useMemo(() => {
    const c = SkeletonUtils.clone(fbx);
    // Optionally apply custom colours if it's an NPC
    // Ch09 material logic handling:
    c.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (customColor) {
           // Basic tint overlay for NPC distinction
           const mat = node.material.clone();
           mat.color = new THREE.Color(customColor);
           node.material = mat;
        }
      }
    });

    // Scale correction: if the FBX is massive/tiny we scale it here.
    // Standard mixamo scales need to be ~0.01
    c.scale.set(0.012, 0.012, 0.012);
    return c;
  }, [fbx, customColor]);

  const animations = useMemo(() => {
    if (!isAnimationSetup) {
      if (idleFbx.animations[0])   idleFbx.animations[0].name = 'IDLE';
      if (walkFbx.animations[0])   walkFbx.animations[0].name = 'WALK';
      if (greetFbx.animations[0])  greetFbx.animations[0].name = 'GREET';
      if (arriveFbx.animations[0]) arriveFbx.animations[0].name = 'ARRIVE';
      isAnimationSetup = true;
    }
    return [
      idleFbx.animations[0],
      walkFbx.animations[0],
      greetFbx.animations[0],
      arriveFbx.animations[0],
    ].filter(Boolean); // Filter out any undefined just in case
  }, [idleFbx, walkFbx, greetFbx, arriveFbx]);

  return { scene: clone, animations };
}
