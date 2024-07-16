import dayjs from 'dayjs';
import type {Locale} from 'dist/typescript';
import jalaliday from 'jalali-plugin-dayjs';

export const configureDayjs = (locale: Locale) => {
  if (locale === 'fa') {
    dayjs.extend(jalaliday);
    dayjs.extend(jalaliday).calendar('jalali');
  }
};
