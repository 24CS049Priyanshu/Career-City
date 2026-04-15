/**
 * scenes.js — Story Mode scene definitions
 */
import { ZONES } from '../utils/constants';

export const SCENES = [
  {
    id: 'intro',
    target:       [0, 0, 8],
    cameraPos:    [0, 28, 38],
    cameraLook:   [0, 0, 0],
    dialogue: "🌆 Welcome to Career City — Priya Sharma's professional universe. Your guided tour begins now.",
    zoneFocus: null,
    duration: 5500,
  },
  {
    id: 'skills',
    target:    ZONES.skills.pos,
    cameraPos: [-42, 10, 14],
    cameraLook:[-35, 0, 0],
    dialogue: "🧠 The Skills District — where expertise is forged. Each tower represents a core competency.",
    zoneFocus: 'skills',
    duration: 6000,
  },
  {
    id: 'projects',
    target:    ZONES.projects.pos,
    cameraPos: [42, 10, 14],
    cameraLook:[35, 0, 0],
    dialogue: "🛠 The Project Arena — real systems built from scratch. Click any building to explore.",
    zoneFocus: 'projects',
    duration: 6000,
  },
  {
    id: 'contact',
    target:    ZONES.contact.pos,
    cameraPos: [5, 12, -30],
    cameraLook:[0, 0, -40],
    dialogue: "📡 The Contact Hub — open to opportunities, collaborations and interesting conversations.",
    zoneFocus: 'contact',
    duration: 5500,
  },
  {
    id: 'free',
    target:    [0, 0, 8],
    cameraPos: [0, 18, 28],
    cameraLook:[0, 0, 0],
    dialogue: "🎮 Career City is yours to explore. Walk around, click buildings, meet the NPCs!",
    zoneFocus: null,
    duration: 4000,
    lastScene: true,
  },
];
