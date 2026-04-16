/**
 * scenes.js — 8 cinematic story scenes using Priyanshu's real CV
 */
import { ZONES } from '../utils/constants';

export const SCENES = [
  {
    id: 'intro',
    target:     [0, 0, 8],
    dialogue:   "🌆 Welcome to Career City. I'm Priyanshu Macwan — a CSE undergraduate building real software + hardware systems. Every district here is a chapter of my journey.",
    speaker:    'Priyanshu',
    duration:   6000,
  },
  {
    id: 'profile',
    target:     [0, 0, 20],
    dialogue:   "🧑‍💻 I'm a 2nd-year B.Tech CSE student (graduating 2028) with a passion for problem-solving, logic design, and building things that integrate software with the real world.",
    speaker:    'Priyanshu',
    duration:   6000,
  },
  {
    id: 'skills',
    target:     ZONES.skills.pos,
    dialogue:   "🧠 Skills District: C & C++ with OOP, STL, file handling, dynamic memory. Java fundamentals. HTML5, CSS3, JavaScript for frontend. Data Structures, Algorithms, and core CS concepts.",
    speaker:    'Priyanshu',
    zoneFocus:  'skills',
    duration:   7000,
  },
  {
    id: 'iot',
    target:     [-28, 0, -8],
    dialogue:   "🔌 IoT Tower: I built a Smart Attendance System using ESP32 + fingerprint sensor. It logs attendance to Google Sheets in real-time, supports subject selection, and backs up to Firebase.",
    speaker:    'Priyanshu',
    duration:   7000,
  },
  {
    id: 'projects',
    target:     ZONES.projects.pos,
    dialogue:   "🛠 Project Arena: My Digital Twin Storage PWA (React + FastAPI + Firebase), the ReWear hackathon platform, Tinkercad digital electronics circuits — Half Adder, ALU, Multiplexers.",
    speaker:    'Priyanshu',
    zoneFocus:  'projects',
    duration:   7000,
  },
  {
    id: 'hackathon',
    target:     [42, 0, 8],
    dialogue:   "🏆 Hackathon Quarter: Participated in the Tic Tac Hackathon, building the ReWear platform frontend — login/register flow, dashboard navigation, clean UI/UX with scalable module structure.",
    speaker:    'Priyanshu',
    duration:   6500,
  },
  {
    id: 'gate',
    target:     ZONES.contact.pos,
    dialogue:   "📚 GATE Prep Hub: Currently preparing for GATE CSE — mastering Computer Networks, Software Engineering (SDLC, CMM), Data Science basics, PDEs, and advanced C++ and system design.",
    speaker:    'Priyanshu',
    zoneFocus:  'contact',
    duration:   7000,
  },
  {
    id: 'outro',
    target:     [0, 0, 8],
    dialogue:   "🎯 Career Objective: To become a highly skilled software engineer — expert in system design, problem-solving, and scalable applications. The city is yours now. Explore freely!",
    speaker:    'Priyanshu',
    duration:   5000,
    lastScene:  true,
  },
];
