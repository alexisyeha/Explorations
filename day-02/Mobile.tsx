/*
THESIS: Only the soft wall-shadow of an off-camera mobile is visible; the projection quietly behaves like the real hanging object that casts it.
OWN-WORLD: Warm ivory light, soft charcoal penumbra, delicate projected wires, and six abstract shadow marks.
STORY: Wind is already turning the unseen mobile. Catching one shadow bends its projected wire, moves the connected structure, and reveals a private chime.
FIRST VIEWPORT: A short crooked arch and smaller wavering bar suspend six tiny asymmetric forms high within generous blank paper.
FORM: User-confirmed living-illustration refinement of composition A; seed 8038761e retains the two-level topology.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
*/
import { StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useEffect, useMemo } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useChimes } from './audio';
import { DESIGN_HEIGHT, DESIGN_WIDTH } from './physics';
import {
  ApricotDropWeight,
  ConnectedPebblesWeight,
  InteractiveWeight,
  LinkedTether,
  palette,
  RedLozengeWeight,
  SageWedgeWeight,
  TanPaperWeight,
  WarmGrayStoneWeight,
} from './shapes';

const topRodPath =
  'M104 168 C112 139 126 103 148 85 C164 72 181 78 197 76 C224 73 249 88 263 110 C272 124 279 136 287 141';
const topThreadPath = 'M195 0 C193 20 198 43 195 77';
const topLoopPath = 'M195 76 C189 77 189 85 195 88 C201 86 201 78 195 76 Z';

const getWindAngle = (phase: number) => {
  'worklet';
  return phase * Math.PI * 2;
};

const getWindYaw = (phase: number) => {
  'worklet';
  return -45 * Math.cos(getWindAngle(phase));
};

const AmbientSunlight = () => (
  <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <LinearGradient
      colors={['#FFFDF7', '#FFF9EC', '#F8EEDF', '#EFE3D8', '#E6D9CF']}
      end={{ x: 0.96, y: 0.12 }}
      locations={[0, 0.36, 0.5, 0.66, 1]}
      start={{ x: 0.04, y: 0.02 }}
      style={StyleSheet.absoluteFill}
    />
    <LinearGradient
      colors={[
        'rgba(255, 255, 255, 0.42)',
        'rgba(255, 244, 211, 0.12)',
        'rgba(113, 82, 62, 0.08)',
      ]}
      end={{ x: 0.64, y: 1 }}
      locations={[0, 0.58, 1]}
      start={{ x: 0.34, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
  </View>
);

const TopStructure = () => (
  <Svg height={DESIGN_HEIGHT} pointerEvents="none" width={DESIGN_WIDTH}>
    <Path
      d={topThreadPath}
      fill="none"
      stroke={palette.shadow}
      strokeLinecap="round"
      strokeWidth={0.9}
    />
    <Path
      d={topLoopPath}
      fill="none"
      stroke={palette.shadow}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.05}
    />
    <Path
      d={topRodPath}
      fill="none"
      stroke={palette.shadow}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.55}
    />
  </Svg>
);

const LowerWire = () => (
  <Svg height={450} pointerEvents="none" width={190}>
    <Path
      d="M51 0 C48 25 54 58 51 88"
      fill="none"
      stroke={palette.shadow}
      strokeLinecap="round"
      strokeWidth={0.9}
    />
    <Path
      d="M51 87 C46 88 46 95 51 97 C56 95 56 89 51 87 Z"
      fill="none"
      stroke={palette.shadow}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.05}
    />
    <Path
      d="M20 92 C49 89 68 96 93 92 C117 88 143 95 166 90"
      fill="none"
      stroke={palette.shadow}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.45}
    />
    <Path
      d="M20 89 C15 90 15 97 20 99 C25 97 25 91 20 89 Z M93 89 C88 90 88 97 93 99 C98 97 98 91 93 89 Z"
      fill="none"
      stroke={palette.shadow}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
  </Svg>
);

