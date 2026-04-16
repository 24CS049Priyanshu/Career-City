/**
 * main.js — Neural CV entry point
 *
 * Wires together: renderer · scene · camera · world · avatar · ui
 * Runs the main requestAnimationFrame game loop.
 */

import { createRenderer }    from './core/renderer.js';
import { createScene }       from './core/scene.js';
import { CameraController }  from './core/camera.js';
import { InputManager }      from './core/input.js';
import { buildFloor, buildStars, buildHologram } from './world/floor.js';
import { buildZones, animateRings }  from './world/zones.js';
import { buildParticles, animateParticles } from './world/particles.js';
import { buildAvatar }       from './avatar/avatar.js';
import { AvatarAnimator }    from './avatar/animator.js';
import { HUDManager }        from './ui/hud.js';
import { PanelManager }      from './ui/panels.js';
import { MinimapRenderer }   from './ui/minimap.js';
import { GuideBubble }       from './ui/guide.js';
import { ZONES, GUIDE_TOUR } from './data/content.js';

// ─── Bootstrap Three.js globals ─────────────────────────────
const canvas   = document.getElementById('three-canvas');
const renderer = createRenderer(canvas);
const scene    = createScene();

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 300);
camera.position.set(0, 12, 22);
camera.lookAt(0, 0, 0);
window.__ncvCamera = camera;   // exposed for InputManager raycaster

// ─── World ──────────────────────────────────────────────────
buildFloor(scene);
buildStars(scene);
const hologram  = buildHologram(scene);
const { rings, clickMeshes } = buildZones(scene);
const particles = buildParticles(scene);

// ─── Avatar ─────────────────────────────────────────────────
const clickables = [...clickMeshes];
const { root: avatarRoot, bones, aura } = buildAvatar(scene, clickables);
const animator = new AvatarAnimator(bones, aura, avatarRoot);

// ─── Camera controller ──────────────────────────────────────
const camCtrl = new CameraController(camera);
camCtrl.avatarGroup = avatarRoot;

// ─── UI ─────────────────────────────────────────────────────
const hud     = new HUDManager(navigateToZone);
const panels  = new PanelManager();
const minimap = new MinimapRenderer();
const guide   = new GuideBubble();

// ─── State ──────────────────────────────────────────────────
let activeZone    = null;
let avatarMoving  = false;
let avatarTarget  = null;   // { pos: Vector3, cb: fn }
let guideTourStep = 0;
let worldEntered  = false;

// Zone position lookup
function getZoneVec(key) {
  const [x, y, z] = ZONES[key].pos;
  return new THREE.Vector3(x, y, z);
}

// ─── Navigation ─────────────────────────────────────────────
function navigateToZone(key) {
  if (!worldEntered || !ZONES[key]) return;
  activeZone = key;
  hud.setZone(key);
  panels.close();
  guide.hide();
  moveAvatarTo(getZoneVec(key), () => onAvatarArrived(key));
  camCtrl.setMode('FOLLOW');
}

function onAvatarArrived(key) {
  camCtrl.activeZonePos = getZoneVec(key);
  camCtrl.setMode('ZONE');
  animator.transition('ARRIVE');
  setTimeout(() => {
    animator.transition('IDLE');
    panels.open(key);
    guide.show(`🎯 ${ZONES[key].label} — explore the panel →`);
  }, 900);
}

// ─── Avatar movement ────────────────────────────────────────
function moveAvatarTo(targetPos, cb) {
  avatarTarget = { pos: targetPos.clone().setY(0), cb };
  avatarMoving = true;
  animator.transition('WALK');
  guide.hide();
}

