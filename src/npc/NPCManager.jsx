/**
 * NPCManager.jsx — Places walking NPCs around the city
 */
import NPC      from './NPC';
import useStore from '../store/useStore';
import { NPC_PATHS } from '../utils/paths';

const NPC_DEFS = [
  // Skills district workers
  { path: NPC_PATHS[0].path, clothingColor:'#2e3a5a', skinColor:'#c89060', startOffset:0.0 },
  { path: NPC_PATHS[0].path, clothingColor:'#3a4a2a', skinColor:'#a07050', startOffset:0.5 },
  { path: NPC_PATHS[0].path, clothingColor:'#5a2a2a', skinColor:'#d0a880', startOffset:0.25 },
  // Projects district
  { path: NPC_PATHS[1].path, clothingColor:'#2a3a3a', skinColor:'#405030', startOffset:0.0 },
  { path: NPC_PATHS[1].path, clothingColor:'#4a3020', skinColor:'#c0816a', startOffset:0.6 },
  // Contact plaza
  { path: NPC_PATHS[2].path, clothingColor:'#3a2a4a', skinColor:'#b88865', startOffset:0.0 },
  { path: NPC_PATHS[2].path, clothingColor:'#204020', skinColor:'#80604a', startOffset:0.4 },
  // Central plaza strollers
  { path: NPC_PATHS[3].path, clothingColor:'#1a2a4a', skinColor:'#d0a870', startOffset:0.15 },
  { path: NPC_PATHS[3].path, clothingColor:'#3a1a1a', skinColor:'#c89880', startOffset:0.75 },
  // East side
  { path: NPC_PATHS[4].path, clothingColor:'#2a3a2a', skinColor:'#a86040', startOffset:0.3 },
];

export default function NPCManager() {
  const setDialogue = useStore(s => s.setDialogue);
  const clearDialogue = useStore(s => s.clearDialogue);

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
            const msgs = [
              "Nice city for a portfolio, right?",
              "The Skills District has some impressive towers!",
              "Looking for talent? Check the Contact Hub!",
              "I heard the Project Arena has great case studies.",
              "Welcome to Career City — nice to meet you!",
            ];
            setDialogue(msgs[i % msgs.length]);
            setTimeout(clearDialogue, 4000);
          }}
        />
      ))}
    </>
  );
}
