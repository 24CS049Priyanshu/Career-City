/**
 * Avatar.jsx — Procedural humanoid avatar with 4-state animation machine.
 * Reads avatarState.animState each frame — no static method hacks.
 *
 * Bone hierarchy:
 *   rootRef
 *   ├── leftLegRef  → leftShinRef
 *   ├── rightLegRef → rightShinRef
 *   └── bodyRef
 *         ├── leftArmRef  → leftForeRef
 *         ├── rightArmRef → rightForeRef
 *         └── headRef
 */
import { useRef }     from 'react';
import { useFrame }   from '@react-three/fiber';
import * as THREE     from 'three';
import { avatarState } from './avatarState';

const lerp  = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

const MATS = {
  body:   { color:'#00bcd4', emissive:'#003344', emissiveIntensity:0.3, roughness:0.25, metalness:0.75 },
  dark:   { color:'#003344', emissive:'#001122', emissiveIntensity:0.2, roughness:0.35, metalness:0.85 },
  head:   { color:'#00e5ff', emissive:'#004455', emissiveIntensity:0.4, roughness:0.2,  metalness:0.8 },
  visor:  { color:'#ffffff', emissive:'#88ffff', emissiveIntensity:1.0, roughness:0.0,  metalness:1.0, transparent:true, opacity:0.85 },
  accent: { color:'#00f0ff', emissive:'#00f0ff', emissiveIntensity:2.2, transparent:true, opacity:0.9 },
  aura:   { color:'#00f0ff', emissive:'#00f0ff', emissiveIntensity:2.6, transparent:true, opacity:0.7 },
  pants:  { color:'#004466', emissive:'#001122', emissiveIntensity:0.15, roughness:0.4, metalness:0.7 },
  boot:   { color:'#001a33', emissive:'#000811', emissiveIntensity:0.1,  roughness:0.5, metalness:0.6 },
  ant:    { color:'#00f0ff', emissive:'#00f0ff', emissiveIntensity:3.0,  transparent:true, opacity:0.9 },
};
function M({ t }) { return <meshStandardMaterial {...MATS[t]} />; }

