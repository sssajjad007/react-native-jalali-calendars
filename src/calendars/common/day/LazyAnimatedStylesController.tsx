import React, {ReactNode, useRef} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useStyles} from '../providers/StylesProvider';
import type {TextStyle, ViewStyle} from 'react-native';

type AnimatedStylesControllerProps = {
  isSelected: boolean;
  children: (data: {
    dayContainerStyle: Animated.AnimateStyle<ViewStyle>;
    textColorStyle: Animated.AnimateStyle<TextStyle>;
  }) => ReactNode;
};

const AnimatedStylesController = ({
  isSelected,
  children,
}: AnimatedStylesControllerProps) => {
  const {base} = useStyles();
  // first we need to initialize the styles without selecting, then start the animation when selecting.
  const isSelectedSv = useSharedValue(false);
  const dayContainerStyle = useAnimatedStyle(() => {
    return base.dayContainerAnimatedStyle(isSelectedSv.value);
  });
  const textColorStyle = useAnimatedStyle(() => {
    return base.dayTitleAnimatedStyle(isSelectedSv.value);
  });
  isSelectedSv.value = isSelected;

  return <>{children({dayContainerStyle, textColorStyle})}</>;
};

type EmptyStylesControllerProps = {
  children: (data: {
    dayContainerStyle?: undefined;
    textColorStyle?: undefined;
  }) => ReactNode;
};

const EmptyStylesController = ({children}: EmptyStylesControllerProps) => {
  return <>{children({})}</>;
};

type LazyAnimatedStylesControllerProps = AnimatedStylesControllerProps &
  EmptyStylesControllerProps;

// This controller allows you not to initialize animated styles immediately, which allows you to speed up rendering.
const LazyAnimatedStylesController = ({
  isSelected,
  children,
}: LazyAnimatedStylesControllerProps) => {
  const needLoad = isSelected;
  const isTrueOnceRef = useRef(needLoad);
  if (needLoad) {
    isTrueOnceRef.current = true;
  }
  const Controller = isTrueOnceRef.current
    ? AnimatedStylesController
    : EmptyStylesController;

  return <Controller isSelected={isSelected} children={children} />;
};

export default LazyAnimatedStylesController;
