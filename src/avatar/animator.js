/**
 * animator.js — Avatar Animation State Machine
 *
 * CRITICAL DESIGN NOTE on walkPhase:
 *   walkPhase is stored on the `ctx` object directly (ctx.walkPhase).
 *   States must use `ctx.walkPhase` — NOT destructure it — so increments persist.
 *
 * Walk animation bone chain (all rotation.x unless stated):
 *
 *   legGrp.rotation.x  = ±swing         (hip pivot, mesh hangs below)
 *   shinGrp.rotation.x = flex >= 0      (knee pivot: positive bends foot FORWARD)
 *   armGrp.rotation.x  = ∓swing×0.55   (shoulder pivot, counter to leg)
 *   foreGrp.rotation.x = follow         (elbow, small)
 *
 * Sign convention (Three.js, leg group pivot at hip, mesh at y=-0.3):
 *   rotation.x positive → bottom of limb moves BACKWARD  (leg going back)
 *   rotation.x negative → bottom of limb moves FORWARD   (leg stepping forward)
 *
 * So for natural walk:
 *   leftLegGrp.rotation.x  =  sin(phase) * MAX   → positive = leg behind
 *   rightLegGrp.rotation.x = -sin(phase) * MAX   → negative = leg behind (opposite)
 *   leftShinGrp.rotation.x  = max(0, sin(phase)) * KNEE   → flex when leg is BEHIND
 *   rightShinGrp.rotation.x = max(0,-sin(phase)) * KNEE   → flex when leg is BEHIND
 */

const lerp   = (a, b, t) => a + (b - a) * Math.min(1, t);
const clamp  = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ─── IDLE ─────────────────────────────────────────────────────
const STATE_IDLE = {
  name: 'IDLE',
  enter(_ctx) {},
  update(ctx, dt, t) {
    const B = ctx.bones;

    // Breathing body bob
    const breath = Math.sin(t * 1.4) * 0.048;
    B.bodyGrp.position.y = lerp(B.bodyGrp.position.y, 0.55 + breath, 5 * dt);

    // Head lazy look-around
    B.headGrp.rotation.y = Math.sin(t * 0.48) * 0.2;
    B.headGrp.rotation.x = Math.sin(t * 0.33) * 0.07;

    // Arms gentle sway at sides
    B.leftArmGrp.rotation.x  = lerp(B.leftArmGrp.rotation.x,  Math.sin(t * 1.1)     * 0.09, 3 * dt);
    B.rightArmGrp.rotation.x = lerp(B.rightArmGrp.rotation.x, Math.sin(t * 1.1 + 1) * 0.09, 3 * dt);
    B.leftArmGrp.rotation.z  = lerp(B.leftArmGrp.rotation.z,   0.14, 4 * dt);
    B.rightArmGrp.rotation.z = lerp(B.rightArmGrp.rotation.z, -0.14, 4 * dt);

    // Reset legs straight
    B.leftLegGrp.rotation.x  = lerp(B.leftLegGrp.rotation.x,  0, 6 * dt);
    B.rightLegGrp.rotation.x = lerp(B.rightLegGrp.rotation.x, 0, 6 * dt);
    B.leftShinGrp.rotation.x  = lerp(B.leftShinGrp.rotation.x,  0, 6 * dt);
    B.rightShinGrp.rotation.x = lerp(B.rightShinGrp.rotation.x, 0, 6 * dt);
    B.leftForeGrp.rotation.x  = lerp(B.leftForeGrp.rotation.x,  0, 4 * dt);
    B.rightForeGrp.rotation.x = lerp(B.rightForeGrp.rotation.x, 0, 4 * dt);

    // Aura pulse
    const ap = 1 + Math.sin(t * 2.8) * 0.13;
    ctx.aura.scale.set(ap, 1, ap);
    ctx.root.position.y = breath * 0.5;
  },
  exit(_ctx) {},
};

