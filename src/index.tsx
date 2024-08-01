export type {Day, FDay} from '@utils/day';
export {F_DAY} from '@utils/day';

export type {
  CalendarMethods,
  Locale,
  PartialCalendarTheme as CalendarTheme,
  PageDataProp as PageData,
  WeekPageIndex,
  MonthPageIndex,
  GetPageHeight,
  // events
  OnMonthInitialized,
  OnMonthChanged,
  OnPageMounted,
  OnPageUnmounted,
  OnPageIndexChanged,
  OnDayChanged,
  OnDayPress,
  // renders
  RenderDay,
  RenderMonthHeaderTitle,
  // marked days
  MarkedDays,
  MarkedDaysSelector,
  MarkedDayItem,
  MarkedDayData,
  DotData,
  // styles
  DayContainerStyleFn,
  DayTextStyleFn,
} from '@calendars/common';
export {useTheme, useDots} from '@calendars/common';

export type {WeekCalendarProps} from '@calendars/week';
export {default as WeekCalendar} from '@calendars/week';

export type {MonthCalendarProps} from '@calendars/month';
export {default as MonthCalendar} from '@calendars/month';

export type {WMCalendarProps, CalendarType} from '@calendars/week-month';
export {default as WMCalendar, withWMSwitching} from '@calendars/week-month';
export {default as shareData} from './calendars/common/shareData';
