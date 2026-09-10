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
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
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

const getWindYaw = (turn: number, long: number, cross: number) => {
  'worklet';
  return (
    turn +
    interpolate(long, [0, 1], [-1.6, 1.8]) +
    interpolate(cross, [0, 1], [0.7, -0.6])
  );
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
  windCross,
  windLong,
}: {
  mainImpulse: ReturnType<typeof useSharedValue<number>>;
  onChime: ReturnType<typeof useChimes>;
  reducedMotion: boolean;
  stageScale: number;
  windCross: ReturnType<typeof useSharedValue<number>>;
  windLong: ReturnType<typeof useSharedValue<number>>;
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
  const style = useAnimatedStyle(() => ({
    transform: [
      {
        rotateZ: `${interpolate(windLong.get(), [0, 1], [-0.9, 0.75]) + interpolate(windCross.get(), [0, 1], [0.5, -0.45]) + lowerImpulse.get()}deg`,
      },
    ],
  }));

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
  const windTurn = useSharedValue(-45);
  const windLong = useSharedValue(0.18);
  const windCross = useSharedValue(0.72);
  const windGust = useSharedValue(0.36);
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
      windTurn.set(14);
      windLong.set(0.5);
      windCross.set(0.5);
      windGust.set(0.5);
      return;
    }

    windTurn.set(-45);
    windTurn.set(
      withRepeat(
        withTiming(45, {
          duration: 8600,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );

    windLong.set(
      withRepeat(
        withSequence(
          withTiming(1, {
            duration: 9600,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0, {
            duration: 12400,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      ),
    );

    windCross.set(
      withRepeat(
        withSequence(
          withTiming(0, {
            duration: 6900,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(1, {
            duration: 8700,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      ),
    );

    windGust.set(
      withRepeat(
        withSequence(
          withTiming(0.76, {
            duration: 2700,
            easing: Easing.out(Easing.quad),
          }),
          withTiming(0.24, {
            duration: 4300,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0.62, {
            duration: 2500,
            easing: Easing.out(Easing.quad),
          }),
          withTiming(0.38, {
            duration: 3400,
            easing: Easing.inOut(Easing.sin),
          }),
        ),
        -1,
        false,
      ),
    );
  }, [reducedMotion, windCross, windGust, windLong, windTurn]);

  const mobileStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      {
        translateX:
          9 + interpolate(windCross.get(), [0, 1], [-3.5, 4.5]),
      },
      {
        translateY: 16 + interpolate(windGust.get(), [0, 1], [-1.5, 1.8]),
      },
      {
        rotateY: `${getWindYaw(
          windTurn.get(),
          windLong.get(),
          windCross.get(),
        )}deg`,
      },
      {
        rotateZ: `${interpolate(windLong.get(), [0, 1], [-0.9, 1.05]) + interpolate(windGust.get(), [0, 1], [-0.7, 0.75]) + mainImpulse.get()}deg`,
      },
      { scaleX: interpolate(windCross.get(), [0, 1], [0.985, 1.015]) },
    ],
  }));

  const projectionStyle = useAnimatedStyle(() => {
    const yaw = getWindYaw(
      windTurn.get(),
      windLong.get(),
      windCross.get(),
    );
    const facing = Math.abs(Math.cos((yaw * Math.PI) / 180));

    return {
      filter: [
        {
          blur: reducedMotion
            ? 2.8
            : interpolate(facing, [0, 1], [3.7, 2.2]),
        },
      ],
      opacity: reducedMotion
        ? 0.48
        : interpolate(facing, [0, 1], [0.34, 0.54]),
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
        <Animated.View
          style={[styles.mobile, styles.shadowProjection, projectionStyle]}>
          <Animated.View style={[styles.mobile, mobileStyle]}>
            <TopStructure />

            <LowerAssembly
              mainImpulse={mainImpulse}
              onChime={playChime}
              reducedMotion={reducedMotion}
              stageScale={scale}
              windCross={windCross}
              windLong={windLong}
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
          </Animated.View>
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
    isolation: 'isolate',
  },
});
