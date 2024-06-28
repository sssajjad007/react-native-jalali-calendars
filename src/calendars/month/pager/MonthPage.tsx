import React, {memo, useCallback} from 'react';
import useMonthRowData from './useMonthRowData';
import type dayjs from 'dayjs';
import {
  FIRST_DAY_OF_WEEK_INDEX,
  LAST_DAY_OF_WEEK_INDEX,
  GetPageHeight,
  MonthPageIndex,
  useCalendarWidth,
  useRenderedPageRegisterEffect,
  useTheme,
  getDefaultPageHeight,
  PageView,
} from '@calendars/common';

const MAX_ROW_COUNT = 6; // The maximum number of rows possible per page

type MonthPageProps = {
  pageIndex: MonthPageIndex;
  arrayIndex: number;
  pageHeight: number | GetPageHeight | undefined;
};

const MonthPage = ({
  pageIndex,
  arrayIndex,
  pageHeight = getDefaultPageHeight,
}: MonthPageProps) => {
  const rows = useMonthRowData(pageIndex);
  const rowCount = rows.length;
  const calendarWidth = useCalendarWidth();
  const theme = useTheme();
  const height =
    typeof pageHeight === 'number'
      ? pageHeight
      : pageHeight({theme, rowCount, maxRowCount: MAX_ROW_COUNT});
  const isSecondary = useCallback(
    (day: dayjs.Dayjs) => day.month() !== pageIndex.month,
    [pageIndex.month],
  );

  useRenderedPageRegisterEffect(
    'month',
    arrayIndex,
    height,
    rows[0]![FIRST_DAY_OF_WEEK_INDEX],
    rows[rowCount - 1]![LAST_DAY_OF_WEEK_INDEX],
    rowCount,
  );

  return (
    <PageView
      rows={rows}
      width={calendarWidth}
      height={height}
      isSecondary={isSecondary}
    />
  );
};

export default memo(MonthPage);
