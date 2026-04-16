/**
 * ModeSwitch.jsx — Story / Explore toggle
 */
import useStore from '../store/useStore';
import { startStory, skipStory } from '../story/storyRunner';

export default function ModeSwitch() {
  const mode = useStore(s => s.mode);

  function handleStory() {
    startStory();
  }

  function handleFree() {
    skipStory();
    useStore.getState().setMode('free');
    useStore.getState().clearDialogue();
    setTimeout(() => {
      useStore.getState().setDialogue('🎮 Free Explore mode — click buildings and talk to NPCs!');
      setTimeout(() => useStore.getState().clearDialogue(), 4000);
    }, 200);
  }

  return (
    <div className="mode-switch">
      <button
        className={`mode-btn${mode === 'story' ? ' active' : ''}`}
        onClick={handleStory}
      >
        🎬 Story
      </button>
      <button
        className={`mode-btn${mode === 'free' ? ' active' : ''}`}
        onClick={handleFree}
      >
        🎮 Explore
      </button>
    </div>
  );
}
