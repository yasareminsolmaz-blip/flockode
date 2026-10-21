import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

import { useProgress } from '../store/Progress';

// Four short, quiet sheep sounds (scripts/make-sounds.py). Played only at key moments:
// start  – the flock starts running the code
// win    – the whole flock is in the barn
// fail   – some sheep can never reach the barn
// bump   – a sheep bumps into a fence (played at most once per step)
const SOURCES = {
  start: require('../../assets/sounds/start.wav'),
  win: require('../../assets/sounds/win.wav'),
  fail: require('../../assets/sounds/fail.wav'),
  bump: require('../../assets/sounds/bump.wav'),
};
export type SoundName = keyof typeof SOURCES;

// Loudness is set in the files themselves (scripts/make-sounds.py), so players need no volume changes.

/** Called once at app start: respect the device's silent mode and never stop other audio. */
export function configureAudio() {
  setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' }).catch(() => {});
}

export function useSounds() {
  const { sound } = useProgress();
  const start = useAudioPlayer(SOURCES.start);
  const win = useAudioPlayer(SOURCES.win);
  const fail = useAudioPlayer(SOURCES.fail);
  const bump = useAudioPlayer(SOURCES.bump);

  const play = useCallback(
    (name: SoundName) => {
      if (!sound) return;
      const p = { start, win, fail, bump }[name];
      try {
        p.seekTo(0).catch(() => {});
        p.play();
      } catch {
        // Sound is a nice-to-have; never let it break the game.
      }
    },
    [sound, start, win, fail, bump],
  );

  return { play };
}
