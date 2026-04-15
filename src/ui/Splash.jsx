/**
 * Splash.jsx — Intro splash with Story / Free Explore selection
 */
import { startStory, skipStory } from '../story/storyRunner';
import useStore from '../store/useStore';
import { OWNER } from '../utils/constants';

export default function Splash() {
  const { setMode, setDialogue, setAvatarTarget, clearDialogue } = useStore();

  function handleStory() {
    startStory(); // handles setMode('story') internally
  }

  function handleFree() {
    skipStory();
    setMode('free');
    setAvatarTarget([0, 0, 8]);
    setTimeout(() => {
      setDialogue('🎮 Free Explore — walk around and click buildings!');
      setTimeout(clearDialogue, 5000);
    }, 400);
  }

  return (
    <div className="splash">
      <div className="splash-content">
        <div style={{ position:'relative', width:110, height:110, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {[110, 80, 52].map((sz, i) => (
            <div key={i} style={{
              position:'absolute', width:sz, height:sz,
              borderRadius:'50%',
              border:`1.5px solid rgba(0,240,255,${0.5 - i*0.12})`,
              animation:`spinRing ${2 + i*0.8}s linear infinite${i===1?' reverse':''}`,
            }} />
          ))}
        </div>

        <h1 className="splash-title">CAREER CITY</h1>
        <p className="splash-name">{OWNER.name}</p>
        <p className="splash-tagline">"{OWNER.tagline}"</p>
        <p className="splash-desc">
          A 3D interactive city where each district tells part of a professional story.
          Take the guided tour or explore at your own pace.
        </p>

        <div className="splash-btns">
          <button className="btn-story" onClick={handleStory}>🎬 Story Mode</button>
          <button className="btn-free"  onClick={handleFree}>🎮 Free Explore</button>
        </div>

        <p style={{ fontSize:11, color:'#2a4060', fontFamily:'var(--font-code)', marginTop:8 }}>
          Click buildings to interact · WASD to move freely
        </p>
      </div>

      <style>{`@keyframes spinRing { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}
