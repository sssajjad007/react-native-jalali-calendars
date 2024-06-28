import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react';
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import Animated, {withSpring, withTiming} from 'react-native-reanimated';
import {useMemoObject} from '@rozhkov/react-useful-hooks';
import {
  AnimConfig,
  CalendarTheme,
  SpringAnimConfig,
  TimingAnimConfig,
  useTheme,
} from './ThemeProvider';
import {createRequiredContextValueHook} from '@utils/react-hooks';
import type {FDay} from '@utils/day';

type CalendarBaseStaticStyles = {
  monthRowStyle: ViewStyle;
  monthTitleStyle: TextStyle;
  weekDayRowStyle: ViewStyle;
  weekDayContainerStyle: ViewStyle;
  weekDayTitleStyle: TextStyle;
  pageContainerStyle: ViewStyle;
  dayRowStyle: ViewStyle;
  dayContainerStyle: ViewStyle;
  daySecondaryContainerStyle: ViewStyle;
  dayDisabledContainerStyle: ViewStyle;
  dayTitleStyle: TextStyle;
  dayDotRowStyle: ViewStyle;
  dayDotStyle: ViewStyle;
};

const getThemePropValue = <ValueT extends string | number>(
  value: ValueT | AnimConfig<ValueT>,
) => {
  return typeof value === 'object' ? value.value : value;
};

const buildStaticStyles = ({
  calendarPaddingHorizontal,
  monthTitleFontSize,
  monthTitleColor,
  weekDayTitleColor,
  weekDayTitleFontSize,
  pagePaddingTop,
  pagePaddingBottom,
  dayContainerSize,
  dayFontSize,
  dayColor,
  dayBgColor,
  dayDotSize,
  dayDisabledOpacity,
  daySecondaryOpacity,
}: CalendarTheme) => {
  return StyleSheet.create<CalendarBaseStaticStyles>({
    monthRowStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: calendarPaddingHorizontal,
    },
    monthTitleStyle: {
      color: monthTitleColor,
      fontSize: monthTitleFontSize,
    },
    weekDayRowStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: calendarPaddingHorizontal,
    },
    weekDayContainerStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      width: dayContainerSize,
    },
    weekDayTitleStyle: {
      color: weekDayTitleColor,
      fontSize: weekDayTitleFontSize,
    },
    pageContainerStyle: {
      paddingTop: pagePaddingTop,
      paddingBottom: pagePaddingBottom,
      justifyContent: 'space-between',
    },
    dayRowStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: calendarPaddingHorizontal,
    },
    dayContainerStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      height: dayContainerSize,
      width: dayContainerSize,
      // initialize values
      backgroundColor: getThemePropValue(dayBgColor),
    },
    daySecondaryContainerStyle: {opacity: daySecondaryOpacity},
    dayDisabledContainerStyle: {opacity: dayDisabledOpacity},
    dayTitleStyle: {
      fontSize: dayFontSize,
      // initialize values
      color: getThemePropValue(dayColor),
    },
    dayDotRowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      bottom: 3,
    },
    dayDotStyle: {
      width: dayDotSize,
      height: dayDotSize,
      borderRadius: dayDotSize,
      margin: 1,
    },
  });
};

type DayContainerAnimatedStyle = (
  isSelected: boolean,
) => Animated.AnimateStyle<ViewStyle>;
type DayTitleAnimatedStyle = (
  isSelected: boolean,
) => Animated.AnimateStyle<TextStyle>;

type CalendarBaseAnimatedStyles = {
  dayContainerAnimatedStyle: DayContainerAnimatedStyle;
  dayTitleAnimatedStyle: DayTitleAnimatedStyle;
};

