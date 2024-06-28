import {
  AnimationCallback,
  withSpring,
  WithSpringConfig,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';

export type TimingAnimConfig = {
  type: 'timing';
  option?: WithTimingConfig;
};
export type SpringAnimConfig = {
  type: 'spring';
  option?: WithSpringConfig;
};

export type AnimConfig = TimingAnimConfig | SpringAnimConfig;

export const withAnim = <T extends number>(
  value: T,
  anim: AnimConfig,
  callback?: AnimationCallback,
) => {
  'worklet';
  if (anim.type === 'timing') {
    return withTiming(value, anim.option, callback);
  } else {
    return withSpring(value, anim.option, callback);
  }
};
