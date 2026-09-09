import { StyleSheet, View } from 'react-native';

import { useCallback, useRef, useState } from 'react';

import { Canvas } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { usePatternComposer } from 'react-native-pulsar';
import {
  Easing,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { MORPH_DURATION_MS, PAGE_BG, PAGE_MARGIN_FRAC } from './constants';
import { MORPH_PATTERN } from './haptics';
import { PressableToggleIcon } from './pressable-toggle-icon';
import { Reveal } from './reveal';
import { useTextImageMorph } from './use-text-image-morph';

import type { PageVerticalAlignment } from './layout';
import type { PictureContentRect } from './sampling';
import type { DataSourceParam } from '@shopify/react-native-skia';

interface Props {
  width: number;
  height: number;
  image: DataSourceParam;
  paragraph: string;
  interaction?: 'toggle' | 'vertical-scrub';
  pageMarginYFraction?: number;
  pageVerticalAlignment?: PageVerticalAlignment;
  scrubTravelFraction?: number;
  scrubTapDurationMs?: number;
  scrubSettleDurationMs?: number;
  pictureContentRect?: PictureContentRect;
}

const clamp01 = (value: number) => {
  'worklet';
  return Math.max(0, Math.min(1, value));
};

export const TextImageMorph = ({
  width,
  height,
  image,
  paragraph,
  interaction = 'toggle',
  pageMarginYFraction,
  pageVerticalAlignment,
  scrubTravelFraction = 0.56,
  scrubTapDurationMs = 720,
  scrubSettleDurationMs = 720,
  pictureContentRect,
}: Props) => {
  const data = useTextImageMorph({
    image,
    paragraph,
    width,
    height,
    pageMarginYFraction,
    pageVerticalAlignment,
    pictureContentRect,
  });
  const progress = useSharedValue(0); // 0 = page, 1 = picture
  const gestureStart = useSharedValue(0);
  const face = useSharedValue(0);
  const [revealed, setRevealed] = useState(false);
  const reducedMotion = useReducedMotion();
  const lastToggleRef = useRef(0);
  const morphHaptic = usePatternComposer(MORPH_PATTERN);
  const updateRevealed = useCallback((next: boolean) => {
    setRevealed(next);
  }, []);

  const toggle = () => {
    const now = Date.now();
    if (now - lastToggleRef.current < 400) {
      return; // debounce double-fire
    }
    lastToggleRef.current = now;
    const next = !revealed;
    setRevealed(next);
    morphHaptic.play();
    progress.set(
      reducedMotion
        ? next
          ? 1
          : 0
        : withSpring(next ? 1 : 0, {
            dampingRatio: 1,
            duration: MORPH_DURATION_MS,
          }),
    );
    face.set(
      withTiming(next ? 1 : 0, {
        duration: 240,
        easing: Easing.out(Easing.cubic),
      }),
    );
  };

  const verticalPan = Gesture.Pan()
    .enabled(interaction === 'vertical-scrub')
    .minDistance(1)
    .onBegin(() => {
      gestureStart.set(progress.get());
    })
    .onUpdate(event => {
      const travel = Math.max(height * scrubTravelFraction, 280);
      progress.set(clamp01(gestureStart.get() - event.translationY / travel));
    })
    .onEnd(event => {
      const current = progress.get();
      const destination =
        event.velocityY < -420
          ? 1
          : event.velocityY > 420
            ? 0
            : current >= 0.5
              ? 1
              : 0;
      scheduleOnRN(updateRevealed, destination === 1);
      progress.set(
        reducedMotion
          ? destination
          : withTiming(destination, {
              duration: scrubSettleDurationMs,
              easing: Easing.out(Easing.cubic),
            }),
      );
    });

  const scrubTap = Gesture.Tap()
    .enabled(interaction === 'vertical-scrub')
    .onEnd(() => {
      const destination = progress.get() >= 0.5 ? 0 : 1;
      scheduleOnRN(updateRevealed, destination === 1);
      progress.set(
        reducedMotion
          ? destination
          : withTiming(destination, {
              duration: scrubTapDurationMs,
              easing: Easing.inOut(Easing.cubic),
            }),
      );
    });

  const scrubGesture = Gesture.Exclusive(verticalPan, scrubTap);

  const handleAccessibilityAction = ({
    nativeEvent,
  }: {
    nativeEvent: { actionName: string };
  }) => {
    if (nativeEvent.actionName === 'increment') {
      setRevealed(true);
      progress.set(reducedMotion ? 1 : withTiming(1, { duration: 500 }));
    }
    if (nativeEvent.actionName === 'decrement') {
      setRevealed(false);
      progress.set(reducedMotion ? 0 : withTiming(0, { duration: 500 }));
    }
  };

  return (
    <GestureDetector gesture={scrubGesture}>
      <View
        accessibilityActions={[
          { name: 'increment', label: 'Assemble the lunch illustration' },
          { name: 'decrement', label: 'Restore the novel passage' },
        ]}
        accessibilityHint="Swipe up to form the picture and down to restore the text"
        accessibilityLabel={`Novel passage. ${paragraph}`}
        accessibilityRole="adjustable"
        accessibilityValue={{
          text: revealed ? 'Lunch illustration' : 'Novel passage',
        }}
        onAccessibilityAction={handleAccessibilityAction}
        style={[styles.fill, { backgroundColor: PAGE_BG }]}>
        <Canvas style={styles.fill}>
          {data.ready && data.font && (
            <Reveal
              pageXY={data.pageXY}
              sprites={data.sprites}
              font={data.font}
              atlas={data.atlas}
              targets={data.targets}
              progress={progress}
              screenW={width}
              screenH={height}
            />
          )}
        </Canvas>

        {interaction === 'toggle' && (
          <PressableToggleIcon
            face={face}
            onPress={toggle}
            style={{
              bottom: width * PAGE_MARGIN_FRAC,
              right: width * PAGE_MARGIN_FRAC,
            }}
          />
        )}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
