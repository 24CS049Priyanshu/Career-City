/**
 * StoryController.js — Manages guided story progression
 */
import { SCENES } from './scenes';

export class StoryController {
  constructor(store) {
    this.store   = store;
    this.idx     = 0;
    this.running = false;
    this._timer  = null;
  }

  start() {
    this.running = true;
    this.idx     = 0;
    this._runScene();
  }

  _runScene() {
    if (this.idx >= SCENES.length) {
      this._finish();
      return;
    }

    const scene = SCENES[this.idx];
    const { setAvatarTarget, setDialogue } = this.store;

    // Move avatar
    setAvatarTarget(scene.target);

    // Show dialogue after 1s (give avatar time to start walking)
    this._timer = setTimeout(() => {
      setDialogue(scene.dialogue);

      // Advance after duration
      this._timer = setTimeout(() => {
        this.idx++;
        this._runScene();
      }, scene.duration);
    }, 1000);
  }

  _finish() {
    this.running = false;
    this.store.setMode('free');
    this.store.clearDialogue();
    setTimeout(() => {
      this.store.setDialogue('🎮 Free Explore unlocked! Walk around and click buildings.');
      setTimeout(() => this.store.clearDialogue(), 5000);
    }, 500);
  }

  skip() {
    clearTimeout(this._timer);
    this._finish();
  }
}
