import type {TextStyle, ViewStyle} from 'react-native';
import {useAnimatedStyle} from 'react-native-reanimated';
import {useMemo} from 'react';

// fix https://github.com/software-mansion/react-native-reanimated/issues/1767
const useMemoAnimatedStyle = (
  worklet: () => ViewStyle | TextStyle,
  deps: unknown[],
) => {
  const style = useAnimatedStyle(worklet, deps);
  return useMemo(() => style, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useMemoAnimatedStyle;
