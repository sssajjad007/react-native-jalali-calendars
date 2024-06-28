import {
  DerivedValue,
  SharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';

const useAnimatedListener = <T>(
  src: DerivedValue<T>,
  dist?: SharedValue<T>,
) => {
  useAnimatedReaction(
    () => src.value,
    (srcValue) => {
      if (dist !== undefined) {
        dist.value = srcValue;
      }
    },
    [src, dist],
  );
};

export default useAnimatedListener;
