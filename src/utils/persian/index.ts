import shareData from '../../calendars/common/shareData';

export const toPersianNumber = (value: number) => {
  return shareData.calendar.getLocale() === 'fa' ? parseDigits(value) : value;
};

export const parseDigits = (number: string | number) => {
  const faNum = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  //@ts-ignore
  return String(number).replace(/[0-9]/g, (w) => faNum[+w]);
};

export const jalaliMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];
