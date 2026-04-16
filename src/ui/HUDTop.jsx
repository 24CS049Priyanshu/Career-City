/**
 * HUDTop.jsx — Top bar: logo, zone indicator, controls hint
 */
import useStore from '../store/useStore';
import { ZONES } from '../utils/constants';

export default function HUDTop() {
  const activeZone = useStore(s => s.activeZone);
  const zone       = activeZone ? ZONES[activeZone] : null;

  return (
    <div className="hud hud-top">
      <div className="hud-logo">
        CAREER CITY
        <span>· Priya Sharma</span>
      </div>

      <div className="hud-zone">
        <div
          className="zone-dot"
          style={{ background: zone?.color ?? 'var(--c-cyan)', boxShadow: `0 0 8px ${zone?.color ?? 'var(--c-cyan)'}` }}
        />
        {zone ? zone.label : 'World Hub'}
      </div>

      <div className="hud-controls">
        <span className="ctrl-key">WASD</span> Move &nbsp;
        <span className="ctrl-key">Click</span> Interact &nbsp;
        <span className="ctrl-key">Esc</span> Close
      </div>
    </div>
  );
}
