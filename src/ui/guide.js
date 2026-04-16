/** guide.js — GuideBubble: contextual hint display */
export class GuideBubble {
  constructor() {
    this._el   = document.getElementById('guide-bubble');
    this._text = document.getElementById('guide-text');
    this._tid  = null;
  }

  show(msg, duration = 5500) {
    this._text.textContent = msg;
    this._el.classList.remove('hidden');
    clearTimeout(this._tid);
    this._tid = setTimeout(() => this.hide(), duration);
  }

  hide() {
    this._el.classList.add('hidden');
  }
}
