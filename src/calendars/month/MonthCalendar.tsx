import {
  BaseCalendarProps,
  baseProviders,
  CalendarContainer,
  CalendarMethods,
  GetPageHeight,
  MonthPageIndex,
  OnPageIndexChanged,
  OnMonthChanged,
  OnMonthInitialized,
} from '@calendars/common';
import type {Day} from '@utils/day';
import React, {ForwardedRef, forwardRef, RefAttributes} from 'react';
import Header from './header/Header';
import MonthPager from './pager/MonthPager';
import MonthPagesProvider from './pager/MonthPagesProvider';

type MonthCalendarCoreProps = {
  onPageIndexChanged?: OnPageIndexChanged<MonthPageIndex>;
  pageHeight?: number | GetPageHeight;
  initPageIndex?: MonthPageIndex | Day;
  pageStart?: MonthPageIndex | Day;
  pageEnd?: MonthPageIndex | Day;
  // common props
  visibleMonthHeader?: boolean;
  visibleWeekDaysHeader?: boolean;
  onMonthInitialized?: OnMonthInitialized;
  onMonthChanged?: OnMonthChanged;
  calendarWidth?: number;
};

const MonthCalendarCore = (
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
  }: MonthCalendarCoreProps,
  forwardedRef: ForwardedRef<CalendarMethods>,
) => {
  return (
    <MonthPagesProvider
      pageStart={pageStart}
      pageEnd={pageEnd}
      initPageIndex={initPageIndex}
      onPageIndexChanged={onPageIndexChanged}>
      <CalendarContainer width={calendarWidth}>
        <Header
          visibleMonthHeader={visibleMonthHeader}
          visibleWeekDaysHeader={visibleWeekDaysHeader}
          onMonthInitialized={onMonthInitialized}
          onMonthChanged={onMonthChanged}
        />
        <MonthPager ref={forwardedRef} pageHeight={pageHeight} />
      </CalendarContainer>
    </MonthPagesProvider>
  );
};

export type MonthCalendarProps = MonthCalendarCoreProps &
  BaseCalendarProps &
  RefAttributes<CalendarMethods>;

const MonthCalendar = baseProviders(forwardRef(MonthCalendarCore));

MonthCalendar.displayName = 'MonthCalendar';

export default MonthCalendar;
