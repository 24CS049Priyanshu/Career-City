/**
 * Splash.jsx — Priyanshu Macwan intro screen with real CV details
 */
import { startStory, skipStory } from '../story/storyRunner';
import useStore from '../store/useStore';
import { OWNER } from '../utils/constants';

export default function Splash() {
  const { setMode, setDialogue, setAvatarTarget, clearDialogue } = useStore();

  function handleStory() {
    startStory();
  }

  function handleFree() {
    skipStory();
    setMode('free');
    setAvatarTarget([0, 0, 8]);
    setTimeout(() => {
      setDialogue('🎮 Free Explore — WASD / Arrow keys to move, click buildings to explore!');
      setTimeout(clearDialogue, 6000);
    }, 400);
  }

  return (
    <div className="splash">
      <div className="splash-content">

        {/* Animated rings */}
        <div className="splash-rings">
          {[110, 80, 52].map((sz, i) => (
            <div key={i} className="splash-ring" style={{
              width: sz, height: sz,
              animationDuration: `${2 + i * 0.9}s`,
              animationDirection: i === 1 ? 'reverse' : 'normal',
              borderColor: `rgba(0,240,255,${0.55 - i * 0.13})`,
            }} />
          ))}
          <div className="splash-ring-center">
            <span>💻</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="splash-title">CAREER CITY</h1>

        {/* Real name */}
        <p className="splash-name">{OWNER.name}</p>

        {/* Tags row */}
        <div className="splash-tags">
          <span className="splash-tag tag-blue">B.Tech CSE 2028</span>
          <span className="splash-tag tag-cyan">IoT Builder</span>
          <span className="splash-tag tag-gold">GATE Aspirant</span>
        </div>

        {/* Tagline */}
        <p className="splash-tagline">"{OWNER.tagline}"</p>

        {/* Description */}
        <p className="splash-desc">
          A 3D interactive career city built from real CV data —
          IoT systems, React PWAs, hackathon projects, digital electronics.
          Take the guided story tour or freely explore every district.
        </p>

        {/* College + graduation */}
        <p className="splash-college">
          📚 {OWNER.college} &nbsp;·&nbsp; {OWNER.graduation}
        </p>

        {/* CTA buttons */}
        <div className="splash-btns">
          <button className="btn-story" onClick={handleStory}>
            🎬 Story Mode
          </button>
          <button className="btn-free" onClick={handleFree}>
            🎮 Free Explore
          </button>
        </div>

        <p className="splash-hint">
          WASD / Arrow Keys to walk &nbsp;·&nbsp; Click buildings to interact
        </p>
      </div>

      <style>{`
        @keyframes spinRing { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
