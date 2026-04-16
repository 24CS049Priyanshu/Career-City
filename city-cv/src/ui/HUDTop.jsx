/**
 * HUDTop.jsx — Top bar with correct name, story-mode pulsing badge, controls hint
 */
import useStore from '../store/useStore';
import { ZONES } from '../utils/constants';

export default function HUDTop() {
  const activeZone = useStore(s => s.activeZone);
  const mode       = useStore(s => s.mode);
  const sceneMeta  = useStore(s => s.sceneMeta);
  const zone       = activeZone ? ZONES[activeZone] : null;

  const sceneNum = sceneMeta ? sceneMeta.sceneIndex + 1 : null;
  const total    = sceneMeta?.totalScenes ?? 0;

  return (
    <div className="hud hud-top">
      <div className="hud-logo">
        CAREER CITY
        <span>· Priyanshu Macwan</span>
      </div>

      <div className="hud-center">
        <div className="hud-zone">
          <div
            className="zone-dot"
            style={{
              background: zone?.color ?? 'var(--c-cyan)',
              boxShadow: `0 0 8px ${zone?.color ?? 'var(--c-cyan)'}`,
            }}
          />
          {zone ? zone.label : 'World Hub'}
        </div>

        {/* Story mode badge — pulses */}
        {mode === 'story' && (
          <div className="story-badge">
            🎬 Story Mode
            {sceneNum && (
              <span className="story-badge-scene">{sceneNum}/{total}</span>
            )}
          </div>
        )}
      </div>

      <div className="hud-controls">
        <span className="ctrl-key">WASD</span> Move &nbsp;
        <span className="ctrl-key">↑↓←→</span> Also moves &nbsp;
        <span className="ctrl-key">Click</span> Interact &nbsp;
        <span className="ctrl-key">Tab</span> Next Scene
      </div>
    </div>
  );
}