const LowerAssembly = ({
  mainImpulse,
  onChime,
  reducedMotion,
  stageScale,
  windPhase,
}: {
  mainImpulse: ReturnType<typeof useSharedValue<number>>;
  onChime: ReturnType<typeof useChimes>;
  reducedMotion: boolean;
  stageScale: number;
  windPhase: ReturnType<typeof useSharedValue<number>>;
}) => {
  const lowerImpulse = useSharedValue(0);
  const linkedDragX = useSharedValue(0);
  const linkedDragY = useSharedValue(0);
  const linkedRotation = useSharedValue(0);
  const linkedMotion = useMemo(
    () => ({
      dragX: linkedDragX,
      dragY: linkedDragY,
      rotation: linkedRotation,
    }),
    [linkedDragX, linkedDragY, linkedRotation],
  );
  const style = useAnimatedStyle(() => {
    const angle = getWindAngle(windPhase.get());
    const delayedFollowThrough = reducedMotion
      ? 0
      : 0.72 * Math.sin(angle - 0.34) + 0.16 * Math.sin(angle * 2 - 0.7);

    return {
      transform: [
        {
          rotateZ: `${delayedFollowThrough + lowerImpulse.get()}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.lowerAssembly, style]}>
      <LowerWire />

      <LinkedTether
        anchorX={93}
        anchorY={92}
        motion={linkedMotion}
        points={[
          { x: 93, y: 176 },
          { x: 93, y: 302 },
        ]}
      />

      <InteractiveWeight
        accessibilityLabel="Small triangular shadow"
        anchorX={20}
        anchorY={92}
        height={28}
        mainImpulse={mainImpulse}
        onChime={onChime}
        reducedMotion={reducedMotion}
        secondaryImpulse={lowerImpulse}
        stageScale={stageScale}
        tone="clay"
        width={30}
        x={5}
        y={162}>
        <SageWedgeWeight />
      </InteractiveWeight>

      <InteractiveWeight
        accessibilityLabel="Three connected round shadows"
        anchorX={93}
        anchorY={92}
        height={54}
        hideTether
        linkedMotion={linkedMotion}
        mainImpulse={mainImpulse}
        onChime={onChime}
        reducedMotion={reducedMotion}
        secondaryImpulse={lowerImpulse}
        stageScale={stageScale}
        tone="dots"
        width={22}
        x={82}
        y={176}>
        <ConnectedPebblesWeight />
      </InteractiveWeight>

      <InteractiveWeight
        accessibilityLabel="Long low shadow"
        anchorX={93}
        anchorY={92}
        height={18}
        hideTether
        linkedMotion={linkedMotion}
        mainImpulse={mainImpulse}
        onChime={onChime}
        reducedMotion={reducedMotion}
        secondaryImpulse={lowerImpulse}
        stageScale={stageScale}
        tone="cobalt"
        width={56}
        x={65}
        y={302}>
        <WarmGrayStoneWeight />
      </InteractiveWeight>
    </Animated.View>
  );
};

export const Day02Mobile = () => {
  const { height, width } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const playChime = useChimes();
  const windPhase = useSharedValue(0);
  const mainImpulse = useSharedValue(0);
  const rightDragX = useSharedValue(0);
  const rightDragY = useSharedValue(0);
  const rightRotation = useSharedValue(0);
  const rightMotion = useMemo(
    () => ({
      dragX: rightDragX,
      dragY: rightDragY,
      rotation: rightRotation,
    }),
    [rightDragX, rightDragY, rightRotation],
  );

  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const left = (width - DESIGN_WIDTH * scale) / 2;
  const top = (height - DESIGN_HEIGHT * scale) / 2;

  useEffect(() => {
    if (reducedMotion) {
      windPhase.set(0.3);
      return;
    }

    windPhase.set(0);
    windPhase.set(
      withRepeat(
        withTiming(1, {
          duration: 17200,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
  }, [reducedMotion, windPhase]);

  const mobileStyle = useAnimatedStyle(() => {
    const angle = getWindAngle(windPhase.get());
    const yaw = reducedMotion ? 14 : getWindYaw(windPhase.get());
    const lateralDrift = reducedMotion
      ? 0
      : 2.8 * Math.sin(angle + 0.52) + 0.65 * Math.sin(angle * 2 + 1.1);
    const verticalDrift = reducedMotion ? 0 : 0.7 * Math.sin(angle * 2 + 0.35);
    const gentleRoll = reducedMotion
      ? 0
      : 0.68 * Math.sin(angle - 0.22) + 0.14 * Math.sin(angle * 2 + 0.4);

    return {
      transform: [
        { perspective: 900 },
        { translateX: 9 + lateralDrift },
        { translateY: 16 + verticalDrift },
        { rotateY: `${yaw}deg` },
        { rotateZ: `${gentleRoll + mainImpulse.get()}deg` },
      ],
    };
  });

  return (
    <View
      accessibilityLabel="Day 002, the interactive shadow of a hanging mobile"
      style={styles.screen}>
      <StatusBar animated hidden />
      <AmbientSunlight />
      <View
        style={[
          styles.scaleStage,
          {
            left,
            top,
            transform: [{ scale }],
          },
        ]}>
        <Animated.View style={[styles.mobile, mobileStyle]}>
          <View
            shouldRasterizeIOS
            style={[styles.mobile, styles.shadowProjection]}>
            <TopStructure />

            <LowerAssembly
              mainImpulse={mainImpulse}
              onChime={playChime}
              reducedMotion={reducedMotion}
              stageScale={scale}
              windPhase={windPhase}
            />

            <LinkedTether
              anchorX={286}
              anchorY={140}
              motion={rightMotion}
              points={[
                { x: 286, y: 322 },
                { x: 286, y: 482 },
                { x: 286, y: 630 },
              ]}
            />

            <InteractiveWeight
              accessibilityLabel="Small rounded shadow"
              anchorX={286}
              anchorY={140}
              height={30}
              hideTether
              linkedMotion={rightMotion}
              mainImpulse={mainImpulse}
              onChime={playChime}
              reducedMotion={reducedMotion}
              stageScale={scale}
              tone="crescent"
              width={30}
              x={271}
              y={322}>
              <TanPaperWeight />
            </InteractiveWeight>

            <InteractiveWeight
              accessibilityLabel="Small drop shadow"
              anchorX={286}
              anchorY={352}
              height={36}
              hideTether
              linkedMotion={rightMotion}
              mainImpulse={mainImpulse}
              onChime={playChime}
              reducedMotion={reducedMotion}
              stageScale={scale}
              tone="pebble"
              width={28}
              x={272}
              y={482}>
              <ApricotDropWeight />
            </InteractiveWeight>

            <InteractiveWeight
              accessibilityLabel="Small lozenge shadow"
              anchorX={286}
              anchorY={518}
              height={18}
              hideTether
              linkedMotion={rightMotion}
              mainImpulse={mainImpulse}
              onChime={playChime}
              reducedMotion={reducedMotion}
              stageScale={scale}
              tone="star"
              width={50}
              x={261}
              y={630}>
              <RedLozengeWeight />
            </InteractiveWeight>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lowerAssembly: {
    height: 450,
    left: 54,
    position: 'absolute',
    top: 168,
    transformOrigin: '51px 0px',
    width: 190,
  },
  mobile: {
    backfaceVisibility: 'visible',
    height: DESIGN_HEIGHT,
    position: 'absolute',
    transformOrigin: '195px 0px',
    width: DESIGN_WIDTH,
  },
  scaleStage: {
    height: DESIGN_HEIGHT,
    position: 'absolute',
    transformOrigin: '0px 0px',
    width: DESIGN_WIDTH,
  },
  screen: {
    backgroundColor: palette.shadedPaper,
    flex: 1,
    overflow: 'hidden',
  },
  shadowProjection: {
    filter: [{ blur: 2.6 }],
    isolation: 'isolate',
    opacity: 0.5,
  },
});
