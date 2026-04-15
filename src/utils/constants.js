/**
 * constants.js — all world data in one place
 */

export const CITY = {
  size: 200,
  roadWidth: 12,
};

export const ZONES = {
  skills: {
    id: 'skills',
    pos: [-35, 0, 0],
    color: '#00f0ff',
    hex: 0x00f0ff,
    label: 'Skills District',
    radius: 22,
    emoji: '🧠',
  },
  projects: {
    id: 'projects',
    pos: [35, 0, 0],
    color: '#f0a500',
    hex: 0xf0a500,
    label: 'Project Arena',
    radius: 22,
    emoji: '🛠',
  },
  contact: {
    id: 'contact',
    pos: [0, 0, -40],
    color: '#ff3a5c',
    hex: 0xff3a5c,
    label: 'Contact Hub',
    radius: 18,
    emoji: '📡',
  },
  about: {
    id: 'about',
    pos: [0, 0, 35],
    color: '#a855f7',
    hex: 0xa855f7,
    label: 'About Me Plaza',
    radius: 18,
    emoji: '🧑‍💻',
  },
};

export const SKILLS = [
  { name: 'C++',        level: 92, color: '#00f0ff' },
  { name: 'Python',     level: 87, color: '#a855f7' },
  { name: 'React',      level: 82, color: '#61dafb' },
  { name: 'IoT/ESP32',  level: 78, color: '#39ff14' },
  { name: 'System Design',level: 75, color: '#f0a500' },
  { name: 'ML/TF',      level: 68, color: '#ff6b6b' },
];

export const PROJECTS = [
  {
    id: 'smartnest',
    name: 'SmartNest',
    desc: 'IoT Home Automation with ESP32, MQTT & React dashboard. 18 sensor nodes, 99.2% uptime.',
    tech: ['ESP32', 'MQTT', 'React', 'WebSockets'],
    color: '#00f0ff',
  },
  {
    id: 'neurosort',
    name: 'NeuroSort',
    desc: 'TensorFlow CNN achieving 94% accuracy on waste categorisation via Raspberry Pi robotic arm.',
    tech: ['TensorFlow', 'Python', 'Raspberry Pi'],
    color: '#a855f7',
  },
  {
    id: 'devboard',
    name: 'DevBoard',
    desc: 'Real-time collaborative IDE with live cursors, shared execution and CRDTs over WebRTC.',
    tech: ['Node.js', 'WebRTC', 'React'],
    color: '#f0a500',
  },
  {
    id: 'edgeguard',
    name: 'EdgeGuard',
    desc: 'Federated intrusion detection at edge nodes — 89ms avg latency, 91% F1 score.',
    tech: ['Python', 'Federated ML', 'C++'],
    color: '#39ff14',
  },
];

export const OWNER = {
  name: 'Priya Sharma',
  title: 'CS Student & Systems Developer',
  tagline: 'Building Logic into Reality',
  cgpa: '3.9 / 4.0',
  college: 'XYZ Institute of Technology',
  email: 'priya.sharma@email.com',
  github: 'github.com/priya-sharma',
  linkedin: 'linkedin.com/in/priya-sharma',
};

export const STORY_GUIDE_MESSAGES = [
  '👋 Welcome to Career City! This is my professional universe.',
  '🧠 The Skills District — where all my expertise lives.',
  '🛠 The Project Arena — real systems I built.',
  '📡 The Contact Hub — let\'s connect!',
  '🎮 City unlocked! Explore freely.',
];
