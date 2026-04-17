/**
 * App.jsx — Root component
 * Renders Canvas + all UI overlays
 */
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import SceneManager from './core/SceneManager';
import Splash       from './ui/Splash';
import DialogueBox  from './ui/DialogueBox';
import InfoPanel    from './ui/InfoPanel';
import ModeSwitch   from './ui/ModeSwitch';
import HUDTop       from './ui/HUDTop';
import Minimap      from './ui/Minimap';

import useStore     from './store/useStore';
import { nextStoryScene } from './story/storyRunner';

export default function App() {
  const mode = useStore(s => s.mode);

  useEffect(() => {
    function handleStoryAdvance(e) {
      const isAdvanceKey = e.key === 'Tab' || e.key === 'Enter' || e.key === ' ';
      if (!isAdvanceKey) return;
      if (useStore.getState().mode !== 'story') return;
      e.preventDefault();
      nextStoryScene();
    }

    window.addEventListener('keydown', handleStoryAdvance);
    return () => window.removeEventListener('keydown', handleStoryAdvance);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>

      {/* ── 3D Canvas ── */}
      <Canvas
        camera={{ position: [0, 28, 38], fov: 58, near: 0.5, far: 500 }}
        dpr={[1, 1.25]}
        shadows
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#6e8ca8' }}
      >
        <Suspense fallback={null}>
          <SceneManager />
        </Suspense>
      </Canvas>

      {/* ── UI Overlays (only when world is active) ── */}
      {mode !== 'loading' && (
        <>
          <HUDTop />
          <ModeSwitch />
          <DialogueBox />
          <InfoPanel />
          <Minimap />

        </>
      )}

      {/* ── Splash / Intro ── */}
      {mode === 'loading' && <Splash />}
    </div>
  );
}
