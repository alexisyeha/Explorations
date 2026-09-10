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
import Svg, {
  Defs,
  Ellipse,
  LinearGradient as SvgLinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';

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
  'M104 126 C114 112 129 94 149 84 C165 75 181 79 197 77 C223 75 247 87 262 102 C272 111 280 115 287 116';
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

const useArticulatedMotion = () => {
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const rotation = useSharedValue(0);

  return useMemo(() => ({ dragX, dragY, rotation }), [dragX, dragY, rotation]);
};

const CausticField = ({
  phase,
  reducedMotion,
}: {
  phase: ReturnType<typeof useSharedValue<number>>;
  reducedMotion: boolean;
}) => {
  const style = useAnimatedStyle(() => {
    const angle = phase.get() * Math.PI * 2;

    return {
      transform: [
        { translateX: reducedMotion ? 0 : 5.5 * Math.sin(angle) },
        { translateY: reducedMotion ? 0 : 3.5 * Math.sin(angle * 2 + 0.6) },
        { rotateZ: `${reducedMotion ? 0 : 0.45 * Math.sin(angle - 0.4)}deg` },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, style]}>
      <View
        pointerEvents="none"
        shouldRasterizeIOS
        style={[StyleSheet.absoluteFill, styles.causticProjection]}>
        <Svg
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 390 844"
          width="100%">
          <Defs>
            <RadialGradient id="sunPool" cx="46%" cy="42%" r="58%">
              <Stop offset="0" stopColor="#FFFDF3" stopOpacity={0.98} />
              <Stop offset="0.54" stopColor="#FFF7D8" stopOpacity={0.7} />
              <Stop offset="1" stopColor="#FFF1C2" stopOpacity={0} />
            </RadialGradient>
            <SvgLinearGradient id="prism" x1="0" x2="1" y1="0.2" y2="0.8">
              <Stop offset="0" stopColor="#F4B8A7" stopOpacity={0} />
              <Stop offset="0.24" stopColor="#F6C999" stopOpacity={0.7} />
              <Stop offset="0.5" stopColor="#FFFBEA" stopOpacity={0.94} />
              <Stop offset="0.72" stopColor="#B9DFDB" stopOpacity={0.58} />
              <Stop offset="1" stopColor="#B8B8E4" stopOpacity={0} />
            </SvgLinearGradient>
          </Defs>

          <Ellipse cx="42" cy="136" fill="url(#sunPool)" rx="23" ry="12" />
          <Ellipse cx="206" cy="218" fill="url(#sunPool)" rx="10" ry="6" />
          <Ellipse cx="336" cy="286" fill="url(#sunPool)" rx="26" ry="13" />
          <Ellipse cx="72" cy="412" fill="url(#sunPool)" rx="17" ry="10" />
          <Ellipse cx="316" cy="516" fill="url(#sunPool)" rx="14" ry="8" />
          <Ellipse cx="122" cy="668" fill="url(#sunPool)" rx="24" ry="13" />
          <Ellipse cx="350" cy="746" fill="url(#sunPool)" rx="12" ry="7" />
          <Path
            d="M18 524 C34 507 55 510 65 526 C74 541 62 556 43 555 C25 555 10 541 18 524 Z"
            fill="url(#sunPool)"
            opacity={0.58}
          />
          <Path
            d="M326 104 L357 91 L342 116 Z M42 592 L67 577 L55 606 Z M246 704 L277 686 L260 717 Z"
            fill="url(#prism)"
            opacity={0.72}
          />
        </Svg>
      </View>
    </Animated.View>
  );
};

const AmbientSunlight = ({
  causticPhase,
  reducedMotion,
}: {
  causticPhase: ReturnType<typeof useSharedValue<number>>;
  reducedMotion: boolean;
}) => (
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
    <CausticField phase={causticPhase} reducedMotion={reducedMotion} />
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
  const dotsMotion = useArticulatedMotion();
  const stoneMotion = useArticulatedMotion();
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
        points={[
          {
            motion: dotsMotion,
            windAmplitude: 1.7,
            windOffset: 0.18,
            x: 93,
            y: 176,
          },
          {
            motion: stoneMotion,
            windAmplitude: 2.7,
            windOffset: 0.48,
            x: 93,
            y: 302,
          },
        ]}
        reducedMotion={reducedMotion}
        windPhase={windPhase}
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
        coupledMotions={[
          { influence: 0.58, motion: stoneMotion, rotationDirection: -0.72 },
        ]}
        linkedMotion={dotsMotion}
        mainImpulse={mainImpulse}
        onChime={onChime}
        reducedMotion={reducedMotion}
        secondaryImpulse={lowerImpulse}
        stageScale={stageScale}
        tone="dots"
        width={22}
        windAmplitude={1.7}
        windOffset={0.18}
        windPhase={windPhase}
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
        coupledMotions={[
          { influence: 0.46, motion: dotsMotion, rotationDirection: -0.68 },
        ]}
        linkedMotion={stoneMotion}
        mainImpulse={mainImpulse}
        onChime={onChime}
        reducedMotion={reducedMotion}
        secondaryImpulse={lowerImpulse}
        stageScale={stageScale}
        tone="cobalt"
        width={56}
        windAmplitude={2.7}
        windOffset={0.48}
        windPhase={windPhase}
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
  const causticPhase = useSharedValue(0);
  const mainImpulse = useSharedValue(0);
  const rightTopMotion = useArticulatedMotion();
  const rightMiddleMotion = useArticulatedMotion();
  const rightBottomMotion = useArticulatedMotion();

  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const left = (width - DESIGN_WIDTH * scale) / 2;
  const top = (height - DESIGN_HEIGHT * scale) / 2;

  useEffect(() => {
    if (reducedMotion) {
      windPhase.set(0.3);
      causticPhase.set(0.42);
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
    causticPhase.set(0);
    causticPhase.set(
      withRepeat(
        withTiming(1, {
          duration: 28000,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
  }, [causticPhase, reducedMotion, windPhase]);

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
      <AmbientSunlight
        causticPhase={causticPhase}
        reducedMotion={reducedMotion}
      />
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
              anchorY={116}
              points={[
                {
                  motion: rightTopMotion,
                  windAmplitude: 1.5,
                  windOffset: 0.14,
                  x: 286,
                  y: 298,
                },
                {
                  motion: rightMiddleMotion,
                  windAmplitude: 2.25,
                  windOffset: 0.42,
                  x: 286,
                  y: 458,
                },
                {
                  motion: rightBottomMotion,
                  windAmplitude: 3.2,
                  windOffset: 0.7,
                  x: 286,
                  y: 606,
                },
              ]}
              reducedMotion={reducedMotion}
              windPhase={windPhase}
            />

            <InteractiveWeight
              accessibilityLabel="Small rounded shadow"
              anchorX={286}
              anchorY={116}
              height={30}
              hideTether
              coupledMotions={[
                { influence: 0.64, motion: rightMiddleMotion },
                {
                  influence: 0.3,
                  motion: rightBottomMotion,
                  rotationDirection: -0.7,
                },
              ]}
              linkedMotion={rightTopMotion}
              mainImpulse={mainImpulse}
              onChime={playChime}
              reducedMotion={reducedMotion}
              stageScale={scale}
              tone="crescent"
              width={30}
              windAmplitude={1.5}
              windOffset={0.14}
              windPhase={windPhase}
              x={271}
              y={298}>
              <TanPaperWeight />
            </InteractiveWeight>

            <InteractiveWeight
              accessibilityLabel="Small drop shadow"
              anchorX={286}
              anchorY={328}
              height={36}
              hideTether
              coupledMotions={[
                {
                  influence: 0.52,
                  motion: rightTopMotion,
                  rotationDirection: -0.7,
                },
                { influence: 0.62, motion: rightBottomMotion },
              ]}
              linkedMotion={rightMiddleMotion}
              mainImpulse={mainImpulse}
              onChime={playChime}
              reducedMotion={reducedMotion}
              stageScale={scale}
              tone="pebble"
              width={28}
              windAmplitude={2.25}
              windOffset={0.42}
              windPhase={windPhase}
              x={272}
              y={458}>
              <ApricotDropWeight />
            </InteractiveWeight>

            <InteractiveWeight
              accessibilityLabel="Small lozenge shadow"
              anchorX={286}
              anchorY={494}
              height={18}
              hideTether
              coupledMotions={[
                {
                  influence: 0.26,
                  motion: rightTopMotion,
                  rotationDirection: -0.65,
                },
                { influence: 0.54, motion: rightMiddleMotion },
              ]}
              linkedMotion={rightBottomMotion}
              mainImpulse={mainImpulse}
              onChime={playChime}
              reducedMotion={reducedMotion}
              stageScale={scale}
              tone="star"
              width={50}
              windAmplitude={3.2}
              windOffset={0.7}
              windPhase={windPhase}
              x={261}
              y={606}>
              <RedLozengeWeight />
            </InteractiveWeight>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  causticProjection: {
    filter: [{ blur: 3.2 }],
    opacity: 0.68,
  },
  lowerAssembly: {
    height: 450,
    left: 54,
    position: 'absolute',
    top: 126,
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
