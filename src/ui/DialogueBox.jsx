/**
 * DialogueBox.jsx — Bottom narrative dialogue
 */
import useStore from '../store/useStore';
import { nextStoryScene, skipStory } from '../story/storyRunner';

export default function DialogueBox() {
  const dialogue = useStore(s => s.dialogue);
  const mode     = useStore(s => s.mode);

  if (!dialogue) return null;

  function handleSkip() {
    skipStory();
    useStore.getState().setMode('free');
    useStore.getState().clearDialogue();
    setTimeout(() => {
      useStore.getState().setDialogue('🎮 Switched to Free Explore!');
      setTimeout(() => useStore.getState().clearDialogue(), 3000);
    }, 200);
  }

  function handleNext() {
    nextStoryScene();
  }

  return (
    <div className="dialogue-box">
      <p className="dialogue-text">{dialogue}</p>
      {mode === 'story' && (
        <div className="dialogue-actions">
          <button className="dialogue-skip" onClick={handleNext}>
            Next (Tab / Enter / Space)
          </button>
          <button className="dialogue-skip" onClick={handleSkip}>
            Skip Story →
          </button>
        </div>
      )}
    </div>
  );
}
