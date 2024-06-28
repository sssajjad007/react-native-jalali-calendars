import {useEffect} from 'react';
import {useDayState, useLocaledDayjs} from '@calendars/common';
import {useWeekPageIndexState} from '@calendars/week';
import {useMonthPageIndexState} from '@calendars/month';
import {
  getSyncedMonthPageIndex,
  getSyncedWeekPageIndex,
} from '../utils/page-index';
import type {CalendarType} from '../types';

const useSyncWeekMonthPageIndexEffect = (calendarType: CalendarType) => {
  const ldayjs = useLocaledDayjs();
  const [selectedDay] = useDayState();
  const [weekPageIndex, changeWeekPageIndex] = useWeekPageIndexState();
  const [monthPageIndex, changeMonthPageIndex] = useMonthPageIndexState();

  const syncPageIndex = () => {
    if (calendarType === 'week') {
      const weekPageIndexDay = ldayjs()
        .year(weekPageIndex.year)
        .dayOfYear(weekPageIndex.dayOfYear);
      changeMonthPageIndex(
        getSyncedMonthPageIndex(weekPageIndexDay, selectedDay),
      );
    } else if (calendarType === 'month') {
      const monthIndexDay = ldayjs()
        .year(monthPageIndex.year)
        .month(monthPageIndex.month);
      changeWeekPageIndex(getSyncedWeekPageIndex(monthIndexDay, selectedDay));
    }
  };

  useEffect(() => {
    syncPageIndex();
  }, [calendarType, selectedDay, weekPageIndex, monthPageIndex]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useSyncWeekMonthPageIndexEffect;
