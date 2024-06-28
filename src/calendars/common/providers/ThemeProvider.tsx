import React, {createContext, PropsWithChildren, useMemo} from 'react';
import type {
  TimingAnimConfig as TimingAnimConfigOrigin,
  SpringAnimConfig as SpringAnimConfigOrigin,
} from '@utils/react-native-reanimated';
import {createRequiredContextValueHook} from '@utils/react-hooks';

type WithVal<
  V,
  ConfigT extends TimingAnimConfigOrigin | SpringAnimConfigOrigin,
> = {
  value: V;
} & ConfigT;

export type TimingAnimConfig<ValueT> = WithVal<ValueT, TimingAnimConfigOrigin>;
export type SpringAnimConfig<ValueT> = WithVal<ValueT, SpringAnimConfigOrigin>;

export type AnimConfig<ValueT> =
  | TimingAnimConfig<ValueT>
  | SpringAnimConfig<ValueT>;

export type CalendarTheme = {
  calendarPaddingHorizontal: number;

  monthTitleColor: string;
  monthTitleFontSize: number;

  weekDayTitleColor: string;
  weekDayTitleFontSize: number;

  pagePaddingTop: number;
  pagePaddingBottom: number;
  pageBetweenRows: number;

  dayContainerSize: number;
  dayFontSize: number;
  dayBgColor: string | AnimConfig<string>;
  dayColor: string | AnimConfig<string>;
  daySelectedBgColor: string | AnimConfig<string>;
  daySelectedColor: string | AnimConfig<string>;
  dayDisabledOpacity: number;
  daySecondaryOpacity: number;
  dayDotSize: number;
};

const WHITE_COLOR = '#ffffff';
const PRIMARY_COLOR = '#2C98F0';
const PRIMARY_FONT_COLOR = '#000000';
const SECONDARY_FONT_COLOR = '#707070';
const defaultTheme: CalendarTheme = {
  calendarPaddingHorizontal: 16,

  monthTitleColor: PRIMARY_FONT_COLOR,
  monthTitleFontSize: 17,

  weekDayTitleColor: SECONDARY_FONT_COLOR,
  weekDayTitleFontSize: 12,

  pagePaddingTop: 4,
  pagePaddingBottom: 4,
  pageBetweenRows: 2,

  dayContainerSize: 40,
  dayFontSize: 17,
  dayBgColor: {value: 'transparent', type: 'timing', option: {duration: 50}},
  daySelectedBgColor: {
    value: PRIMARY_COLOR,
    type: 'timing',
    option: {duration: 50},
  },
  dayColor: {value: PRIMARY_FONT_COLOR, type: 'timing', option: {duration: 50}},
  daySelectedColor: {
    value: WHITE_COLOR,
    type: 'timing',
    option: {duration: 50},
  },
  dayDisabledOpacity: 0.4,
  daySecondaryOpacity: 0.4,
  dayDotSize: 5,
} as const;

const ThemeContext = createContext<CalendarTheme | undefined>(undefined);

type ThemeProviderProps = PropsWithChildren<{
  theme: Partial<CalendarTheme> | undefined;
}>;

const ThemeProvider = (props: ThemeProviderProps) => {
  const {theme, children} = props;

  const result = useMemo<CalendarTheme>(
    () => ({
      ...defaultTheme,
      ...(theme ?? {}),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={result} children={children} />;
};

export default ThemeProvider;

export const useTheme = createRequiredContextValueHook(
  ThemeContext,
  'useTheme',
  'ThemeProvider',
);
