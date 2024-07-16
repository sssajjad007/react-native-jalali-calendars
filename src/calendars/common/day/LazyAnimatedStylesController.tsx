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
};

const AnimatedStylesController = ({
  isSelected,
  children,
}: AnimatedStylesControllerProps) => {
  const {base} = useStyles();
  // first we need to initialize the styles without selecting, then start the animation when selecting.
  const isSelectedSv = useSharedValue(false);
  const dayContainerStyle = useAnimatedStyle(() => {
    return base.dayContainerAnimatedStyle(isSelectedSv.value) as DefaultStyle;
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
