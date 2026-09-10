import { StyleSheet, View } from 'react-native';

import { ReactNode, useMemo } from 'react';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  SharedValue,
  useAnimatedProps,
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

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const palette = {
  paper: '#F7F4EC',
  shadow: '#453E39',
  shadedPaper: '#E6D9CF',
};

type WeightProps = {
  accessibilityLabel: string;
  anchorX: number;
  anchorY: number;
  children: ReactNode;
  coupledMotions?: MotionCoupling[];
  height: number;
  linkedMotion?: LinkedMotion;
  mainImpulse: SharedValue<number>;
  onChime: (id: ChimeId, intensity?: number) => void;
  reducedMotion: boolean;
  secondaryImpulse?: SharedValue<number>;
  stageScale: number;
  tone: ChimeId;
  width: number;
  windAmplitude?: number;
  windOffset?: number;
  windPhase?: SharedValue<number>;
  x: number;
  y: number;
  hideTether?: boolean;
};

export type LinkedMotion = {
  dragX: SharedValue<number>;
  dragY: SharedValue<number>;
  rotation: SharedValue<number>;
};

export type MotionCoupling = {
  influence: number;
  motion: LinkedMotion;
  rotationDirection?: number;
};

type TetherPoint = {
  motion: LinkedMotion;
  windAmplitude?: number;
  windOffset?: number;
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
  const restBend = Math.round(anchorX + targetY) % 2 === 0 ? 2.4 : -2.4;
  const animatedProps = useAnimatedProps(() => {
    const endX = targetX + dragX.get();
    const endY = targetY + dragY.get();
    const dx = endX - anchorX;
    const dy = endY - anchorY;
    const pull = clamp(dx * 0.12, -9, 9);

    return {
      d: `M ${anchorX} ${anchorY} C ${anchorX + restBend + pull * 0.25} ${anchorY + dy * 0.31}, ${endX - restBend + pull * 0.35} ${anchorY + dy * 0.71}, ${endX} ${endY}`,
    };
  });

  return (
    <Svg
      height="100%"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      width="100%">
      <AnimatedPath
        animatedProps={animatedProps}
        fill="none"
        stroke={palette.shadow}
        strokeLinecap="round"
        strokeWidth={0.9}
      />
    </Svg>
  );
};

export const LinkedTether = ({
  anchorX,
  anchorY,
  points,
  reducedMotion,
  windPhase,
}: {
  anchorX: number;
  anchorY: number;
  points: TetherPoint[];
  reducedMotion: boolean;
  windPhase: SharedValue<number>;
}) => {
  const animatedProps = useAnimatedProps(() => {
    const windAngle = windPhase.get() * Math.PI * 2;
    let path = `M ${anchorX} ${anchorY}`;
    let startX = anchorX;
    let startY = anchorY;

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      const windAmplitude = reducedMotion ? 0 : (point.windAmplitude ?? 0);
      const windOffset = point.windOffset ?? 0;
      const ambientX = windAmplitude * Math.sin(windAngle - windOffset);
      const ambientY =
        windAmplitude * 0.16 * Math.sin(windAngle * 2 + windOffset);
      const endX = point.x + point.motion.dragX.get() + ambientX;
      const endY = point.y + point.motion.dragY.get() + ambientY;
      const dy = endY - startY;
      const restingBend = index % 2 === 0 ? 2.6 : -2.2;
      const pull = clamp(
        point.motion.dragX.get() * (0.11 + index * 0.025) + ambientX * 0.5,
        -10,
        10,
      );

      path += ` C ${startX + restingBend + pull * 0.24} ${startY + dy * 0.31}, ${endX - restingBend + pull * 0.34} ${startY + dy * 0.7}, ${endX} ${endY}`;
      startX = endX;
      startY = endY;
    }

    return { d: path };
  });

  return (
    <Svg
      height="100%"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      width="100%">
      <AnimatedPath
        animatedProps={animatedProps}
        fill="none"
        stroke={palette.shadow}
        strokeLinecap="round"
        strokeWidth={0.9}
      />
    </Svg>
  );
};

