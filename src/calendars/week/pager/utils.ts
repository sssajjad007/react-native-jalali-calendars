import dayjs from 'dayjs';
import type {WeekPageIndex, LDayjs} from '@calendars/common';
import memoizeOne from 'memoize-one';
import {fDay, setNoon, WEEK_LENGTH} from '@utils/day';

const normalizePageStart = (day: dayjs.Dayjs) => {
  return setNoon(day.startOf('week').utc(true));
};
const normalizePageEnd = (day: dayjs.Dayjs) => {
  return setNoon(day.endOf('week').utc(true));
};

export const getWeekPageStartOrDefault = (
  propValue: WeekPageIndex | dayjs.Dayjs | string | undefined,
  ldayjs: LDayjs,
) => {
  return normalizePageStart(
    (() => {
      if (propValue === undefined) {
        return ldayjs().subtract(5, 'year'); // default value;
      } else if (dayjs.isDayjs(propValue)) {
        return propValue;
      } else if (typeof propValue === 'string') {
        return ldayjs(propValue);
      } else {
        const {year, dayOfYear} = propValue;
        return ldayjs().year(year).dayOfYear(dayOfYear);
      }
    })(),
  );
};

export const getWeekPageEndOrDefault = (
  propValue: WeekPageIndex | dayjs.Dayjs | string | undefined,
  ldayjs: LDayjs,
) => {
  return normalizePageEnd(
    (() => {
      if (propValue === undefined) {
        return ldayjs().add(5, 'year'); // default value;
      } else if (dayjs.isDayjs(propValue)) {
        return propValue;
      } else if (typeof propValue === 'string') {
        return ldayjs(propValue);
      } else {
        const {year, dayOfYear} = propValue;
        return ldayjs().year(year).dayOfYear(dayOfYear);
      }
    })(),
  );
};

export const createWeekIndexes = memoizeOne(
  (start: dayjs.Dayjs, end: dayjs.Dayjs): WeekPageIndex[] => {
    if (start.isSameOrAfter(end, 'week')) {
      return [];
    }
    const endYear = end.year();
    const result: WeekPageIndex[] = [];
    while (start.year() < endYear) {
      const dayCountInYear = start.endOf('year').dayOfYear();
      const year = start.year();
      const dayOfYear = start.dayOfYear();
      const weekCount = Math.trunc((dayCountInYear - dayOfYear) / WEEK_LENGTH);
      for (let i = 0; i <= weekCount; ++i) {
        result.push({
          year,
          dayOfYear: dayOfYear + WEEK_LENGTH * i,
        });
      }
      start = start.add(weekCount + 1, 'week');
    }
    const year = start.year();
    const dayOfYear = start.dayOfYear();
    const weekCount = Math.trunc((end.dayOfYear() - dayOfYear) / WEEK_LENGTH);
    for (let i = 0; i <= weekCount; ++i) {
      result.push({
        year,
        dayOfYear: dayOfYear + WEEK_LENGTH * i,
      });
    }
    return result;
  },
  (newInputs, lastInputs) => {
    return newInputs.every((arg1, index) => {
      return fDay(arg1) === fDay(lastInputs[index]!);
    });
  },
);

export const getWeekPageIndexNumber = (
  indexes: ReadonlyArray<WeekPageIndex>,
  {year, dayOfYear}: WeekPageIndex,
) => {
  return indexes.findIndex(
    (pIndex) => pIndex.year === year && pIndex.dayOfYear === dayOfYear,
  );
};
