import type dayjs from 'dayjs';
import type {GetPageHeight} from '../types';

export const FIRST_DAY_OF_WEEK_INDEX = 0;
export const LAST_DAY_OF_WEEK_INDEX = 6;

export type DaysOfWeek = [
  dayjs.Dayjs,
  dayjs.Dayjs,
  dayjs.Dayjs,
  dayjs.Dayjs,
  dayjs.Dayjs,
  dayjs.Dayjs,
  dayjs.Dayjs,
];

export const createDaysOfWeek = (start: dayjs.Dayjs): DaysOfWeek => {
  return [
    start,
    start.add(1, 'd'),
    start.add(2, 'd'),
    start.add(3, 'd'),
    start.add(4, 'd'),
    start.add(5, 'd'),
    start.add(6, 'd'),
  ];
};

export const getDefaultPageHeight: GetPageHeight = ({theme, maxRowCount}) => {
  return (
    theme.pagePaddingTop +
    theme.pagePaddingBottom +
    maxRowCount * theme.dayContainerSize +
    (maxRowCount - 1) * theme.pageBetweenRows
  );
};

export const getMonthRowCount = (day: dayjs.Dayjs) => {
  const weekCount = day
    .endOf('month')
    .diff(day.startOf('month').startOf('week'), 'week', true);
  return Math.ceil(weekCount);
};
