import React, {memo} from 'react';
import useWeekRowData from './useWeekRowData';
import type {GetPageHeight, WeekPageIndex} from '@calendars/common';
import {
  FIRST_DAY_OF_WEEK_INDEX,
  getDefaultPageHeight,
  LAST_DAY_OF_WEEK_INDEX,
  PageView,
  useCalendarWidth,
  useRenderedPageRegisterEffect,
  useTheme,
} from '@calendars/common';
import {useMemoArray} from '@rozhkov/react-useful-hooks';

const ROW_COUNT = 1;
const MAX_ROW_COUNT = 1;
const isSecondary = () => false;

type WeekPageProps = {
  pageIndex: WeekPageIndex;
  arrayIndex: number;
  pageHeight: number | GetPageHeight | undefined;
};

const WeekPage = ({
  pageIndex,
  arrayIndex,
  pageHeight = getDefaultPageHeight,
}: WeekPageProps) => {
  const days = useWeekRowData(pageIndex);
  const calendarWidth = useCalendarWidth();
  const theme = useTheme();
  const height =
    typeof pageHeight === 'number'
      ? pageHeight
      : pageHeight({
          theme,
          rowCount: ROW_COUNT,
          maxRowCount: MAX_ROW_COUNT,
        });

  useRenderedPageRegisterEffect(
    'week',
    arrayIndex,
    height,
    days[FIRST_DAY_OF_WEEK_INDEX],
    days[LAST_DAY_OF_WEEK_INDEX],
    ROW_COUNT,
  );

  const rows = useMemoArray([days]);

  return (
    <PageView
      rows={rows}
      width={calendarWidth}
      height={height}
      isSecondary={isSecondary}
    />
  );
};

export default memo(WeekPage);
