/*
THESIS: A sparse hand-drawn illustration quietly behaves like a real mobile; no interface chrome or simulated realism competes with the drawing.
OWN-WORLD: Warm ivory, fine brown ink-like curves, tiny looped joins, and six muted abstract color marks.
STORY: The drawing is already breathing. Catching one mark bends its wire, moves the connected structure, and reveals a private chime.
FIRST VIEWPORT: A short crooked arch and smaller wavering bar suspend six tiny asymmetric forms high within generous blank paper.
FORM: User-confirmed living-illustration refinement of composition A; seed 8038761e retains the two-level topology.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
*/
import { StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useEffect } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  interpolate,
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
      stroke={palette.thread}
      strokeLinecap="round"
      strokeWidth={0.9}
    />
    <Path
      d={topLoopPath}
      fill="none"
      stroke={palette.rod}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.05}
    />
    <Path
      d={topRodPath}
      fill="none"
      stroke={palette.rod}
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
      stroke={palette.thread}
      strokeLinecap="round"
      strokeWidth={0.9}
    />
    <Path
      d="M51 87 C46 88 46 95 51 97 C56 95 56 89 51 87 Z"
      fill="none"
      stroke={palette.rod}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.05}
    />
    <Path
      d="M20 92 C49 89 68 96 93 92 C117 88 143 95 166 90"
      fill="none"
      stroke={palette.rod}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.45}
    />
    <Path
      d="M20 89 C15 90 15 97 20 99 C25 97 25 91 20 89 Z M93 89 C88 90 88 97 93 99 C98 97 98 91 93 89 Z"
      fill="none"
      stroke={palette.rod}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
    />
  </Svg>
);

const LowerAssembly = ({
  idle,
  mainImpulse,
  onChime,
  reducedMotion,
  stageScale,
}: {
  idle: ReturnType<typeof useSharedValue<number>>;
  mainImpulse: ReturnType<typeof useSharedValue<number>>;
  onChime: ReturnType<typeof useChimes>;
  reducedMotion: boolean;
  stageScale: number;
}) => {
  const lowerImpulse = useSharedValue(0);
  const style = useAnimatedStyle(() => ({
    transform: [
      {
        rotateZ: `${interpolate(idle.get(), [0, 1], [-0.7, 0.7]) + lowerImpulse.get()}deg`,
      },
    ],
  }));

  return (
    <Animated.View style={[styles.lowerAssembly, style]}>
      <LowerWire />

      <InteractiveWeight
        accessibilityLabel="Small sage wedge"
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
        accessibilityLabel="Three connected charcoal pebbles"
        anchorX={93}
        anchorY={92}
        height={54}
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
        accessibilityLabel="Long warm gray stone"
        anchorX={93}
        anchorY={92}
        height={18}
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
  const idle = useSharedValue(0);
  const mainImpulse = useSharedValue(0);

  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const left = (width - DESIGN_WIDTH * scale) / 2;
  const top = (height - DESIGN_HEIGHT * scale) / 2;

  useEffect(() => {
    if (reducedMotion) {
      idle.set(0.5);
      return;
    }

    idle.set(
      withRepeat(
        withTiming(1, {
          duration: 6800,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
  }, [idle, reducedMotion]);

  const mobileStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      {
        rotateY: `${interpolate(idle.get(), [0, 1], [-5.5, 5.5])}deg`,
      },
      {
        rotateZ: `${interpolate(idle.get(), [0, 1], [-0.8, 0.8]) + mainImpulse.get()}deg`,
      },
    ],
  }));

  return (
    <View
      accessibilityLabel="Day 002, an interactive hanging mobile"
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
          <TopStructure />

          <LowerAssembly
            idle={idle}
            mainImpulse={mainImpulse}
            onChime={playChime}
            reducedMotion={reducedMotion}
            stageScale={scale}
          />

          <InteractiveWeight
            accessibilityLabel="Small tan paper stone"
            anchorX={286}
            anchorY={140}
            height={30}
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
            accessibilityLabel="Small apricot drop"
            anchorX={286}
            anchorY={352}
            height={36}
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
            accessibilityLabel="Small red lozenge"
            anchorX={286}
            anchorY={518}
            height={18}
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
});