function tickAvatarMovement(dt) {
  if (!avatarMoving || !avatarTarget) return;
  const dir  = avatarTarget.pos.clone().sub(avatarRoot.position);
  const dist = dir.length();

  if (dist < 0.6) {
    avatarRoot.position.copy(avatarTarget.pos);
    avatarMoving = false;
    animator.transition('ARRIVE');
    if (avatarTarget.cb) avatarTarget.cb();
    avatarTarget = null;
    return;
  }

  // Advance position
  const step = Math.min(9 * dt, dist);
  dir.normalize();
  avatarRoot.position.addScaledVector(dir, step);

  // Face direction of travel (smooth turn)
  const targetYaw = Math.atan2(dir.x, dir.z);
  const curYaw    = avatarRoot.rotation.y;
  // Wrap-around lerp
  let delta = targetYaw - curYaw;
  while (delta >  Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  avatarRoot.rotation.y += delta * Math.min(1, 12 * dt);
}

// ─── Click handling ─────────────────────────────────────────
const input = new InputManager(canvas, clickables, (obj) => {
  if (!worldEntered) return;
  if (obj.userData.isAvatar) {
    onAvatarClicked();
  } else if (obj.userData.zone) {
    navigateToZone(obj.userData.zone);
  }
});

function onAvatarClicked() {
  if (avatarMoving) {
    // Greet while walking
    guide.show("🏃 I'm on my way! Click again to guide tour.");
    return;
  }
  animator.transition('GREET');
  guide.show("👋 Click me again to continue the guided tour!");
  setTimeout(() => {
    animator.transition('IDLE');
    const nextZone = GUIDE_TOUR[guideTourStep % GUIDE_TOUR.length];
    guideTourStep++;
    navigateToZone(nextZone);
  }, 2200);
}

// ─── Loading screen ──────────────────────────────────────────
(function simulateLoad() {
  const bar = document.getElementById('loader-bar');
  const pct = document.getElementById('loader-pct');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 12 + 2;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      setTimeout(() => {
        const ls = document.getElementById('loading-screen');
        ls.style.transition = 'opacity 0.8s';
        ls.style.opacity = '0';
        setTimeout(() => {
          ls.style.display = 'none';
          document.getElementById('intro-overlay').classList.remove('hidden');
        }, 800);
      }, 300);
    }
    bar.style.width        = p + '%';
    pct.textContent        = Math.floor(p) + '%';
  }, 110);
})();

document.getElementById('enter-btn').addEventListener('click', () => {
  const ov = document.getElementById('intro-overlay');
  ov.style.transition = 'opacity 0.6s';
  ov.style.opacity    = '0';
  setTimeout(() => {
    ov.classList.add('hidden');
    hud.show();
    worldEntered = true;
    guide.show("👋 Hello! I'm Priya's avatar. Click me to start the guided tour, or use the nav buttons above.", 7000);
    animator.transition('GREET');
    setTimeout(() => animator.transition('IDLE'), 2500);
  }, 600);
});

// ─── Resize ─────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ─── WASD state tracker for camera ──────────────────────────
const keysDown = {};
window.addEventListener('keydown', e => { keysDown[e.code] = true; });
window.addEventListener('keyup',   e => { keysDown[e.code] = false; });
const fakeInput = { isDown: code => !!keysDown[code] };

// ─── Game loop ───────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t  = clock.getElapsedTime();

  // Avatar
  tickAvatarMovement(dt);
  animator.update(dt, t);

  // Camera
  const wasdActive = ['KeyW','KeyS','KeyA','KeyD'].some(k => keysDown[k]);
  if (wasdActive) {
    camCtrl.applyKeyMovement(fakeInput, dt);
    // When user manually flies, suspend auto-camera
  } else if (!avatarMoving && !activeZone) {
    camCtrl.setMode('ORBIT');
  }
  camCtrl.update(dt);

  // World animations
  animateRings(rings, t);
  animateParticles(particles, dt);

  // Hologram spin
  hologram.t1.rotation.y += dt * 0.42;
  hologram.t1.rotation.z += dt * 0.18;
  hologram.t2.rotation.x += dt * 0.32;
  hologram.t2.rotation.y += dt * 0.26;

  // Minimap
  minimap.draw(worldEntered ? avatarRoot : null);

  renderer.render(scene, camera);
}

animate();
