/*
THESIS: A phone becomes a quiet hanging sculpture; the screen refuses controls and explanatory chrome.
OWN-WORLD: Warm paper, hairline suspension wire, browned-brass rods, matte bone, clay, charcoal, and one cobalt counterweight.
STORY: The mobile is already breathing. Catching one small weight disturbs its connected structure and reveals a private chime.
FIRST VIEWPORT: A short asymmetric arch hangs high, feeding a small left rod and a longer right chain across generous negative space.
FORM: Concept-roll seed 8038761e; approved composition A with a shortened top line; source comp .impeccable/mocks/day-02-a.png.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
*/
import { StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useEffect } from 'react';

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
  CircleWeight,
  CrescentWeight,
  DotsWeight,
  InteractiveWeight,
  palette,
  PebbleWeight,
  SemicircleWeight,
  StarWeight,
} from './shapes';

const topRodPath = 'M105 238 C124 151 244 128 286 210';

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
        accessibilityLabel="Small clay circle"
        anchorX={20}
        anchorY={148}
        height={42}
        mainImpulse={mainImpulse}
        onChime={onChime}
        reducedMotion={reducedMotion}
        secondaryImpulse={lowerImpulse}
        stageScale={stageScale}
        tone="clay"
        width={42}
        x={-1}
        y={222}>
        <CircleWeight color={palette.clay} size={42} />
      </InteractiveWeight>

      <InteractiveWeight
        accessibilityLabel="Three connected charcoal dots"
        anchorX={93}
        anchorY={148}
        height={88}
        mainImpulse={mainImpulse}
        onChime={onChime}
        reducedMotion={reducedMotion}
        secondaryImpulse={lowerImpulse}
        stageScale={stageScale}
        tone="dots"
        width={28}
        x={79}
        y={224}>
        <DotsWeight />
      </InteractiveWeight>

      <InteractiveWeight
        accessibilityLabel="Cobalt half circle"
        anchorX={93}
        anchorY={148}
        height={52}
        mainImpulse={mainImpulse}
        onChime={onChime}
        reducedMotion={reducedMotion}
        secondaryImpulse={lowerImpulse}
        stageScale={stageScale}
        tone="cobalt"
        width={100}
        x={43}
        y={358}>
        <SemicircleWeight />
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
            accessibilityLabel="Bone crescent"
            anchorX={286}
            anchorY={210}
            height={100}
            mainImpulse={mainImpulse}
            onChime={playChime}
            reducedMotion={reducedMotion}
            stageScale={scale}
            tone="crescent"
            width={72}
            x={250}
            y={382}>
            <CrescentWeight />
          </InteractiveWeight>

          <InteractiveWeight
            accessibilityLabel="Long clay pebble"
            anchorX={286}
            anchorY={482}
            height={82}
            mainImpulse={mainImpulse}
            onChime={playChime}
            reducedMotion={reducedMotion}
            stageScale={scale}
            tone="pebble"
            width={34}
            x={269}
            y={552}>
            <PebbleWeight />
          </InteractiveWeight>

          <InteractiveWeight
            accessibilityLabel="Cobalt eight point star"
            anchorX={286}
            anchorY={634}
            height={64}
            mainImpulse={mainImpulse}
            onChime={playChime}
            reducedMotion={reducedMotion}
            stageScale={scale}
            tone="star"
            width={64}
            x={254}
            y={700}>
            <StarWeight />
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
    top: 238,
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
    backgroundColor: palette.paper,
    flex: 1,
    overflow: 'hidden',
  },
  topThread: {
    backgroundColor: palette.thread,
    height: 151,
    left: 194.5,
    opacity: 0.72,
    position: 'absolute',
    top: 0,
    width: 1,
  },
});
