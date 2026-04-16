/** input.js — keyboard + pointer input manager */
export class InputManager {
  constructor(canvas, clickables, onHit) {
    this.keys      = {};
    this.clickables = clickables;
    this.onHit     = onHit;
    this._ray = new THREE.Raycaster();
    this._mouse = new THREE.Vector2();
    this._canvas = canvas;

    window.addEventListener('keydown', e => { this.keys[e.code] = true;  });
    window.addEventListener('keyup',   e => { this.keys[e.code] = false; });
    canvas.addEventListener('click',   e => this._onClick(e));
  }

  isDown(code) { return !!this.keys[code]; }

  _onClick(e) {
    const r = this._canvas.getBoundingClientRect();
    this._mouse.x =  ((e.clientX - r.left) / r.width)  * 2 - 1;
    this._mouse.y = -((e.clientY - r.top)  / r.height) * 2 + 1;
    this._ray.setFromCamera(this._mouse, window.__ncvCamera);
    const hits = this._ray.intersectObjects(this.clickables, false);
    if (hits.length) this.onHit(hits[0].object);
  }
}
