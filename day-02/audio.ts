import { useCallback, useEffect } from 'react';

import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';

export type ChimeId =
  | 'clay'
  | 'dots'
  | 'cobalt'
  | 'crescent'
  | 'pebble'
  | 'star';

export const useChimes = () => {
  const clay = useAudioPlayer(require('./assets/chimes/clay.wav'), {
    keepAudioSessionActive: true,
  });
  const dots = useAudioPlayer(require('./assets/chimes/dots.wav'), {
    keepAudioSessionActive: true,
  });
  const cobalt = useAudioPlayer(require('./assets/chimes/cobalt.wav'), {
    keepAudioSessionActive: true,
  });
  const crescent = useAudioPlayer(require('./assets/chimes/crescent.wav'), {
    keepAudioSessionActive: true,
  });
  const pebble = useAudioPlayer(require('./assets/chimes/pebble.wav'), {
    keepAudioSessionActive: true,
  });
  const star = useAudioPlayer(require('./assets/chimes/star.wav'), {
    keepAudioSessionActive: true,
  });

  useEffect(() => {
    setAudioModeAsync({
      interruptionMode: 'mixWithOthers',
      playsInSilentMode: false,
      shouldPlayInBackground: false,
    }).catch(() => undefined);
  }, []);

  return useCallback(
    (id: ChimeId, intensity = 0.3) => {
      const players = { clay, dots, cobalt, crescent, pebble, star };
      const player = players[id];
      player.volume = Math.min(0.3, 0.08 + intensity * 0.22);
      player
        .seekTo(0)
        .then(() => player.play())
        .catch(() => undefined);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(
        () => undefined,
      );
    },
    [clay, cobalt, crescent, dots, pebble, star],
  );
};
