export {
  default as WeekPagesProvider,
  useWeekPageIndexState,
} from './pager/WeekPagesProvider';
export {getWeekPageIndexByDay} from './utils/page-index';
export {
  getWeekPageStartOrDefault,
  getWeekPageEndOrDefault,
} from './pager/utils';

export type {WeekPagerProps} from './pager/WeekPager';
export {default as WeekPager} from './pager/WeekPager';

import WeekCalendar from './WeekCalendar';
export type {WeekCalendarProps} from './WeekCalendar';
export default WeekCalendar;
