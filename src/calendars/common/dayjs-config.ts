import dayjs from 'dayjs';
import jalaliday from 'jalali-plugin-dayjs';

export const configureDayjs = (locale: ILocale | string) => {
  if (locale === 'fa') {
    dayjs.extend(jalaliday);
    dayjs.extend(jalaliday).calendar('jalali');
  }
};
