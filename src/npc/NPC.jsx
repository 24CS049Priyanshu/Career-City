import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import useCharacterLoader from '../hooks/useCharacterLoader';

const NPC_SPEED = 1.6; // slightly slower walking speed for chill vibe

export default function NPC({ path, startOffset = 0, clothingColor = '#2e4060', onInteract }) {
  const rootRef = useRef();
  
  // Use shared heavily cached FBX instances
  const { scene, animations } = useCharacterLoader({ customColor: clothingColor, isNPC: true });
  const { actions, names } = useAnimations(animations, rootRef);

  // Generate a Spline curve out of the array of waypoints for ultra-smooth cornering
  const splineCurve = useMemo(() => {
    const vectors = path.map(p => new THREE.Vector3(p[0], 0, p[2]));
    // Close the loop if the last point touches the first point (it usually does for NPC routes)
    const curve = new THREE.CatmullRomCurve3(vectors, true);
    curve.tension = 0.5; // smoother corners
    return curve;
  }, [path]);

  // Track the fractional progress [0, 1] along the full curve
  const progressRef = useRef(startOffset % 1.0);
  const _tangent = useMemo(() => new THREE.Vector3(), []);
  
  useEffect(() => {
    if (names.length) {
      const walkAct = actions['WALK'];
      if (walkAct) walkAct.reset().play();
    }
  }, [actions, names]);

  useFrame((_, dt) => {
    const g = rootRef.current;
    if (!g) return;
    const dtC = Math.min(dt, 0.05);

    // To prevent sudden jarring fast walks on small sub-sections,
    // we convert NPC_SPEED into a raw units distance, then calculate what 
    // fraction of the total curve length that represents.
    const curveLength = splineCurve.getLength();
    const progressDelta = (NPC_SPEED * dtC) / curveLength;
    
    progressRef.current = (progressRef.current + progressDelta) % 1.0;
    
    // Get absolute exact position on the smoothed curve
    const point = splineCurve.getPointAt(progressRef.current);
    g.position.copy(point);

    // Get the tangent (direction of the curve at this point) for incredibly smooth turning
    splineCurve.getTangentAt(progressRef.current, _tangent);
    
    // Rotate to face tangent
    const targetYaw = Math.atan2(_tangent.x, _tangent.z);
    
    const cur = g.rotation.y;
    let d = targetYaw - cur;
    while (d >  Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    g.rotation.y += d * Math.min(1, 10 * dtC);
  });

  return (
    <group 
        ref={rootRef} 
        onClick={e => { e.stopPropagation(); onInteract?.(); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={()  => { document.body.style.cursor = 'crosshair'; }}
    >
      <primitive object={scene} />
      {/* Hitbox bounding volume */}
      <mesh visible={false} position={[0, 1, 0]}>
         <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
         <meshBasicMaterial opacity={0} transparent />
      </mesh>
    </group>
  );
}