const isTimingConfig = <ValueT extends string | number>(
  prop: ValueT | AnimConfig<ValueT>,
): prop is TimingAnimConfig<ValueT> => {
  'worklet';
  return typeof prop === 'object' && prop.type === 'timing';
};
const isSpringConfig = <ValueT extends string | number>(
  prop: ValueT | AnimConfig<ValueT>,
): prop is SpringAnimConfig<ValueT> => {
  'worklet';
  return typeof prop === 'object' && prop.type === 'spring';
};
const getStaticOrAnimate = <ValueT extends string | number>(
  prop: ValueT | AnimConfig<ValueT>,
) => {
  'worklet';
  if (isTimingConfig(prop)) {
    return withTiming(prop.value, prop.option);
  } else if (isSpringConfig(prop)) {
    return withSpring(prop.value, prop.option);
  } else {
    return prop;
  }
};

const useCalendarBaseAnimatedStyles = ({
  dayBgColor,
  daySelectedBgColor,
  dayColor,
  daySelectedColor,
}: CalendarTheme): CalendarBaseAnimatedStyles => {
  const dayContainerAnimatedStyle = useCallback<DayContainerAnimatedStyle>(
    (isSelected) => {
      'worklet';
      return {
        backgroundColor: getStaticOrAnimate(
          isSelected ? daySelectedBgColor : dayBgColor,
        ),
      };
    },
    [dayBgColor, daySelectedBgColor],
  );

  const dayTitleAnimatedStyle = useCallback<DayTitleAnimatedStyle>(
    (isSelected) => {
      'worklet';
      return {
        color: getStaticOrAnimate(isSelected ? daySelectedColor : dayColor),
      };
    },
    [dayColor, daySelectedColor],
  );

  return useMemoObject<CalendarBaseAnimatedStyles>({
    dayContainerAnimatedStyle,
    dayTitleAnimatedStyle,
  });
};

type CalendarBaseStyles = CalendarBaseStaticStyles & CalendarBaseAnimatedStyles;

export type DayContainerStyleFn = (info: {
  day: FDay;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isSecondary: boolean;
}) => StyleProp<ViewStyle> | undefined;
export type DayTextStyleFn = (info: {
  day: FDay;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isSecondary: boolean;
}) => StyleProp<TextStyle> | undefined;
export type CalendarStyles = {
  containerStyle: StyleProp<ViewStyle> | undefined;
  monthRowStyle: StyleProp<ViewStyle> | undefined;
  monthTitleStyle: StyleProp<TextStyle> | undefined;
  weekDayRowStyle: StyleProp<ViewStyle> | undefined;
  weekDayContainerStyle: StyleProp<ViewStyle> | undefined;
  weekDayTitleStyle: StyleProp<TextStyle> | undefined;
  pageContainerStyle: StyleProp<ViewStyle> | undefined;
  dayRowStyle: StyleProp<ViewStyle> | undefined;
  dayContainerStyle: StyleProp<ViewStyle> | DayContainerStyleFn | undefined;
  dayTextStyle: StyleProp<TextStyle> | DayTextStyleFn | undefined;
  dayDotRowStyle: StyleProp<ViewStyle> | undefined;
  dayDotStyle: StyleProp<ViewStyle> | undefined;
};

type StylesContextValue = {
  base: CalendarBaseStaticStyles & CalendarBaseAnimatedStyles;
  prop: CalendarStyles;
};

const StylesContext = createContext<StylesContextValue | undefined>(undefined);

type StylesProviderProps = PropsWithChildren<CalendarStyles>;

const StylesProvider = ({children, ...restProps}: StylesProviderProps) => {
  const theme = useTheme();
  const staticStyles = useMemo(() => buildStaticStyles(theme), [theme]);
  const animatedStyles = useCalendarBaseAnimatedStyles(theme);
  const baseStyles = useMemo<CalendarBaseStyles>(
    () => ({...staticStyles, ...animatedStyles}),
    [animatedStyles, staticStyles],
  );
  const propStyles = useMemoObject<CalendarStyles>(restProps);

  const result = useMemoObject<StylesContextValue>({
    base: baseStyles,
    prop: propStyles,
  });

  return <StylesContext.Provider value={result} children={children} />;
};

export default StylesProvider;

export const useStyles = createRequiredContextValueHook(
  StylesContext,
  'useStyles',
  'StylesProvider',
);
