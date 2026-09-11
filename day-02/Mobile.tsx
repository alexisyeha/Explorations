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
            <RadialGradient id="sunSmudge" cx="48%" cy="46%" r="62%">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
              <Stop offset="0.48" stopColor="#FFFDF8" stopOpacity={0.98} />
              <Stop offset="0.76" stopColor="#FFF9EB" stopOpacity={0.72} />
              <Stop offset="1" stopColor="#FFF5D8" stopOpacity={0} />
            </RadialGradient>
            <SvgLinearGradient id="prism" x1="0" x2="1" y1="0.2" y2="0.8">
              <Stop offset="0" stopColor="#F4B8A7" stopOpacity={0} />
              <Stop offset="0.24" stopColor="#F6C999" stopOpacity={0.7} />
              <Stop offset="0.5" stopColor="#FFFBEA" stopOpacity={0.94} />
              <Stop offset="0.72" stopColor="#B9DFDB" stopOpacity={0.58} />
              <Stop offset="1" stopColor="#B8B8E4" stopOpacity={0} />
            </SvgLinearGradient>
          </Defs>

          <Path
            d="M-28 79 C-2 49 42 42 75 62 C105 80 107 113 84 136 C62 158 18 162 -13 140 C-44 118 -48 99 -28 79 Z"
            fill="url(#sunSmudge)"
            opacity={0.92}
          />
          <Path
            d="M126 14 C158 -4 205 7 225 38 C243 66 220 97 181 103 C145 109 109 91 105 60 C102 40 110 24 126 14 Z"
            fill="url(#sunSmudge)"
            opacity={0.86}
          />
          <Path
            d="M278 119 C307 91 356 96 388 125 C416 151 407 190 374 210 C341 231 295 217 270 187 C253 167 260 137 278 119 Z"
            fill="url(#sunSmudge)"
            opacity={0.94}
          />
          <Path
            d="M66 202 C93 181 130 183 151 206 C169 225 160 251 133 263 C105 275 68 266 52 243 C41 227 50 214 66 202 Z"
            fill="url(#sunSmudge)"
            opacity={0.82}
          />
          <Path
            d="M-24 292 C8 265 56 267 84 293 C110 316 99 352 68 371 C36 390 -8 379 -31 350 C-48 329 -43 307 -24 292 Z"
            fill="url(#sunSmudge)"
            opacity={0.9}
          />
          <Path
            d="M151 283 C182 254 234 258 263 289 C287 315 272 351 238 368 C202 385 158 372 138 343 C123 321 133 300 151 283 Z"
            fill="url(#sunSmudge)"
            opacity={0.88}
          />
          <Path
            d="M306 348 C335 324 378 332 402 361 C423 386 411 419 379 433 C347 447 309 431 291 404 C278 384 289 363 306 348 Z"
            fill="url(#sunSmudge)"
            opacity={0.96}
          />
          <Path
            d="M17 473 C46 447 91 451 115 480 C136 506 120 538 87 550 C55 562 17 547 2 520 C-8 501 2 487 17 473 Z"
            fill="url(#sunSmudge)"
            opacity={0.93}
          />
          <Path
            d="M155 449 C187 423 235 431 257 463 C277 491 257 526 220 536 C184 546 146 526 135 497 C128 478 139 461 155 449 Z"
            fill="url(#sunSmudge)"
            opacity={0.84}
          />
          <Path
            d="M286 531 C319 504 368 511 395 543 C418 571 402 608 367 624 C330 641 286 622 268 592 C256 571 268 547 286 531 Z"
            fill="url(#sunSmudge)"
            opacity={0.9}
          />
          <Path
            d="M32 633 C68 601 122 608 149 644 C172 675 149 713 107 724 C67 735 24 711 14 677 C9 658 18 644 32 633 Z"
            fill="url(#sunSmudge)"
            opacity={0.91}
          />
          <Path
            d="M187 622 C215 596 258 599 283 627 C306 651 294 684 262 699 C229 713 188 701 170 673 C157 654 170 636 187 622 Z"
            fill="url(#sunSmudge)"
            opacity={0.78}
          />
          <Path
            d="M271 727 C302 699 352 704 382 735 C408 762 397 801 362 819 C326 837 279 821 257 789 C243 768 253 744 271 727 Z"
            fill="url(#sunSmudge)"
            opacity={0.95}
          />
          <Ellipse
            cx="20"
            cy="800"
            fill="url(#sunSmudge)"
            opacity={0.82}
            rx="70"
            ry="45"
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
            y: 160,
          },
          {
            motion: stoneMotion,
            windAmplitude: 2.7,
            windOffset: 0.48,
            x: 93,
            y: 320,
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
        y={160}>
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
        y={320}>
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
                  y: 270,
                },
                {
                  motion: rightMiddleMotion,
                  windAmplitude: 2.25,
                  windOffset: 0.42,
                  x: 286,
                  y: 400,
                },
                {
                  motion: rightBottomMotion,
                  windAmplitude: 3.2,
                  windOffset: 0.7,
                  x: 286,
                  y: 620,
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
              y={270}>
              <TanPaperWeight />
            </InteractiveWeight>

            <InteractiveWeight
              accessibilityLabel="Small drop shadow"
              anchorX={286}
              anchorY={300}
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
              y={400}>
              <ApricotDropWeight />
            </InteractiveWeight>

            <InteractiveWeight
              accessibilityLabel="Small lozenge shadow"
              anchorX={286}
              anchorY={436}
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
              y={620}>
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
    filter: [{ blur: 8.5 }],
    opacity: 0.96,
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
