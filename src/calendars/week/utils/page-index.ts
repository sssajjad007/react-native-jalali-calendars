import type dayjs from 'dayjs';
import type {WeekPageIndex} from '@calendars/common';

export const getPageIndexNumber = (
  indexes: ReadonlyArray<WeekPageIndex>,
  {year, dayOfYear}: WeekPageIndex,
) => {
  return indexes.findIndex(
    (pIndex) => pIndex.year === year && pIndex.dayOfYear === dayOfYear,
  );
};

export const getWeekPageIndexByDay = (day: dayjs.Dayjs): WeekPageIndex => {
  day = day.startOf('w');
  return {
    year: day.year(),
    dayOfYear: day.dayOfYear(),
  };
};
