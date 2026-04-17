import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { avatarState } from './avatarState';
import useCharacterLoader from '../hooks/useCharacterLoader';

export default function Avatar({ onAvatarClick }) {
  const rootRef = useRef();
  
  // Load our FBX and Animations via the new shared hook
  const { scene, animations } = useCharacterLoader();
  const { actions, names } = useAnimations(animations, rootRef);
  
  // Track the current action for smooth crossfades
  const currentAction = useRef(null);

  useEffect(() => {
    if (!names.length) return;
    
    // Play the default IDLE state immediately
    const idleAct = actions['IDLE'];
    if (idleAct) {
      idleAct.reset().play();
      currentAction.current = 'IDLE';
    }
  }, [actions, names]);

  useFrame((_, dt) => {
    if (!names.length) return;
    const targetState = avatarState.animState;
    
    if (currentAction.current !== targetState && actions[targetState]) {
      // Smoothly crossfade from old to new action over 0.4 seconds
      const oldAct = actions[currentAction.current];
      const newAct = actions[targetState];
      
      if (oldAct) {
        oldAct.fadeOut(0.4);
      }
      
      newAct.reset().fadeIn(0.4).play();
      currentAction.current = targetState;
    }
  });

  const onC = (e) => {
    e.stopPropagation();
    onAvatarClick?.();
  };

  return (
    <group ref={rootRef} position={[0, 0, 0]} onClick={onC}>
      <primitive object={scene} />
      {/* Interactive invisible hit-box proxy wrapper */}
      <mesh visible={false} position={[0, 1, 0]}>
         <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
         <meshStandardMaterial opacity={0} transparent />
      </mesh>
    </group>
  );
}
