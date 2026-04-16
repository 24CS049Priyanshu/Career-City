/** hud.js — HUDManager: zone indicator + nav buttons */
import { ZONES } from '../data/content.js';

export class HUDManager {
  constructor(onNavigate) {
    this._onNavigate = onNavigate;
    this._zoneDot    = document.getElementById('zone-dot');
    this._zoneLabel  = document.getElementById('zone-label');
    this._navBtns    = document.querySelectorAll('.nav-btn');

    this._navBtns.forEach(btn => {
      btn.addEventListener('click', () => onNavigate(btn.dataset.zone));
    });
  }

  show() {
    ['hud-top','controls-hint','minimap'].forEach(id => {
      document.getElementById(id)?.classList.remove('hidden');
    });
  }

  setZone(key) {
    const z = ZONES[key];
    if (!z) {
      this._zoneLabel.textContent = 'World Hub';
      this._zoneDot.style.background = 'var(--c-cyan)';
      this._zoneDot.style.boxShadow  = '';
    } else {
      this._zoneLabel.textContent = z.label;
      this._zoneDot.style.background = z.hex;
      this._zoneDot.style.boxShadow  = `0 0 8px ${z.hex}`;
    }
    this._navBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.zone === key);
    });
  }
}
