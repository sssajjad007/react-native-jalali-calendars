import React, {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react';
import CustomRendersProvider, {
  RenderDay,
  RenderMonthHeaderTitle,
} from './CustomRendersProvider';
import LocaleProvider, {Locale} from './LocaleProvider';
import MarkedDaysProvider, {MarkedDays} from './MarkedDaysProvider';
import RenderedPagesProvider, {
  OnPageMounted,
  OnPageUnmounted,
} from './RenderedPagesProvider';
import StylesProvider, {CalendarStyles} from './StylesProvider';
import ThemeProvider, {CalendarTheme} from './ThemeProvider';
import TodayProvider from './TodayProvider';
import DayProvider, {OnDayChanged, OnDayPress} from './DayProvider';
import type {Day} from '@utils/day';
import shareData from '../shareData';

export type BaseCalendarProps = {
  locale?: Locale;
  theme?: Partial<CalendarTheme>;

  selectedDay?: Day | null;
  onDayChanged?: OnDayChanged;
  onDayPress?: OnDayPress;
  dayMin?: Day;
  dayMax?: Day;
  markedDays?: MarkedDays;

  onPageMounted?: OnPageMounted;
  onPageUnmounted?: OnPageUnmounted;

  renderDay?: RenderDay;
  renderMonthHeaderTitle?: RenderMonthHeaderTitle;
} & Partial<CalendarStyles>;

const baseProviders = <
  PropsT extends Omit<PropsT, keyof BaseCalendarProps>,
  MethodsT,
>(
  WrappedComponent: ForwardRefExoticComponent<
    PropsWithoutRef<PropsT> & RefAttributes<MethodsT>
  >,
) => {
  const BaseProviders = (
    {
      locale,
      theme,

      selectedDay,
      onDayChanged,
      onDayPress,
      markedDays,
      dayMin,
      dayMax,

      onPageUnmounted,
      onPageMounted,

      renderMonthHeaderTitle,
      renderDay,

      containerStyle,
      monthRowStyle,
      monthTitleStyle,
      weekDayTitleStyle,
      weekDayRowStyle,
      weekDayContainerStyle,
      pageContainerStyle,
      dayRowStyle,
      dayContainerStyle,
      dayTextStyle,
      dayDotRowStyle,
      dayDotStyle,
      ...restProps
    }: PropsT & BaseCalendarProps,
    forwardedRef: ForwardedRef<MethodsT>,
  ) => {
    shareData.calendar.getLocale = () => locale as string;

    return (
      <LocaleProvider locale={locale}>
        <ThemeProvider theme={theme}>
          <TodayProvider>
            <DayProvider
              dayMin={dayMin}
              dayMax={dayMax}
              day={selectedDay}
              onDayChanged={onDayChanged}
              onDayPress={onDayPress}>
              <RenderedPagesProvider
                onPageMounted={onPageMounted}
                onPageUnmounted={onPageUnmounted}>
                <MarkedDaysProvider markedDays={markedDays}>
                  <CustomRendersProvider
                    renderDay={renderDay}
                    renderMonthHeaderTitle={renderMonthHeaderTitle}>
                    <StylesProvider
                      containerStyle={containerStyle}
                      monthRowStyle={monthRowStyle}
                      monthTitleStyle={monthTitleStyle}
                      weekDayRowStyle={weekDayRowStyle}
                      weekDayContainerStyle={weekDayContainerStyle}
                      weekDayTitleStyle={weekDayTitleStyle}
                      pageContainerStyle={pageContainerStyle}
                      dayRowStyle={dayRowStyle}
                      dayContainerStyle={dayContainerStyle}
                      dayTextStyle={dayTextStyle}
                      dayDotRowStyle={dayDotRowStyle}
                      dayDotStyle={dayDotStyle}>
                      <WrappedComponent
                        {...(restProps as any)}
                        ref={forwardedRef}
                      />
                    </StylesProvider>
                  </CustomRendersProvider>
                </MarkedDaysProvider>
              </RenderedPagesProvider>
            </DayProvider>
          </TodayProvider>
        </ThemeProvider>
      </LocaleProvider>
    );
  };
  return forwardRef(BaseProviders);
};

export default baseProviders;
