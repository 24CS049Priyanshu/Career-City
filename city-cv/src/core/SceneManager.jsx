/**
 * SceneManager.jsx — THE FIX:
 * 
 * KEY BUG WAS: <group ref={avatarRef} position={[0, 0, 8]}>
 * Every time avatarTarget changed in the store, SceneManager re-rendered
 * and R3F re-applied position=[0,0,8], snapping the avatar back!
 *
 * FIX: Use useStore.subscribe() (imperative, no re-render) so the store
 * subscription only updates a ref — SceneManager NEVER re-renders from
 * avatarTarget changes. The group has NO position prop; position is
 * initialized once via useEffect.
 */
import { useRef, useEffect }  from 'react';
import Lighting               from './Lighting';
import CityMap                from '../world/CityMap';
import Avatar                 from '../player/Avatar';
import useMovement            from '../player/useMovement';
import CameraSystem           from '../camera/CameraSystem';
import useZoneDetection       from '../hooks/useZoneDetection';
import useStore               from '../store/useStore';

export default function SceneManager() {
  const avatarRef = useRef();

  // targetRef holds the current avatar destination.
  // We use subscribe() not useStore() so this component NEVER re-renders
  // when avatarTarget changes — eliminating the position reset bug.
  const targetRef = useRef([0, 0, 8]);

  useEffect(() => {
    // Seed from current store value
    targetRef.current = useStore.getState().avatarTarget;

    // Subscribe imperatively — updates ref without triggering re-render
    const unsub = useStore.subscribe(state => {
      targetRef.current = state.avatarTarget;
    });
    return unsub;
  }, []);

  // Set initial avatar position ONCE on mount (not via JSX prop)
  useEffect(() => {
    if (avatarRef.current) {
      avatarRef.current.position.set(0, 0, 8);
    }
  }, []); // Empty deps = runs only once on mount

  // Drive movement (reads targetRef every frame — always fresh)
  useMovement(avatarRef, targetRef);

  // Zone detection
  useZoneDetection(avatarRef);

  function handleAvatarClick() {
    const { mode, setDialogue } = useStore.getState();
    if (mode !== 'loading') {
      setDialogue("👋 I'm Priya's avatar — click the buildings or talk to the NPCs to learn more!");
      setTimeout(() => useStore.getState().clearDialogue(), 5000);
    }
  }

  return (
    <>
      <Lighting />
      <CityMap />

      {/* NO position prop on this group — position is set imperatively on mount */}
      <group ref={avatarRef}>
        <Avatar onAvatarClick={handleAvatarClick} />
      </group>

      <CameraSystem avatarRef={avatarRef} />
    </>
  );
}