// ─── WALK ─────────────────────────────────────────────────────
const STATE_WALK = {
  name: 'WALK',
  enter(ctx) { /* keep existing walkPhase */ },
  update(ctx, dt, _t) {
    // ── Advance phase ──────────────────────────────────────────
    ctx.walkPhase += dt * 3.0;    // ~3 rad/s  (tune for speed feel)

    const phase = ctx.walkPhase;
    const B     = ctx.bones;

    // ── PRIMARY LEG SWING ──────────────────────────────────────
    // MAX_LEG = 0.52 rad ≈ 30°  — visible but not exaggerated
    const MAX_LEG  = 0.52;
    const legSwing = Math.sin(phase) * MAX_LEG;

    //  leftLeg forward (+sin, negative x = forward in our rig? Let's test:)
    //  We flip so that legSwing>0 → left leg swings FORWARD (-x based on mesh offset)
    B.leftLegGrp.rotation.x  = -legSwing;   // forward when positive
    B.rightLegGrp.rotation.x =  legSwing;   // backward when positive

    // ── SHIN / KNEE BEND ───────────────────────────────────────
    // Knee bends when the leg is BEHIND the body (trailing phase).
    // Left leg is BEHIND when leftLegGrp.rotation.x > 0  →  legSwing > 0
    // Positive shin rotation = foot swings forward (natural knee flex).
    const MAX_KNEE = 0.72;   // ≈ 41° — strong visible bend
    B.leftShinGrp.rotation.x  = clamp(legSwing,  0, 1) * MAX_KNEE;
    B.rightShinGrp.rotation.x = clamp(-legSwing, 0, 1) * MAX_KNEE;

    // ── ARM COUNTER-SWING ──────────────────────────────────────
    const MAX_ARM  = 0.38;
    const armSwing = Math.sin(phase) * MAX_ARM;

    // Arms opposite to same-side leg
    B.leftArmGrp.rotation.x  =  armSwing;   // left arm: back when left leg forward
    B.rightArmGrp.rotation.x = -armSwing;   // right arm: forward
    B.leftArmGrp.rotation.z  =  0.14;
    B.rightArmGrp.rotation.z = -0.14;

    // ── FOREARM natural hang ───────────────────────────────────
    // When arm swings forward (negative x), forearm bends slightly down
    const MAX_FORE = 0.25;
    B.leftForeGrp.rotation.x  = clamp(-armSwing, 0, 1) * MAX_FORE;
    B.rightForeGrp.rotation.x = clamp( armSwing, 0, 1) * MAX_FORE;

    // ── TORSO anti-twist ───────────────────────────────────────
    B.bodyGrp.rotation.y = Math.sin(phase) * 0.07;

    // ── BODY BOB ───────────────────────────────────────────────
    // Two bounces per full stride (abs of sin)
    const bob = Math.abs(Math.sin(phase)) * 0.07;
    B.bodyGrp.position.y = 0.55 + bob;
    ctx.root.position.y  = bob * 0.4;

    // ── HEAD stays level ───────────────────────────────────────
    B.headGrp.rotation.x = lerp(B.headGrp.rotation.x, 0, 6 * dt);
    B.headGrp.rotation.y = lerp(B.headGrp.rotation.y, 0, 6 * dt);

    // ── AURA follows bob ───────────────────────────────────────
    const ap = 1.05;
    ctx.aura.scale.set(ap, 1, ap);
  },
  exit(_ctx) {},
};

// ─── GREET ────────────────────────────────────────────────────
const STATE_GREET = {
  name: 'GREET',
  enter(ctx) { ctx.greetTimer = 0; },
  update(ctx, dt, t) {
    ctx.greetTimer += dt;
    const B = ctx.bones;

    // Stand still
    B.leftLegGrp.rotation.x  = lerp(B.leftLegGrp.rotation.x,  0, 7 * dt);
    B.rightLegGrp.rotation.x = lerp(B.rightLegGrp.rotation.x, 0, 7 * dt);
    B.leftShinGrp.rotation.x  = lerp(B.leftShinGrp.rotation.x,  0, 7 * dt);
    B.rightShinGrp.rotation.x = lerp(B.rightShinGrp.rotation.x, 0, 7 * dt);
    B.bodyGrp.position.y     = lerp(B.bodyGrp.position.y, 0.55, 5 * dt);
    B.bodyGrp.rotation.y     = lerp(B.bodyGrp.rotation.y, 0, 5 * dt);

    // Left arm relaxed at side
    B.leftArmGrp.rotation.x = lerp(B.leftArmGrp.rotation.x, 0, 5 * dt);
    B.leftArmGrp.rotation.z = lerp(B.leftArmGrp.rotation.z, 0.14, 4 * dt);
    B.leftForeGrp.rotation.x = lerp(B.leftForeGrp.rotation.x, 0, 5 * dt);

    // RIGHT ARM — raises fully then waves
    // Phase 1 (0..0.3s): arm raises to -1.9 rad (pointing up)
    const raiseT = clamp(ctx.greetTimer / 0.35, 0, 1);
    B.rightArmGrp.rotation.x = lerp(B.rightArmGrp.rotation.x, -1.9 * raiseT, 7 * dt);
    B.rightArmGrp.rotation.z = lerp(B.rightArmGrp.rotation.z, -0.25 * raiseT, 5 * dt);

    // Wave: forearm rocks side-to-side (rotation.z)
    if (ctx.greetTimer > 0.3) {
      B.rightForeGrp.rotation.z = Math.sin(t * 9.5) * 0.48;
    }

    // Head nods hello
    B.headGrp.rotation.x = Math.sin(t * 4.2) * 0.13;
    B.headGrp.rotation.y = Math.sin(t * 0.85) * 0.18;

    // Aura excited pulse
    const ap = 1 + Math.sin(t * 5) * 0.2;
    ctx.aura.scale.set(ap, 1, ap);
    ctx.root.position.y = Math.abs(Math.sin(t * 3.5)) * 0.05;
  },
  exit(ctx) {
    ctx.greetTimer = 0;
    const B = ctx.bones;
    // Reset right arm
    B.rightForeGrp.rotation.z = 0;
    B.rightArmGrp.rotation.z  = -0.14;
  },
};

