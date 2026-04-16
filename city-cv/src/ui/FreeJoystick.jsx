import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

const MAX_RADIUS = 40;

export default function FreeJoystick() {
  const mode = useStore(s => s.mode);
  const setJoystick = useStore(s => s.setJoystick);
  const draggingRef = useRef(false);
  const baseRef = useRef(null);
  const knobRef = useRef(null);
  const inputRef = useRef({ x: 0, z: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    function tick() {
      if (!mounted) return;
      // Push joystick state at frame cadence for smoother control updates.
      setJoystick({ x: inputRef.current.x, z: inputRef.current.z });
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [setJoystick]);

  if (mode !== 'free') return null;

  function readInput(clientX, clientY) {
    const base = baseRef.current;
    if (!base) return;

    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist > MAX_RADIUS) {
      const s = MAX_RADIUS / dist;
      dx *= s;
      dy *= s;
    }

    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    }

    inputRef.current.x = dx / MAX_RADIUS;
    inputRef.current.z = dy / MAX_RADIUS;
  }

  function stopInput() {
    draggingRef.current = false;
    if (knobRef.current) knobRef.current.style.transform = 'translate(0px, 0px)';
    inputRef.current.x = 0;
    inputRef.current.z = 0;
  }

  function onPointerDown(e) {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    readInput(e.clientX, e.clientY);
  }

  function onPointerMove(e) {
    if (!draggingRef.current) return;
    readInput(e.clientX, e.clientY);
  }

  return (
    <div className="joystick-wrap">
      <div
        ref={baseRef}
        className="joystick-base"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopInput}
        onPointerCancel={stopInput}
      >
        <div ref={knobRef} className="joystick-knob" />
      </div>
    </div>
  );
}
