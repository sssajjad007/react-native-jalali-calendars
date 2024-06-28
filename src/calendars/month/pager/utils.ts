import dayjs from 'dayjs';
import memoizeOne from 'memoize-one';
import {fDay, setNoon} from '@utils/day';
import type {LDayjs, MonthPageIndex} from '@calendars/common';

const normalizePageStart = (day: dayjs.Dayjs) => {
  return setNoon(day.startOf('month').utc(true));
};
const normalizePageEnd = (day: dayjs.Dayjs) => {
  return setNoon(day.endOf('month').utc(true));
};

export const getMonthPageStartOrDefault = (
  propValue: MonthPageIndex | dayjs.Dayjs | string | undefined,
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
        const {year, month} = propValue;
        return ldayjs().year(year).month(month);
      }
    })(),
  );
};

export const getMonthPageEndOrDefault = (
  propValue: MonthPageIndex | dayjs.Dayjs | string | undefined,
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
        const {year, month} = propValue;
        return ldayjs().year(year).month(month);
      }
    })(),
  );
};

export const createMonthIndexes = memoizeOne(
  (start: dayjs.Dayjs, end: dayjs.Dayjs): MonthPageIndex[] => {
    end = end.add(1, 'month');
    if (start.isSameOrAfter(end, 'month')) {
      return [];
    }
    const result: MonthPageIndex[] = [];
    const monthCount = end.diff(start, 'month');
    for (let i = 0; i < monthCount; ++i) {
      result.push({
        year: start.year(),
        month: start.month(),
      });
      start = start.add(1, 'month');
    }
    return result;
  },
  (newInputs, lastInputs) => {
    return newInputs.every((arg1, index) => {
      return fDay(arg1) === fDay(lastInputs[index]!);
    });
  },
);

export const getMonthPageArrayIndex = (
  indexes: ReadonlyArray<MonthPageIndex>,
  {year, month}: MonthPageIndex,
) => {
  return indexes.findIndex(
    (pIndex) => pIndex.year === year && pIndex.month === month,
  );
};
