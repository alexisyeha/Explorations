/*
THESIS: A phone becomes a quiet hanging sculpture; the screen refuses controls and explanatory chrome.
OWN-WORLD: Warm sunlit paper, a softly shaded wall, hairline suspension wire, browned-brass rods, and six flat storybook silhouettes.
STORY: The mobile is already breathing in a quiet field of warm light. Catching one small character moves its structure, then reveals a private chime.
FIRST VIEWPORT: A shortened suspension lifts the asymmetric arch and its two character chains into the upper half of the field.
FORM: Concept-roll seed 8038761e; approved composition A with a shortened top line; source comp .impeccable/mocks/day-02-a.png.
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
  BreadHorseWeight,
  HuggingHorsesWeight,
  InteractiveWeight,
  JumpingHorseWeight,
  KettleHorseWeight,
  LongHorseWeight,
  MoonGlancingHorseWeight,
  palette,
} from './shapes';

const topRodPath = 'M105 168 C124 81 244 58 286 140';

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

const TopRod = () => (
  <Svg height={DESIGN_HEIGHT} pointerEvents="none" width={DESIGN_WIDTH}>
    <Path
      d={topRodPath}
      fill="none"
      stroke={palette.rod}
      strokeLinecap="round"
      strokeWidth={2.15}
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
      <View pointerEvents="none" style={styles.lowerRod} />
      <View pointerEvents="none" style={styles.lowerSuspension} />

      <InteractiveWeight
        accessibilityLabel="Small green kettle horse"
        anchorX={20}
        anchorY={148}
        height={68}
        mainImpulse={mainImpulse}
        onChime={onChime}
        reducedMotion={reducedMotion}
        secondaryImpulse={lowerImpulse}
        stageScale={stageScale}
        tone="clay"
        width={74}
        x={-17}
        y={218}>
        <KettleHorseWeight />
      </InteractiveWeight>

      <InteractiveWeight
        accessibilityLabel="Black and cream hugging horses"
        anchorX={93}
        anchorY={148}
        height={58}
        mainImpulse={mainImpulse}
        onChime={onChime}
        reducedMotion={reducedMotion}
        secondaryImpulse={lowerImpulse}
        stageScale={stageScale}
        tone="dots"
        width={86}
        x={50}
        y={232}>
        <HuggingHorsesWeight />
      </InteractiveWeight>

      <InteractiveWeight
        accessibilityLabel="Long gray horse with stars"
        anchorX={93}
        anchorY={148}
        height={38}
        mainImpulse={mainImpulse}
        onChime={onChime}
        reducedMotion={reducedMotion}
        secondaryImpulse={lowerImpulse}
        stageScale={stageScale}
        tone="cobalt"
        width={100}
        x={43}
        y={358}>
        <LongHorseWeight />
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
          <TopRod />
          <View pointerEvents="none" style={styles.topThread} />

          <LowerAssembly
            idle={idle}
            mainImpulse={mainImpulse}
            onChime={playChime}
            reducedMotion={reducedMotion}
            stageScale={scale}
          />

          <InteractiveWeight
            accessibilityLabel="Moon-glancing horse"
            anchorX={286}
            anchorY={140}
            height={90}
            mainImpulse={mainImpulse}
            onChime={playChime}
            reducedMotion={reducedMotion}
            stageScale={scale}
            tone="crescent"
            width={78}
            x={247}
            y={322}>
            <MoonGlancingHorseWeight />
          </InteractiveWeight>

          <InteractiveWeight
            accessibilityLabel="Small orange bread horse"
            anchorX={286}
            anchorY={412}
            height={55}
            mainImpulse={mainImpulse}
            onChime={playChime}
            reducedMotion={reducedMotion}
            stageScale={scale}
            tone="pebble"
            width={80}
            x={246}
            y={482}>
            <BreadHorseWeight />
          </InteractiveWeight>

          <InteractiveWeight
            accessibilityLabel="Red jumping horse with golden wings"
            anchorX={286}
            anchorY={564}
            height={54}
            mainImpulse={mainImpulse}
            onChime={playChime}
            reducedMotion={reducedMotion}
            stageScale={scale}
            tone="star"
            width={94}
            x={239}
            y={630}>
            <JumpingHorseWeight />
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
  lowerRod: {
    backgroundColor: palette.rod,
    borderRadius: 2,
    height: 2.1,
    left: 20,
    position: 'absolute',
    top: 147,
    width: 146,
  },
  lowerSuspension: {
    backgroundColor: palette.thread,
    height: 148,
    left: 50.5,
    opacity: 0.72,
    position: 'absolute',
    top: 0,
    width: 1,
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
  topThread: {
    backgroundColor: palette.thread,
    height: 81,
    left: 194.5,
    opacity: 0.72,
    position: 'absolute',
    top: 0,
    width: 1,
  },
});
