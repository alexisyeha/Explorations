import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

import { ReactNode, useMemo } from 'react';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import {
  clamp,
  mobileSwaySpring,
  reducedMotionTiming,
  velocityToIntensity,
  weightReturnSpring,
} from './physics';

import type { ChimeId } from './audio';

export const palette = {
  paper: '#F7F4EC',
  thread: '#8D8578',
  rod: '#5A4B33',
  charcoal: '#423D35',
  bone: '#E2D8C8',
  clay: '#B88368',
  cobalt: '#303990',
  castShadow: '#604936',
  shadedPaper: '#E6D9CF',
};

const castShadowStyle: ViewStyle = Platform.select({
  default: {
    shadowColor: palette.castShadow,
    shadowOffset: { height: 24, width: -20 },
    shadowOpacity: 0.28,
    shadowRadius: 11,
  },
  web: {
    filter: 'drop-shadow(-20px 24px 10px rgba(73, 50, 34, 0.30))',
  },
}) as ViewStyle;

const threadCastShadowStyle: ViewStyle = Platform.select({
  default: {
    shadowColor: palette.castShadow,
    shadowOffset: { height: 8, width: -6 },
    shadowOpacity: 0.14,
    shadowRadius: 3,
  },
  web: {
    filter: 'drop-shadow(-6px 8px 3px rgba(73, 50, 34, 0.14))',
  },
}) as ViewStyle;

type WeightProps = {
  accessibilityLabel: string;
  anchorX: number;
  anchorY: number;
  children: ReactNode;
  height: number;
  mainImpulse: SharedValue<number>;
  onChime: (id: ChimeId, intensity?: number) => void;
  reducedMotion: boolean;
  secondaryImpulse?: SharedValue<number>;
  stageScale: number;
  tone: ChimeId;
  width: number;
  x: number;
  y: number;
};

const Tether = ({
  anchorX,
  anchorY,
  dragX,
  dragY,
  targetX,
  targetY,
}: {
  anchorX: number;
  anchorY: number;
  dragX: SharedValue<number>;
  dragY: SharedValue<number>;
  targetX: number;
  targetY: number;
}) => {
  const baseLength = Math.max(1, targetY - anchorY);
  const style = useAnimatedStyle(() => {
    const dx = targetX + dragX.get() - anchorX;
    const dy = targetY + dragY.get() - anchorY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = -Math.atan2(dx, dy);

    return {
      transform: [{ rotateZ: `${angle}rad` }, { scaleY: length / baseLength }],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.tether,
        threadCastShadowStyle,
        {
          height: baseLength,
          left: anchorX - 0.5,
          top: anchorY,
          transformOrigin: '50% 0%',
        },
        style,
      ]}
    />
  );
};

