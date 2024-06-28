import type dayjs from 'dayjs';
import type {MonthPageIndex} from '@calendars/common';

export const getMonthPageIndexByDay = (day: dayjs.Dayjs): MonthPageIndex => {
  return {
    year: day.year(),
    month: day.month(),
  };
};
