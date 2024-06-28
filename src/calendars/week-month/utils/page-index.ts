import dayjs from 'dayjs';
import {
  getYearAndMonthByWeekPageIndex,
  LDayjs,
  MonthPageIndex,
  WeekPageIndex,
} from '@calendars/common';
import {getWeekPageIndexByDay} from '@calendars/week';
import {getMonthPageIndexByDay} from '@calendars/month';

export const getSyncedMonthPageIndex = getYearAndMonthByWeekPageIndex;

export const getSyncedWeekPageIndex = (
  pageDay: dayjs.Dayjs,
  selectedDay: dayjs.Dayjs | null,
): WeekPageIndex => {
  if (selectedDay !== null && pageDay.isSame(selectedDay, 'month')) {
    return getWeekPageIndexByDay(selectedDay);
  }
  const startDayInMonthPage = pageDay.startOf('month').startOf('week');
  const endDayInMontPageFirstRow = startDayInMonthPage.endOf('week');
  if (
    startDayInMonthPage.month() !== endDayInMontPageFirstRow.month() &&
    (startDayInMonthPage.endOf('month').weekday() > 2 ||
      (selectedDay !== null &&
        selectedDay.isSame(startDayInMonthPage, 'month')))
  ) {
    const nextWeek = startDayInMonthPage.add(1, 'w');
    return getWeekPageIndexByDay(nextWeek);
  }
  return getWeekPageIndexByDay(startDayInMonthPage);
};

export const getWeekPageIndexOrDefault = (
  propValue: WeekPageIndex | dayjs.Dayjs | string | undefined,
  selectedDay: dayjs.Dayjs | null,
  ldayjs: LDayjs,
) => {
  if (propValue === undefined) {
    return getWeekPageIndexByDay(selectedDay ?? ldayjs());
  } else if (dayjs.isDayjs(propValue)) {
    return getWeekPageIndexByDay(propValue);
  } else if (typeof propValue === 'string') {
    return getWeekPageIndexByDay(ldayjs(propValue));
  } else {
    return propValue;
  }
};

export const getMonthPageIndexOrDefault = (
  propValue: MonthPageIndex | dayjs.Dayjs | string | undefined,
  selectedDay: dayjs.Dayjs | null,
  ldayjs: LDayjs,
) => {
  if (propValue === undefined) {
    return getMonthPageIndexByDay(selectedDay ?? ldayjs());
  } else if (dayjs.isDayjs(propValue)) {
    return getMonthPageIndexByDay(propValue);
  } else if (typeof propValue === 'string') {
    return getMonthPageIndexByDay(ldayjs(propValue));
  } else {
    return propValue;
  }
};
