/**
 * storyRunner.js — Story state singleton with typewriter support.
 * Exposes { text, speaker, sceneIndex, totalScenes } via store.
 */
import useStore from '../store/useStore';
import { SCENES } from './scenes';

let _idx     = 0;
let _running = false;
let _twTimer = null;

/** Typewriter: streams text char-by-char into store.dialogue */
function typewrite(fullText) {
  if (_twTimer) clearInterval(_twTimer);
  let i = 0;
  useStore.getState().setDialogue('');
  _twTimer = setInterval(() => {
    i++;
    useStore.getState().setDialogue(fullText.slice(0, i));
    if (i >= fullText.length) clearInterval(_twTimer);
  }, 22);
}

function runScene() {
  if (_idx >= SCENES.length) {
    finish();
    return;
  }

  const scene = SCENES[_idx];
  const store = useStore.getState();

  store.setAvatarTarget(scene.target);
  store.setSceneMeta({
    sceneIndex:   _idx,
    totalScenes:  SCENES.length,
    speaker:      scene.speaker ?? 'Priyanshu',
    lastScene:    !!scene.lastScene,
  });
  typewrite(scene.dialogue);
}

export function startStory() {
  skipStory();
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
  if (_twTimer) { clearInterval(_twTimer); _twTimer = null; }
}

export function finishStory() {
  finish();
}

function finish() {
  _running = false;
  if (_twTimer) { clearInterval(_twTimer); _twTimer = null; }

  const store = useStore.getState();
  store.setMode('free');
  store.clearDialogue();
  store.clearSceneMeta();
  store.setAvatarTarget([0, 0, 8]);

  setTimeout(() => {
    useStore.getState().setDialogue('🎮 Free Explore — WASD/Arrows to walk, click buildings to view CV details!');
    setTimeout(() => useStore.getState().clearDialogue(), 6000);
  }, 400);
}