// ─── ARRIVE ───────────────────────────────────────────────────
const STATE_ARRIVE = {
  name: 'ARRIVE',
  enter(ctx) { ctx.arriveTimer = 0; },
  update(ctx, dt, _t) {
    ctx.arriveTimer += dt;
    const at = ctx.arriveTimer;
    const B  = ctx.bones;

    // Quick celebratory hop (0..0.5s up, 0.5..0.8s down)
    const hopDur = 0.55;
    const hop = at < hopDur
      ? Math.sin((at / hopDur) * Math.PI) * 0.42
      : 0;
    ctx.root.position.y = hop;

    // Knees bend on landing (0.55..0.85s)
    const landingT = clamp((at - hopDur) / 0.3, 0, 1);
    const crouchY  = landingT < 0.5
      ? Math.sin(landingT * Math.PI) * 0.09    // dip down
      : 0;
    B.bodyGrp.position.y = lerp(B.bodyGrp.position.y, 0.55 - crouchY, 8 * dt);

    // Both shins bend on landing
    const kneeFlex = landingT < 0.5 ? Math.sin(landingT * Math.PI) * 0.55 : 0;
    B.leftShinGrp.rotation.x  = lerp(B.leftShinGrp.rotation.x,  kneeFlex, 10 * dt);
    B.rightShinGrp.rotation.x = lerp(B.rightShinGrp.rotation.x, kneeFlex, 10 * dt);

    // Arms spread slightly on arrival
    B.leftArmGrp.rotation.z  = lerp(B.leftArmGrp.rotation.z,  0.38, 5 * dt);
    B.rightArmGrp.rotation.z = lerp(B.rightArmGrp.rotation.z, -0.38, 5 * dt);

    // Aura burst on landing
    const burst = 1 + Math.max(0, (0.8 - at)) * 0.5;
    ctx.aura.scale.set(burst, 1, burst);

    B.headGrp.rotation.y = lerp(B.headGrp.rotation.y, 0, 6 * dt);
    B.headGrp.rotation.x = lerp(B.headGrp.rotation.x, 0, 6 * dt);
  },
  exit(ctx) {
    ctx.arriveTimer = 0;
    ctx.bones.leftArmGrp.rotation.z  =  0.14;
    ctx.bones.rightArmGrp.rotation.z = -0.14;
  },
};

// ─── State Machine ────────────────────────────────────────────
const STATES = {
  IDLE:   STATE_IDLE,
  WALK:   STATE_WALK,
  GREET:  STATE_GREET,
  ARRIVE: STATE_ARRIVE,
};

export class AvatarAnimator {
  constructor(bones, aura, root) {
    this._ctx = {
      bones,
      aura,
      root,
      walkPhase:    0,
      greetTimer:   0,
      arriveTimer:  0,
    };
    this._state = STATE_IDLE;
    this._state.enter(this._ctx);
  }

  get stateName() { return this._state.name; }

  transition(name) {
    const next = STATES[name];
    if (!next || this._state === next) return;
    this._state.exit(this._ctx);
    this._state = next;
    this._state.enter(this._ctx);
  }

  update(dt, t) {
    this._state.update(this._ctx, dt, t);
  }
}
