import {WEEK_LENGTH} from '@utils/day';
import type dayjs from 'dayjs';

export const getYearAndMonthByWeekPageIndex = (
  pageDay: dayjs.Dayjs,
  selectedDay: dayjs.Dayjs | null,
) => {
  if (selectedDay !== null && pageDay.isSame(selectedDay, 'week')) {
    return {year: selectedDay.year(), month: selectedDay.month()};
  }
  const startWeekDay = pageDay.startOf('week');
  const endWeekDay = pageDay.endOf('week');
  if (
    startWeekDay.month() !== endWeekDay.month() &&
    startWeekDay.endOf('month').weekday() < 3
  ) {
    return {year: endWeekDay.year(), month: endWeekDay.month()};
  }
  return {year: startWeekDay.year(), month: startWeekDay.month()};
};

export const getSortedWeekDayNames = (
  weekDays: string[],
  weekStart: number,
): string[] => [
  ...weekDays.slice(weekStart, WEEK_LENGTH),
  ...weekDays.slice(0, weekStart),
];
