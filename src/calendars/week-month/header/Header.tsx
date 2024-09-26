import React, {memo, useMemo} from 'react';
import {
  getYearAndMonthByWeekPageIndex,
  Header as BaseHeader,
  OnMonthChanged,
  OnMonthInitialized,
  useDayState,
  useLocaledDayjs,
} from '@calendars/common';
import {useMonthPageIndexState} from '@calendars/month';
import {useWeekPageIndexState} from '@calendars/week';
import type {CalendarType} from '../types';

type HeaderProps = {
  calendarType: CalendarType;
  visibleMonthHeader: boolean;
  visibleWeekDaysHeader: boolean;
  onMonthInitialized: OnMonthInitialized | undefined;
  onMonthChanged: OnMonthChanged | undefined;
  showFirstLetterOfDaysName?: boolean;
};

const Header = ({
  calendarType,
  visibleMonthHeader,
  visibleWeekDaysHeader,
  onMonthInitialized,
  onMonthChanged,
  showFirstLetterOfDaysName,
}: HeaderProps) => {
  const ldayjs = useLocaledDayjs();
  const [weekPageIndex] = useWeekPageIndexState();
  const [monthPageIndex] = useMonthPageIndexState();
  const [selectedDay] = useDayState();

  const {year, month} = useMemo(() => {
    if (calendarType === 'week') {
      const {year: pageIndexYear, dayOfYear} = weekPageIndex;
      const pageDay = ldayjs().year(pageIndexYear).dayOfYear(dayOfYear);
      return getYearAndMonthByWeekPageIndex(pageDay, selectedDay);
    } else if (calendarType === 'month') {
      return monthPageIndex;
    } else {
      throw new Error('No implementation');
    }
  }, [calendarType, ldayjs, monthPageIndex, selectedDay, weekPageIndex]);

  return (
    <BaseHeader
      year={year}
      month={month}
      visibleMonthHeader={visibleMonthHeader}
      visibleWeekDaysHeader={visibleWeekDaysHeader}
      onMonthInitialized={onMonthInitialized}
      onMonthChanged={onMonthChanged}
      showFirstLetterOfDaysName={showFirstLetterOfDaysName}
    />
  );
};

Header.displayName = 'Week-Month(Header)';

export default memo(Header);