export const InteractiveWeight = ({
  accessibilityLabel,
  anchorX,
  anchorY,
  children,
  height,
  mainImpulse,
  onChime,
  reducedMotion,
  secondaryImpulse,
  stageScale,
  tone,
  width,
  x,
  y,
}: WeightProps) => {
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const pressed = useSharedValue(0);

  const hitWidth = Math.max(56, width + 20);
  const hitHeight = Math.max(56, height + 20);
  const tapDirection = x + width / 2 < 195 ? -1 : 1;

  const nudge = useMemo(
    () => () => {
      'worklet';
      const mainPeak = tapDirection * (reducedMotion ? 0.35 : 1.35);
      const returnAnimation = reducedMotion
        ? withTiming(0, reducedMotionTiming)
        : withSpring(0, mobileSwaySpring);

      mainImpulse.set(
        withSequence(withTiming(mainPeak, { duration: 80 }), returnAnimation),
      );

      if (secondaryImpulse) {
        const secondaryPeak = tapDirection * (reducedMotion ? 0.45 : 1.8);
        secondaryImpulse.set(
          withSequence(
            withTiming(secondaryPeak, { duration: 80 }),
            reducedMotion
              ? withTiming(0, reducedMotionTiming)
              : withSpring(0, mobileSwaySpring),
          ),
        );
      }
    },
    [mainImpulse, reducedMotion, secondaryImpulse, tapDirection],
  );

  const settle = useMemo(
    () =>
      reducedMotion
        ? (value: SharedValue<number>) => {
            'worklet';
            value.set(withTiming(0, reducedMotionTiming));
          }
        : (value: SharedValue<number>, velocity = 0) => {
            'worklet';
            value.set(
              withSpring(0, {
                ...weightReturnSpring,
                velocity,
              }),
            );
          },
    [reducedMotion],
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .onBegin(() => {
          cancelAnimation(dragX);
          cancelAnimation(dragY);
          pressed.set(withTiming(1, { duration: 90 }));
          nudge();
          scheduleOnRN(onChime, tone, 0.24);
        })
        .onUpdate(event => {
          dragX.set(clamp(event.translationX, -92, 92));
          dragY.set(clamp(event.translationY, -76, 112));
          rotation.set(clamp(event.translationX * 0.18, -14, 14));
          mainImpulse.set(clamp(event.translationX * 0.052, -7.5, 7.5));
          if (secondaryImpulse) {
            secondaryImpulse.set(clamp(event.translationX * 0.075, -9, 9));
          }
        })
        .onEnd(event => {
          const intensity = velocityToIntensity(
            Math.hypot(event.velocityX, event.velocityY),
          );
          settle(dragX, event.velocityX);
          settle(dragY, event.velocityY);
          settle(rotation, event.velocityX / 30);

          if (reducedMotion) {
            mainImpulse.set(withTiming(0, reducedMotionTiming));
            if (secondaryImpulse) {
              secondaryImpulse.set(withTiming(0, reducedMotionTiming));
            }
          } else {
            mainImpulse.set(
              withSpring(0, {
                ...mobileSwaySpring,
                velocity: event.velocityX / 95,
              }),
            );
            if (secondaryImpulse) {
              secondaryImpulse.set(
                withSpring(0, {
                  ...mobileSwaySpring,
                  velocity: event.velocityX / 72,
                }),
              );
            }
          }

          if (intensity > 0.24) {
            scheduleOnRN(onChime, tone, intensity);
          }
        })
        .onFinalize(() => {
          pressed.set(withTiming(0, { duration: 260 }));
        }),
    [
      dragX,
      dragY,
      mainImpulse,
      nudge,
      onChime,
      pressed,
      reducedMotion,
      rotation,
      secondaryImpulse,
      settle,
      tone,
    ],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: dragX.get() },
      { translateY: dragY.get() },
      { rotateZ: `${rotation.get()}deg` },
      { scale: (1 + pressed.get() * 0.035) / Math.max(stageScale, 0.1) },
    ],
  }));

  return (
    <>
      <Tether
        anchorX={anchorX}
        anchorY={anchorY}
        dragX={dragX}
        dragY={dragY}
        targetX={x + width / 2}
        targetY={y}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View
          accessibilityHint="Drag and release to move the mobile and play its chime."
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          accessible
          onAccessibilityTap={() => {
            nudge();
            onChime(tone, 0.3);
          }}
          style={[
            styles.hitTarget,
            {
              height: hitHeight,
              left: x + (width - hitWidth) / 2,
              top: y + (height - hitHeight) / 2,
              width: hitWidth,
            },
            animatedStyle,
          ]}>
          <View
            pointerEvents="none"
            style={[
              styles.weightCast,
              castShadowStyle,
              {
                height,
                left: (hitWidth - width) / 2,
                top: (hitHeight - height) / 2,
                width,
              },
            ]}>
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export const CircleWeight = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => (
  <View
    style={{
      backgroundColor: color,
      borderRadius: size / 2,
      height: size,
      width: size,
      borderCurve: 'continuous',
    }}
  />
);

export const DotsWeight = () => (
  <View style={styles.dots}>
    {[0, 1, 2].map(index => (
      <View key={index} style={styles.dot} />
    ))}
  </View>
);

export const SemicircleWeight = () => <View style={styles.semicircle} />;

const crescentPath =
  'M68 3 C28 -4 0 19 0 50 C0 81 28 104 68 97 C43 86 32 70 32 50 C32 30 43 14 68 3 Z';

export const CrescentWeight = () => (
  <Svg height={100} viewBox="0 0 72 100" width={72}>
    <Path d={crescentPath} fill={palette.bone} />
  </Svg>
);

export const PebbleWeight = () => <View style={styles.pebble} />;

const starPath =
  'M32 0 L38 20 L54 10 L46 27 L64 32 L46 37 L54 54 L38 44 L32 64 L26 44 L10 54 L18 37 L0 32 L18 27 L10 10 L26 20 Z';

export const StarWeight = () => (
  <Svg height={64} viewBox="0 0 64 64" width={64}>
    <Path d={starPath} fill={palette.cobalt} />
  </Svg>
);

const styles = StyleSheet.create({
  dot: {
    backgroundColor: palette.charcoal,
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  dots: {
    alignItems: 'center',
    gap: 2,
    height: 88,
    justifyContent: 'space-between',
    width: 28,
  },
  hitTarget: {
    position: 'absolute',
  },
  pebble: {
    backgroundColor: palette.clay,
    borderRadius: 17,
    height: 82,
    width: 34,
  },
  semicircle: {
    backgroundColor: palette.cobalt,
    borderCurve: 'continuous',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    height: 52,
    width: 100,
  },
  tether: {
    backgroundColor: palette.thread,
    opacity: 0.72,
    position: 'absolute',
    width: 1,
  },
  weightCast: {
    position: 'absolute',
  },
});
