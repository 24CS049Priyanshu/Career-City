/**
 * storyRunner.js — Module-level singleton, no React lifecycle dependency.
 * Call startStory() / skipStory() from any component.
 */
import useStore from '../store/useStore';
import { SCENES } from './scenes';

let _idx   = 0;
let _running = false;

function runScene() {
  if (_idx >= SCENES.length) {
    finish();
    return;
  }

  const scene = SCENES[_idx];
  const store = useStore.getState();

  store.setAvatarTarget(scene.target);
  store.setDialogue(`${scene.dialogue}  ·  Press Tab / Enter / Space to continue`);
}

export function startStory() {
  skipStory(); // clear any existing story
  _idx     = 0;
  _running = true;

  const store = useStore.getState();
  store.setMode('story');
  store.clearDialogue();
  runScene();
}

export function nextStoryScene() {
  if (!_running) return;
  _idx++;
  runScene();
}

export function skipStory() {
  _running = false;
}

export function finishStory() {
  finish();
}

function finish() {
  _running = false;
  const store = useStore.getState();
  store.setMode('free');
  store.clearDialogue();
  store.setAvatarTarget([0, 0, 8]);

  setTimeout(() => {
    useStore.getState().setDialogue('🎮 City is yours! Walk around and click buildings to explore.');
    setTimeout(() => useStore.getState().clearDialogue(), 5000);
  }, 400);
}
