import type {CalendarTheme} from './providers/ThemeProvider';

export type WeekPageIndex = {
  year: number;
  dayOfYear: number;
};
export type MonthPageIndex = {
  year: number;
  month: number;
};
export type PageIndex = WeekPageIndex | MonthPageIndex;

export type GetPageHeight = (info: {
  theme: CalendarTheme;
  /**
   * Current number of rows per page
   */
  rowCount: number;
  /**
   * The maximum number of rows possible per page
   */
  maxRowCount: number;
}) => number;

export type OnPageIndexChanged<T extends WeekPageIndex | MonthPageIndex> =
  (event: {value: T}) => void;
