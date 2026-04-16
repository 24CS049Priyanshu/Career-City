/** panels.js — PanelManager: slide-in info panels */
import { PANELS } from '../data/content.js';

export class PanelManager {
  constructor() {
    this._panel = document.getElementById('info-panel');
    this._body  = document.getElementById('panel-body');
    document.getElementById('panel-close').addEventListener('click', () => this.close());
    window.addEventListener('keydown', e => { if (e.code === 'Escape') this.close(); });
  }

  open(zoneKey) {
    const html = PANELS[zoneKey];
    if (!html) return;
    this._body.innerHTML = html;
    this._panel.classList.remove('hidden');

    // Animate skill bars after DOM paint
    requestAnimationFrame(() => {
      this._panel.querySelectorAll('.sfill').forEach(el => {
        el.style.width = el.dataset.w + '%';
      });
      this._startCodeStream();
    });
  }

  close() {
    this._panel.classList.add('hidden');
  }

  _startCodeStream() {
    const el = document.getElementById('code-stream-el');
    if (!el) return;
    const lines = [
      '> skill.load("C++")         // OOP·STL·Templates',
      '> skill.load("Python")      // NumPy·Pandas·Flask',
      '> skill.load("IoT")         // MQTT·ESP32·I2C·SPI',
      '> skill.load("React")       // Hooks·Redux·Socket.io',
      '> matrix.compile()          // All systems nominal ✓',
    ];
    let i = 0;
    el.textContent = '';
    const iv = setInterval(() => {
      if (i >= lines.length) { clearInterval(iv); return; }
      el.textContent += lines[i++] + '\n';
      el.scrollTop = el.scrollHeight;
    }, 620);
  }
}
