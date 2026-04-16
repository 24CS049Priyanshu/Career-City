/**
 * useStore.js — Zustand global state
 */
import { create } from 'zustand';

const useStore = create((set) => ({
  // Game mode
  mode: 'loading',       // loading | story | free
  setMode: (mode) => set({ mode }),

  // Story scene meta (for typewriter dots, portrait, etc.)
  sceneMeta: null,  // { sceneIndex, totalScenes, speaker, lastScene }
  setSceneMeta: (meta) => set({ sceneMeta: meta }),
  clearSceneMeta: () => set({ sceneMeta: null }),

  // Avatar target position [x, y, z]
  avatarTarget: [0, 0, 8],
  setAvatarTarget: (t) => set({ avatarTarget: t }),

  // Free-explore analog movement input (-1..1 per axis)
  joystick: { x: 0, z: 0 },
  setJoystick: (joystick) => set({ joystick }),

  // Zone detection
  activeZone: null,
  setActiveZone: (z) => set({ activeZone: z }),

  // Dialogue (typewriter streams chars here)
  dialogue: null,
  setDialogue: (text) => set({ dialogue: text }),
  clearDialogue: () => set({ dialogue: null }),

  // Info panel (zone/building detail)
  infoPanel: null,
  setInfoPanel: (data) => set({ infoPanel: data }),
  closeInfoPanel: () => set({ infoPanel: null }),

  // Loading
  loadProgress: 0,
  setLoadProgress: (p) => set({ loadProgress: p }),
}));

export default useStore;
