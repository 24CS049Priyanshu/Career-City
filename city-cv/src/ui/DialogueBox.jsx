/**
 * DialogueBox.jsx — Typewriter text, speaker portrait with glow ring,
 * scene progress dots, cinematic bottom bar.
 */
import useStore from '../store/useStore';
import { nextStoryScene, skipStory } from '../story/storyRunner';

export default function DialogueBox() {
  const dialogue  = useStore(s => s.dialogue);
  const mode      = useStore(s => s.mode);
  const sceneMeta = useStore(s => s.sceneMeta);

  if (!dialogue) return null;

  const isStory      = mode === 'story';
  const totalScenes  = sceneMeta?.totalScenes ?? 0;
  const sceneIndex   = sceneMeta?.sceneIndex  ?? 0;
  const speaker      = sceneMeta?.speaker     ?? 'Priyanshu';
  const isLastScene  = sceneMeta?.lastScene   ?? false;

  function handleNext() {
    if (isLastScene) {
      skipStory();
      useStore.getState().setMode('free');
      useStore.getState().clearDialogue();
      useStore.getState().clearSceneMeta();
      setTimeout(() => {
        useStore.getState().setDialogue('🎮 City is yours! Walk around and click buildings to explore Priyanshu\'s CV.');
        setTimeout(() => useStore.getState().clearDialogue(), 6000);
      }, 300);
    } else {
      nextStoryScene();
    }
  }

  function handleSkip() {
    skipStory();
    useStore.getState().setMode('free');
    useStore.getState().clearDialogue();
    useStore.getState().clearSceneMeta();
    setTimeout(() => {
      useStore.getState().setDialogue('🎮 Switched to Free Explore! WASD / Arrow keys to move.');
      setTimeout(() => useStore.getState().clearDialogue(), 4000);
    }, 200);
  }

  return (
    <div className="dialogue-box">
      <div className="dialogue-inner">
        {/* Speaker portrait + glow ring */}
        {isStory && (
          <div className="dialogue-portrait">
            <div className="portrait-glow-ring" />
            <div className="portrait-avatar">
              <span className="portrait-initial">P</span>
            </div>
            <span className="portrait-name">{speaker}</span>
          </div>
        )}

        <div className="dialogue-body">
          {/* Scene progress dots */}
          {isStory && totalScenes > 0 && (
            <div className="scene-dots">
              {Array.from({ length: totalScenes }).map((_, i) => (
                <span
                  key={i}
                  className={`scene-dot ${i === sceneIndex ? 'active' : i < sceneIndex ? 'done' : ''}`}
                />
              ))}
            </div>
          )}

          <p className="dialogue-text">{dialogue}</p>

          {isStory && (
            <div className="dialogue-actions">
              <button className="dialogue-next" onClick={handleNext}>
                {isLastScene ? '🚀 Explore City' : 'Next →'}
                <span className="hint-keys">Tab / Enter / Space</span>
              </button>
              <button className="dialogue-skip" onClick={handleSkip}>
                Skip Story
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
