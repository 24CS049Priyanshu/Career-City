/**
 * constants.js — all world data — PRIYANSHU MACWAN CV
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
  { name: 'C / C++',        level: 92, color: '#00f0ff' },
  { name: 'Java',           level: 74, color: '#a855f7' },
  { name: 'React / JS',     level: 82, color: '#61dafb' },
  { name: 'IoT / ESP32',    level: 88, color: '#39ff14' },
  { name: 'System Design',  level: 75, color: '#f0a500' },
  { name: 'Data Structures',level: 85, color: '#ff6b6b' },
];

export const PROJECTS = [
  {
    id: 'attendance',
    name: 'IoT Smart Attendance',
    desc: 'ESP32 + fingerprint sensor system with Google Sheets real-time logging, timestamp tracking, subject selection, and Firebase database storage.',
    tech: ['ESP32', 'Firebase', 'Google Sheets API', 'IoT'],
    color: '#00f0ff',
  },
  {
    id: 'digitaltwin',
    name: 'Digital Twin Storage PWA',
    desc: 'React-based Progressive Web App: item tracking dashboard, search & sorting, data visualization, FastAPI backend planning, modular UI pages.',
    tech: ['React', 'FastAPI', 'Firebase', 'PWA'],
    color: '#a855f7',
  },
  {
    id: 'rewear',
    name: 'ReWear Platform (Hackathon)',
    desc: 'Multi-page frontend built for Tic Tac Hackathon: Login/Register, dashboard nav, clean UI/UX architecture, scalable modular structure.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX'],
    color: '#f0a500',
  },
  {
    id: 'electronics',
    name: 'Digital Electronics Lab',
    desc: 'Tinkercad-simulated circuits: Half & Full Adder, Multiplexer, Encoder systems, Basic ALU design. Logic optimization verified for correctness.',
    tech: ['Tinkercad', 'Logic Gates', 'ALU', 'Circuit Design'],
    color: '#39ff14',
  },
];

export const OWNER = {
  name: 'Priyanshu Macwan',
  title: 'B.Tech CSE 2028 · IoT Builder · GATE Aspirant',
  tagline: 'Building Logic into Reality',
  college: 'B.Tech Computer Science Engineering (2nd Year)',
  graduation: 'Expected 2028',
  email: 'priyanshu.macwan@email.com',
  github: 'github.com/priyanshu-macwan',
  linkedin: 'linkedin.in/priyanshu-macwan',
};

export const STORY_GUIDE_MESSAGES = [
  '👋 Welcome to Career City! This is Priyanshu\'s professional universe.',
  '🧠 The Skills District — C, C++, Java, IoT, System Design.',
  '🛠 The Project Arena — real systems Priyanshu built.',
  '📡 The Contact Hub — reach out & connect!',
  '🎮 City unlocked! Explore freely.',
];