export default function Avatar({ onAvatarClick }) {
  const rootRef      = useRef();
  const bodyRef      = useRef();
  const headRef      = useRef();
  const leftLegRef   = useRef();
  const rightLegRef  = useRef();
  const leftShinRef  = useRef();
  const rightShinRef = useRef();
  const leftArmRef   = useRef();
  const rightArmRef  = useRef();
  const leftForeRef  = useRef();
  const rightForeRef = useRef();
  const auraRef      = useRef();

  const walkPhase   = useRef(0);
  const greetTimer  = useRef(0);
  const arriveTimer = useRef(0);

  useFrame(({ clock }, dt) => {
    const t   = clock.getElapsedTime();
    const dtC = Math.min(dt, 0.05);
    const state = avatarState.animState;

    const b = {
      root:      rootRef.current,
      body:      bodyRef.current,
      head:      headRef.current,
      lLeg:      leftLegRef.current,
      rLeg:      rightLegRef.current,
      lShin:     leftShinRef.current,
      rShin:     rightShinRef.current,
      lArm:      leftArmRef.current,
      rArm:      rightArmRef.current,
      lFore:     leftForeRef.current,
      rFore:     rightForeRef.current,
      aura:      auraRef.current,
    };
    if (!b.body) return;

    // ── IDLE ──────────────────────────────────────────────────
    if (state === 'IDLE') {
      const breath = Math.sin(t * 1.4) * 0.048;
      b.body.position.y   = lerp(b.body.position.y, 0.55 + breath, 5 * dtC);
      b.head.rotation.y   = Math.sin(t * 0.48) * 0.2;
      b.head.rotation.x   = Math.sin(t * 0.33) * 0.07;
      b.lArm.rotation.x   = lerp(b.lArm.rotation.x,  Math.sin(t * 1.1)     * 0.09, 3 * dtC);
      b.rArm.rotation.x   = lerp(b.rArm.rotation.x,  Math.sin(t * 1.1 + 1) * 0.09, 3 * dtC);
      b.lArm.rotation.z   = lerp(b.lArm.rotation.z,  0.14,  4 * dtC);
      b.rArm.rotation.z   = lerp(b.rArm.rotation.z, -0.14,  4 * dtC);
      b.lLeg.rotation.x   = lerp(b.lLeg.rotation.x,  0, 6 * dtC);
      b.rLeg.rotation.x   = lerp(b.rLeg.rotation.x,  0, 6 * dtC);
      b.lShin.rotation.x  = lerp(b.lShin.rotation.x, 0, 6 * dtC);
      b.rShin.rotation.x  = lerp(b.rShin.rotation.x, 0, 6 * dtC);
      const ap = 1 + Math.sin(t * 2.8) * 0.13;
      b.aura.scale.set(ap, 1, ap);
      b.root.position.y = Math.sin(t * 1.4) * 0.025;
    }

    // ── WALK ──────────────────────────────────────────────────
    else if (state === 'WALK') {
      walkPhase.current += dtC * 3.0;
      const ph  = walkPhase.current;
      const lgS = Math.sin(ph) * 0.52;
      const kn  = 0.72;

      b.lLeg.rotation.x = -lgS;
      b.rLeg.rotation.x =  lgS;
      b.lShin.rotation.x = clamp( lgS, 0, 1) * kn;
      b.rShin.rotation.x = clamp(-lgS, 0, 1) * kn;

      const arS = Math.sin(ph) * 0.38;
      b.lArm.rotation.x  =  arS;
      b.rArm.rotation.x  = -arS;
      b.lArm.rotation.z  =  0.14;
      b.rArm.rotation.z  = -0.14;
      b.lFore.rotation.x = clamp(-arS, 0, 1) * 0.25;
      b.rFore.rotation.x = clamp( arS, 0, 1) * 0.25;
      b.body.rotation.y  = Math.sin(ph) * 0.07;

      const bob = Math.abs(Math.sin(ph)) * 0.07;
      b.body.position.y = 0.55 + bob;
      b.root.position.y = bob * 0.4;
      b.head.rotation.x = lerp(b.head.rotation.x, 0, 6 * dtC);
      b.head.rotation.y = lerp(b.head.rotation.y, 0, 6 * dtC);
      b.aura.scale.set(1.05, 1, 1.05);
    }

    // ── ARRIVE ────────────────────────────────────────────────
    else if (state === 'ARRIVE') {
      arriveTimer.current += dtC;
      const at = arriveTimer.current;
      const hopDur = 0.5;
      const hop = at < hopDur ? Math.sin((at / hopDur) * Math.PI) * 0.38 : 0;
      b.root.position.y = hop;

      const landT  = clamp((at - hopDur) / 0.3, 0, 1);
      const crouch = landT < 0.5 ? Math.sin(landT * Math.PI) * 0.09 : 0;
      b.body.position.y = lerp(b.body.position.y, 0.55 - crouch, 8 * dtC);
      const flex = landT < 0.5 ? Math.sin(landT * Math.PI) * 0.5 : 0;
      b.lShin.rotation.x = lerp(b.lShin.rotation.x, flex, 10 * dtC);
      b.rShin.rotation.x = lerp(b.rShin.rotation.x, flex, 10 * dtC);
      b.lArm.rotation.z  = lerp(b.lArm.rotation.z,  0.38, 5 * dtC);
      b.rArm.rotation.z  = lerp(b.rArm.rotation.z, -0.38, 5 * dtC);
      const burst = 1 + Math.max(0, 0.8 - at) * 0.5;
      b.aura.scale.set(1 + burst * 0.3, 1, 1 + burst * 0.3);

      if (at > 1.2) {
        avatarState.animState = 'IDLE';
        arriveTimer.current   = 0;
      }
    }

    // ── GREET ─────────────────────────────────────────────────
    else if (state === 'GREET') {
      greetTimer.current += dtC;
      const gt = greetTimer.current;
      b.lLeg.rotation.x  = lerp(b.lLeg.rotation.x,  0, 7 * dtC);
      b.rLeg.rotation.x  = lerp(b.rLeg.rotation.x,  0, 7 * dtC);
      b.lShin.rotation.x = lerp(b.lShin.rotation.x, 0, 7 * dtC);
      b.rShin.rotation.x = lerp(b.rShin.rotation.x, 0, 7 * dtC);
      b.body.position.y  = lerp(b.body.position.y, 0.55, 5 * dtC);
      b.lArm.rotation.x  = lerp(b.lArm.rotation.x,  0, 5 * dtC);
      b.lArm.rotation.z  = lerp(b.lArm.rotation.z, 0.14, 4 * dtC);
      const raiseT = clamp(gt / 0.35, 0, 1);
      b.rArm.rotation.x  = lerp(b.rArm.rotation.x, -1.9 * raiseT, 7 * dtC);
      b.rArm.rotation.z  = lerp(b.rArm.rotation.z, -0.25 * raiseT, 5 * dtC);
      if (gt > 0.3) b.rFore.rotation.z = Math.sin(t * 9.5) * 0.48;
      b.head.rotation.x = Math.sin(t * 4.2) * 0.13;
      b.head.rotation.y = Math.sin(t * 0.85) * 0.18;
      const ap = 1 + Math.sin(t * 5) * 0.2;
      b.aura.scale.set(ap, 1, ap);
      b.root.position.y = Math.abs(Math.sin(t * 3.5)) * 0.05;
    }
  });

  const onC = (e) => { e.stopPropagation(); onAvatarClick?.(); };

  return (
    <group ref={rootRef}>
      {/* Left leg */}
      <group ref={leftLegRef} position={[-0.22, 0.55, 0]}>
        <mesh position={[0,-0.31,0]} castShadow><cylinderGeometry args={[0.13,0.11,0.62,10]}/><M t="pants"/></mesh>
        <group ref={leftShinRef} position={[0,-0.62,0]}>
          <mesh position={[0,-0.29,0]} castShadow><cylinderGeometry args={[0.10,0.09,0.58,10]}/><M t="pants"/></mesh>
          <mesh position={[0,-0.62,0.04]} castShadow><boxGeometry args={[0.18,0.14,0.28]}/><M t="boot"/></mesh>
          <mesh position={[0,0,0]}><sphereGeometry args={[0.05,8,8]}/><M t="accent"/></mesh>
        </group>
      </group>

      {/* Right leg */}
      <group ref={rightLegRef} position={[0.22, 0.55, 0]}>
        <mesh position={[0,-0.31,0]} castShadow><cylinderGeometry args={[0.13,0.11,0.62,10]}/><M t="pants"/></mesh>
        <group ref={rightShinRef} position={[0,-0.62,0]}>
          <mesh position={[0,-0.29,0]} castShadow><cylinderGeometry args={[0.10,0.09,0.58,10]}/><M t="pants"/></mesh>
          <mesh position={[0,-0.62,0.04]} castShadow><boxGeometry args={[0.18,0.14,0.28]}/><M t="boot"/></mesh>
          <mesh position={[0,0,0]}><sphereGeometry args={[0.05,8,8]}/><M t="accent"/></mesh>
        </group>
      </group>

      {/* Body */}
      <group ref={bodyRef} position={[0, 0.55, 0]}>
        <mesh position={[0,0.40,0]} castShadow onClick={onC}>
          <cylinderGeometry args={[0.30,0.25,0.80,14]}/><M t="body"/>
        </mesh>
        <mesh position={[0,0.44,0.29]}><boxGeometry args={[0.18,0.22,0.05]}/><M t="accent"/></mesh>
        {[-0.22,0.22].map(x=>(
          <mesh key={x} position={[x,0.44,0.28]}><boxGeometry args={[0.05,0.30,0.04]}/><M t="accent"/></mesh>
        ))}
        <mesh rotation={[Math.PI/2,0,0]} position={[0,0.02,0]}>
          <torusGeometry args={[0.28,0.04,8,32]}/><M t="dark"/>
        </mesh>

        {/* Left arm */}
        <group ref={leftArmRef} position={[-0.44,0.28,0]}>
          <mesh position={[0,-0.25,0]} castShadow><cylinderGeometry args={[0.10,0.09,0.50,10]}/><M t="body"/></mesh>
          <mesh position={[0,-0.02,0]} scale={[1.1,0.7,1]}><sphereGeometry args={[0.12]}/><M t="dark"/></mesh>
          <group ref={leftForeRef} position={[0,-0.50,0]}>
            <mesh position={[0,-0.22,0]} castShadow><cylinderGeometry args={[0.085,0.075,0.44,10]}/><M t="body"/></mesh>
            <mesh position={[0,-0.46,0]}><sphereGeometry args={[0.09,10,10]}/><M t="dark"/></mesh>
          </group>
        </group>

        {/* Right arm */}
        <group ref={rightArmRef} position={[0.44,0.28,0]}>
          <mesh position={[0,-0.25,0]} castShadow><cylinderGeometry args={[0.10,0.09,0.50,10]}/><M t="body"/></mesh>
          <mesh position={[0,-0.02,0]} scale={[1.1,0.7,1]}><sphereGeometry args={[0.12]}/><M t="dark"/></mesh>
          <group ref={rightForeRef} position={[0,-0.50,0]}>
            <mesh position={[0,-0.22,0]} castShadow><cylinderGeometry args={[0.085,0.075,0.44,10]}/><M t="body"/></mesh>
            <mesh position={[0,-0.46,0]}><sphereGeometry args={[0.09,10,10]}/><M t="dark"/></mesh>
          </group>
        </group>

        {/* Neck */}
        <mesh position={[0,0.89,0]}><cylinderGeometry args={[0.09,0.11,0.18,10]}/><M t="dark"/></mesh>

        {/* Head */}
        <group ref={headRef} position={[0,1.0,0]}>
          <mesh castShadow onClick={onC}><sphereGeometry args={[0.26,16,16]}/><M t="head"/></mesh>
          <mesh position={[0,-0.02,0.18]} scale={[1.35,0.55,0.65]} onClick={onC}>
            <sphereGeometry args={[0.17,12,12]}/><M t="visor"/>
          </mesh>
          <mesh rotation={[0,0,0]} position={[0,0.04,0]}>
            <torusGeometry args={[0.265,0.035,6,32]}/><M t="dark"/>
          </mesh>
          <mesh position={[0.12,0.32,0]}><cylinderGeometry args={[0.015,0.015,0.28,6]}/><M t="ant"/></mesh>
          <mesh position={[0.12,0.47,0]}><sphereGeometry args={[0.035,8,8]}/><M t="ant"/></mesh>
        </group>
      </group>

      {/* Aura ring */}
      <mesh ref={auraRef} rotation={[Math.PI/2,0,0]} position={[0,0.06,0]}>
        <torusGeometry args={[0.58,0.055,8,36]}/><M t="aura"/>
      </mesh>
    </group>
  );
}
