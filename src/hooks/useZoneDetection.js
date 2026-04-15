/**
 * useZoneDetection.js — Checks avatar position against zone boundaries every frame
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ZONES } from '../utils/constants';
import useStore from '../store/useStore';

const _zonePos = new THREE.Vector3();

export default function useZoneDetection(avatarRef) {
  // Use imperative store access here to avoid React hook ordering issues
  // during hot updates inside Canvas-managed hooks.
  const lastZone      = useRef(null);

  useFrame(() => {
    const av = avatarRef?.current;
    if (!av) return;

    const avPos = av.position;
    let detected = null;

    for (const [key, zone] of Object.entries(ZONES)) {
      _zonePos.set(zone.pos[0], 0, zone.pos[2]);
      const dist = avPos.distanceTo(_zonePos);
      if (dist < zone.radius) {
        detected = key;
        break;
      }
    }

    if (detected !== lastZone.current) {
      lastZone.current = detected;
      useStore.getState().setActiveZone(detected);
    }
  });
}
