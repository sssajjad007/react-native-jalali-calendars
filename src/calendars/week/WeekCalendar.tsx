import React, {ForwardedRef, forwardRef, RefAttributes} from 'react';
import {
  CalendarMethods,
  WeekPageIndex,
  OnMonthChanged,
  OnMonthInitialized,
  GetPageHeight,
  baseProviders,
  BaseCalendarProps,
  CalendarContainer,
  OnPageIndexChanged,
} from '@calendars/common';
import Header from './header/Header';
import WeekPager from './pager/WeekPager';
import WeekPagesProvider from './pager/WeekPagesProvider';
import type {Day} from '@utils/day';

type WeekCalendarCoreProps = {
  onPageIndexChanged?: OnPageIndexChanged<WeekPageIndex>;
  pageHeight?: number | GetPageHeight;
  initPageIndex?: WeekPageIndex | Day;
  pageStart?: WeekPageIndex | Day;
  pageEnd?: WeekPageIndex | Day;
  // common props
  visibleMonthHeader?: boolean;
  visibleWeekDaysHeader?: boolean;
  onMonthInitialized?: OnMonthInitialized;
  onMonthChanged?: OnMonthChanged;
  calendarWidth?: number;
};

const WeekCalendarCore = (
  {
    initPageIndex,
    pageEnd,
    pageStart,
    onPageIndexChanged,
    pageHeight,
    calendarWidth,
    visibleMonthHeader = true,
    visibleWeekDaysHeader = true,
    onMonthInitialized,
    onMonthChanged,
  }: WeekCalendarCoreProps,
  forwardedRef: ForwardedRef<CalendarMethods>,
) => {
  return (
    <WeekPagesProvider
      pageStart={pageStart}
      pageEnd={pageEnd}
      onPageIndexChanged={onPageIndexChanged}
      initPageIndex={initPageIndex}>
      <CalendarContainer width={calendarWidth}>
        <Header
          visibleMonthHeader={visibleMonthHeader}
          visibleWeekDaysHeader={visibleWeekDaysHeader}
          onMonthInitialized={onMonthInitialized}
          onMonthChanged={onMonthChanged}
        />
        <WeekPager ref={forwardedRef} pageHeight={pageHeight} />
      </CalendarContainer>
    </WeekPagesProvider>
  );
};

export type WeekCalendarProps = WeekCalendarCoreProps &
  BaseCalendarProps &
  RefAttributes<CalendarMethods>;

const WeekCalendar = baseProviders(forwardRef(WeekCalendarCore));

WeekCalendar.displayName = 'WeekCalendar';

export default WeekCalendar;
