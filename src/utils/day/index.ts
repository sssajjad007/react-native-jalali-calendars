import type dayjs from 'dayjs';

export const WEEK_LENGTH = 7;

type FourNums = `${number}${number}${number}${number}`;
type TwoNums = `${number}${number}`;

export const F_DAY = 'YYYY-MM-DD';

export type FDay = `${FourNums}-${TwoNums}-${TwoNums}`;
export type Day = FDay | string;

export const fDay = (day: dayjs.Dayjs) => day.format(F_DAY) as FDay;
export const setNoon = (day: dayjs.Dayjs) =>
  day.hour(12).minute(0).second(0).millisecond(0);
