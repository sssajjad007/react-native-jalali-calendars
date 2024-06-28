export const isFastSwipeUp = (velocity: number) => {
  'worklet';
  return velocity < -1500;
};

export const isFastSwipeDown = (velocity: number) => {
  'worklet';
  return velocity > 1500;
};
