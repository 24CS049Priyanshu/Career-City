/**
 * NPCManager.jsx — 10 NPCs each speaking real CV facts about Priyanshu
 */
import NPC      from './NPC';
import useStore from '../store/useStore';
import { NPC_PATHS } from '../utils/paths';

const NPC_DEFS = [
  // Skills district
  { path: NPC_PATHS[0].path, clothingColor: '#1e3a5a', skinColor: '#c89060', startOffset: 0.0,
    line: "Priyanshu built an IoT Smart Attendance System using ESP32 + fingerprint sensors! Real hardware-software integration." },
  { path: NPC_PATHS[0].path, clothingColor: '#2a4820', skinColor: '#a07050', startOffset: 0.5,
    line: "His C++ skills cover OOP, STL, templates, file handling, and dynamic memory. Solid foundations!" },
  { path: NPC_PATHS[0].path, clothingColor: '#4a1a1a', skinColor: '#d0a880', startOffset: 0.25,
    line: "Data Structures — arrays, vectors, maps. Algorithms — recursion, searching. He's prepping for GATE CSE too." },

  // Projects district
  { path: NPC_PATHS[1].path, clothingColor: '#1a3a3a', skinColor: '#b08060', startOffset: 0.0,
    line: "The Digital Twin Storage PWA was built with React, FastAPI planning, Firebase, and a full dashboard UI. Impressive!" },
  { path: NPC_PATHS[1].path, clothingColor: '#3a2010', skinColor: '#c0816a', startOffset: 0.6,
    line: "ReWear — his hackathon project had a full login/register flow, dashboard navigation and clean modular frontend." },

  // Contact plaza
  { path: NPC_PATHS[2].path, clothingColor: '#2a1a4a', skinColor: '#b88865', startOffset: 0.0,
    line: "Priyanshu's IoT attendance system logs to Google Sheets API in real-time with subject selection and timestamps." },
  { path: NPC_PATHS[2].path, clothingColor: '#163216', skinColor: '#80604a', startOffset: 0.4,
    line: "He's also designed digital electronics in Tinkercad — Half Adder, Full Adder, Multiplexers, Encoders and a basic ALU!" },

  // Central plaza strollers
  { path: NPC_PATHS[3].path, clothingColor: '#0e1e3a', skinColor: '#d0a870', startOffset: 0.15,
    line: "Frontend skills: HTML5, CSS3 with Flexbox & animations, JavaScript DOM manipulation. He built interactive birthday sites too!" },
  { path: NPC_PATHS[3].path, clothingColor: '#3a0e0e', skinColor: '#c89880', startOffset: 0.75,
    line: "He knows Software Engineering deeply — SDLC models, Requirement Engineering, CMM, metrics. GATE knowledge!" },

  // East side roamer
  { path: NPC_PATHS[4].path, clothingColor: '#1a2e1a', skinColor: '#a86040', startOffset: 0.3,
    line: "Priyanshu uses Firebase Realtime Database, Canva for UI design, Git for version control. Full toolset!" },
];

export default function NPCManager() {
  const setDialogue   = useStore(s => s.setDialogue);
  const clearDialogue = useStore(s => s.clearDialogue);
  const mode          = useStore(s => s.mode);

  return (
    <>
      {NPC_DEFS.map((def, i) => (
        <NPC
          key={i}
          path={def.path}
          clothingColor={def.clothingColor}
          skinColor={def.skinColor}
          startOffset={def.startOffset * def.path.length}
          onInteract={() => {
            if (mode === 'story') return; // don't interrupt story
            setDialogue(`💬 ${def.line}`);
            setTimeout(clearDialogue, 5500);
          }}
        />
      ))}
    </>
  );
}
