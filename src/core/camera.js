/**
 * camera.js — CameraController
 *
 * Modes:
 *   ORBIT  - slow auto-orbit around hub (idle state)
 *   FOLLOW - smooth follow behind moving avatar
 *   ZONE   - frame avatar + zone platform after arrival
 */
export class CameraController {
  constructor(camera) {
    this.cam    = camera;
    this.mode   = 'ORBIT';
    this._focus = new THREE.Vector3(0, 1.8, 0); // smoothed look-at target
    this._orbitAngle = 0;
    this._orbitR     = 20;

    // Runtime references set by main
    this.avatarGroup = null;
    this.activeZonePos = null;
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
  }

  update(dt) {
    const { cam, mode } = this;

    if (mode === 'ORBIT') {
      this._orbitAngle += dt * 0.05;
      const tx = Math.sin(this._orbitAngle) * this._orbitR;
      const tz = Math.cos(this._orbitAngle) * this._orbitR;
      cam.position.x += (tx - cam.position.x) * Math.min(1, 1.8 * dt);
      cam.position.y += (12  - cam.position.y) * Math.min(1, 1.8 * dt);
      cam.position.z += (tz - cam.position.z) * Math.min(1, 1.8 * dt);
      this._focus.lerp(new THREE.Vector3(0, 1.8, 0), 3 * dt);
      cam.lookAt(this._focus);
    }

    else if (mode === 'FOLLOW') {
      if (!this.avatarGroup) return;
      const av = this.avatarGroup;
      // Position behind and above avatar based on its facing
      const dir = new THREE.Vector3(Math.sin(av.rotation.y), 0, Math.cos(av.rotation.y));
      const desired = av.position.clone()
        .sub(dir.clone().multiplyScalar(11))
        .add(new THREE.Vector3(0, 7.5, 0));

      cam.position.lerp(desired, Math.min(1, 6 * dt));
      this._focus.lerp(av.position.clone().add(new THREE.Vector3(0, 2.5, 0)), Math.min(1, 8 * dt));
      cam.lookAt(this._focus);
    }

    else if (mode === 'ZONE') {
      if (!this.avatarGroup || !this.activeZonePos) return;
      const av  = this.avatarGroup;
      const zp  = this.activeZonePos;
      // Position camera offset behind avatar, angled to show zone
      const mid  = av.position.clone().lerp(zp, 0.3);
      const back = new THREE.Vector3(0, 9.5, 12);
      const desired = mid.clone().add(back);
      cam.position.lerp(desired, Math.min(1, 2.5 * dt));
      this._focus.lerp(av.position.clone().add(new THREE.Vector3(0, 2, 0)), Math.min(1, 4 * dt));
      cam.lookAt(this._focus);
    }
  }

  /** Move camera by WASD — only active when user presses keys */
  applyKeyMovement(input, dt) {
    const speed = 12 * dt;
    const forward = new THREE.Vector3(
      -Math.sin(this.cam.rotation.y), 0, -Math.cos(this.cam.rotation.y)
    );
    const right = new THREE.Vector3(
      Math.cos(this.cam.rotation.y), 0, -Math.sin(this.cam.rotation.y)
    );
    if (input.isDown('KeyW')) this.cam.position.addScaledVector(forward,  speed);
    if (input.isDown('KeyS')) this.cam.position.addScaledVector(forward, -speed);
    if (input.isDown('KeyA')) this.cam.position.addScaledVector(right,   -speed);
    if (input.isDown('KeyD')) this.cam.position.addScaledVector(right,    speed);
    this.cam.position.y = Math.max(2.5, this.cam.position.y);
  }
}
