import type { WithSpringConfig } from 'react-native-reanimated';

export const DESIGN_WIDTH = 390;
export const DESIGN_HEIGHT = 844;

export const clamp = (value: number, min: number, max: number) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

export const weightReturnSpring: WithSpringConfig = {
  damping: 11.5,
  mass: 0.75,
  stiffness: 45,
};

export const mobileSwaySpring: WithSpringConfig = {
  damping: 12,
  mass: 1.15,
  stiffness: 30,
};

export const reducedMotionTiming = {
  duration: 120,
};

export const velocityToIntensity = (velocity: number) => {
  'worklet';
  return Math.min(1, Math.max(0.16, Math.abs(velocity) / 1350));
};