export const InteractiveWeight = ({
  accessibilityLabel,
  anchorX,
  anchorY,
  children,
  coupledMotions = [],
  height,
  hideTether = false,
  linkedMotion,
  mainImpulse,
  onChime,
  reducedMotion,
  secondaryImpulse,
  stageScale,
  tone,
  width,
  windAmplitude = 0,
  windOffset = 0,
  windPhase,
  x,
  y,
}: WeightProps) => {
  const localDragX = useSharedValue(0);
  const localDragY = useSharedValue(0);
  const localRotation = useSharedValue(0);
  const dragX = linkedMotion?.dragX ?? localDragX;
  const dragY = linkedMotion?.dragY ?? localDragY;
  const rotation = linkedMotion?.rotation ?? localRotation;
  const pressed = useSharedValue(0);

  const hitWidth = Math.max(56, width + 20);
  const hitHeight = Math.max(56, height + 20);
  const tapDirection = x + width / 2 < 195 ? -1 : 1;

  const nudge = useMemo(
    () => () => {
      'worklet';
      const mainPeak = tapDirection * (reducedMotion ? 0.35 : 0.9);
      const returnAnimation = reducedMotion
        ? withTiming(0, reducedMotionTiming)
        : withSpring(0, mobileSwaySpring);

      mainImpulse.set(
        withSequence(withTiming(mainPeak, { duration: 140 }), returnAnimation),
      );
      rotation.set(
        withSequence(
          withTiming(tapDirection * (reducedMotion ? 1 : 2.8), {
            duration: 140,
          }),
          reducedMotion
            ? withTiming(0, reducedMotionTiming)
            : withSpring(0, weightReturnSpring),
        ),
      );

      if (secondaryImpulse) {
        const secondaryPeak = tapDirection * (reducedMotion ? 0.45 : 1.15);
        secondaryImpulse.set(
          withSequence(
            withTiming(secondaryPeak, { duration: 140 }),
            reducedMotion
              ? withTiming(0, reducedMotionTiming)
              : withSpring(0, mobileSwaySpring),
          ),
        );
      }
    },
    [mainImpulse, reducedMotion, rotation, secondaryImpulse, tapDirection],
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
          cancelAnimation(rotation);
          for (const coupling of coupledMotions) {
            cancelAnimation(coupling.motion.dragX);
            cancelAnimation(coupling.motion.dragY);
            cancelAnimation(coupling.motion.rotation);
          }
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
          for (const coupling of coupledMotions) {
            const coupledX = clamp(
              event.translationX * coupling.influence,
              -72,
              72,
            );
            const coupledY = clamp(
              event.translationY * coupling.influence * 0.72,
              -52,
              76,
            );
            const rotationDirection = coupling.rotationDirection ?? 1;
            coupling.motion.dragX.set(coupledX);
            coupling.motion.dragY.set(coupledY);
            coupling.motion.rotation.set(
              clamp(
                event.translationX *
                  0.18 *
                  coupling.influence *
                  rotationDirection,
                -10,
                10,
              ),
            );
          }
        })
        .onEnd(event => {
          const releaseVelocityX = clamp(event.velocityX, -900, 900);
          const releaseVelocityY = clamp(event.velocityY, -900, 900);
          const intensity = velocityToIntensity(
            Math.hypot(event.velocityX, event.velocityY),
          );
          settle(dragX, releaseVelocityX);
          settle(dragY, releaseVelocityY);
          settle(rotation, releaseVelocityX / 50);
          for (const coupling of coupledMotions) {
            settle(
              coupling.motion.dragX,
              releaseVelocityX * coupling.influence * 0.72,
            );
            settle(
              coupling.motion.dragY,
              releaseVelocityY * coupling.influence * 0.52,
            );
            settle(
              coupling.motion.rotation,
              (releaseVelocityX * coupling.influence) / 72,
            );
          }

          if (reducedMotion) {
            mainImpulse.set(withTiming(0, reducedMotionTiming));
            if (secondaryImpulse) {
              secondaryImpulse.set(withTiming(0, reducedMotionTiming));
            }
          } else {
            mainImpulse.set(
              withSpring(0, {
                ...mobileSwaySpring,
                velocity: releaseVelocityX / 180,
              }),
            );
            if (secondaryImpulse) {
              secondaryImpulse.set(
                withSpring(0, {
                  ...mobileSwaySpring,
                  velocity: releaseVelocityX / 145,
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
      coupledMotions,
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

  const animatedStyle = useAnimatedStyle(() => {
    const windAngle = (windPhase?.get() ?? 0) * Math.PI * 2;
    const ambientX = reducedMotion
      ? 0
      : windAmplitude * Math.sin(windAngle - windOffset);
    const ambientY = reducedMotion
      ? 0
      : windAmplitude * 0.16 * Math.sin(windAngle * 2 + windOffset);
    const hingeSway = reducedMotion
      ? 0
      : (0.8 + windAmplitude * 0.36) * Math.sin(windAngle - windOffset - 0.32) +
        0.24 * Math.sin(windAngle * 2 + windOffset);

    return {
      transform: [
        { translateX: dragX.get() + ambientX },
        { translateY: dragY.get() + ambientY },
        { rotateZ: `${rotation.get() + hingeSway}deg` },
        { scale: (1 + pressed.get() * 0.035) / Math.max(stageScale, 0.1) },
      ],
    };
  });

  return (
    <>
      {!hideTether && (
        <Tether
          anchorX={anchorX}
          anchorY={anchorY}
          dragX={dragX}
          dragY={dragY}
          targetX={x + width / 2}
          targetY={y}
        />
      )}
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
              transformOrigin: `${hitWidth / 2}px ${(hitHeight - height) / 2 + 2}px`,
              width: hitWidth,
            },
            animatedStyle,
          ]}>
          <View
            pointerEvents="none"
            style={[
              styles.weightCast,
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

export const SageWedgeWeight = () => (
  <Svg height={28} viewBox="0 0 30 28" width={30}>
    <Path
      d="M3 21 C5 16 7 10 10 4 C11 2 13 3 15 5 L28 19 C29 21 27 23 25 24 L9 27 C6 27 4 25 3 21 Z"
      fill={palette.shadow}
    />
  </Svg>
);

export const ConnectedPebblesWeight = () => (
  <Svg height={54} viewBox="0 0 22 54" width={22}>
    <Path
      d="M11 1 C17 1 20 5 19 11 C19 15 17 17 14 19 C19 20 21 24 20 29 C20 33 17 36 14 37 C18 39 20 42 19 47 C18 52 14 54 9 53 C4 53 1 49 2 44 C2 40 5 37 8 36 C4 35 2 31 2 27 C2 23 5 19 8 18 C4 16 2 13 3 9 C3 4 6 1 11 1 Z"
      fill={palette.shadow}
    />
  </Svg>
);

export const WarmGrayStoneWeight = () => (
  <Svg height={18} viewBox="0 0 56 18" width={56}>
    <Path
      d="M3 11 C5 6 12 4 20 4 C28 3 35 5 42 4 C49 4 54 7 53 11 C52 15 46 16 38 15 C30 16 25 14 18 15 C10 16 4 15 3 11 Z"
      fill={palette.shadow}
    />
  </Svg>
);

export const TanPaperWeight = () => (
  <Svg height={30} viewBox="0 0 30 30" width={30}>
    <Path
      d="M6 5 C11 2 20 3 24 7 C28 11 26 20 22 25 C18 29 9 27 5 23 C1 19 2 9 6 5 Z"
      fill={palette.shadow}
    />
  </Svg>
);

export const ApricotDropWeight = () => (
  <Svg height={36} viewBox="0 0 28 36" width={28}>
    <Path
      d="M15 2 C17 8 24 13 25 20 C27 27 22 34 15 35 C8 35 3 31 3 25 C2 19 7 15 10 11 C12 8 12 4 15 2 Z"
      fill={palette.shadow}
    />
  </Svg>
);

export const RedLozengeWeight = () => (
  <Svg height={18} viewBox="0 0 50 18" width={50}>
    <Path
      d="M3 9 C6 4 13 4 20 5 C27 5 31 3 38 4 C44 4 48 7 47 11 C46 15 39 16 32 15 C25 14 20 16 13 15 C7 15 3 13 3 9 Z"
      fill={palette.shadow}
    />
  </Svg>
);

const styles = StyleSheet.create({
  hitTarget: {
    position: 'absolute',
  },
  weightCast: {
    position: 'absolute',
  },
});
