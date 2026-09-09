import type { WithSpringConfig } from 'react-native-reanimated';

export const DESIGN_WIDTH = 390;
export const DESIGN_HEIGHT = 844;

export const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

export const weightReturnSpring: WithSpringConfig = {
  damping: 8.5,
  mass: 0.8,
  stiffness: 52,
};

export const mobileSwaySpring: WithSpringConfig = {
  damping: 4.8,
  mass: 1.4,
  stiffness: 31,
};

export const reducedMotionTiming = {
  duration: 120,
};

export const velocityToIntensity = (velocity: number) => {
  return Math.min(1, Math.max(0.16, Math.abs(velocity) / 1350));
};
