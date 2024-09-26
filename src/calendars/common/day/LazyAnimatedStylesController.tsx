import React, {ReactNode, useRef} from 'react';
import {
  AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useStyles} from '../providers/StylesProvider';
import type {TextStyle, ViewStyle} from 'react-native';
import type {DefaultStyle} from 'react-native-reanimated/lib/typescript/reanimated2/hook/commonTypes';

type AnimatedStylesControllerProps = {
  isSelected: boolean;
  children: (data: {
    dayContainerStyle: AnimatedStyle<ViewStyle>;
    textColorStyle: AnimatedStyle<TextStyle>;
  }) => ReactNode;
  isToday?: boolean;
};

const AnimatedStylesController = ({
  isSelected,
  isToday,
  children,
}: AnimatedStylesControllerProps) => {
  const {base} = useStyles();
  // first we need to initialize the styles without selecting, then start the animation when selecting.
  const isSelectedSv = useSharedValue(false);
  const dayContainerStyle = useAnimatedStyle(() => {
    return base.dayContainerAnimatedStyle(
      isSelectedSv.value,
      isToday,
    ) as DefaultStyle;
  });
  const textColorStyle = useAnimatedStyle(() => {
    return base.dayTitleAnimatedStyle(isSelectedSv.value) as DefaultStyle;
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
  EmptyStylesControllerProps & {isToday: boolean};

// This controller allows you not to initialize animated styles immediately, which allows you to speed up rendering.
const LazyAnimatedStylesController = ({
  isSelected,
  isToday,
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

  return (
    <Controller isSelected={isSelected} isToday={isToday} children={children} />
  );
};

export default LazyAnimatedStylesController;
