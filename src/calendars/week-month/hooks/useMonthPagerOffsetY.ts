import {useMemo} from 'react';
import {
  CalendarTheme,
  getMonthRowCount,
  getYearAndMonthByWeekPageIndex,
  useDayState,
  useLocaledDayjs,
  useRenderedPageData,
  useTheme,
} from '@calendars/common';
import {
  getMonthPageArrayIndex,
  useMonthPageIndexes,
  useMonthPageIndexState,
} from '@calendars/month';
import {useWeekPageIndexState} from '@calendars/week';

const useMonthPageRowIndex = () => {
  const ldayjs = useLocaledDayjs();
  const [selectedDay] = useDayState();
  const [weekPageIndex] = useWeekPageIndexState();
  const [monthPageIndex] = useMonthPageIndexState();

  return useMemo(() => {
    const weekPageIndexDay = ldayjs()
      .year(weekPageIndex.year)
      .dayOfYear(weekPageIndex.dayOfYear);
    const {year: weekYear, month: weekMonth} = getYearAndMonthByWeekPageIndex(
      weekPageIndexDay,
      selectedDay,
    );

    if (
      monthPageIndex.year !== weekYear ||
      monthPageIndex.month !== weekMonth
    ) {
      return -1;
    }

    let monthPageIndexDay = ldayjs()
      .year(monthPageIndex.year)
      .month(monthPageIndex.month);
    const rowCount = getMonthRowCount(monthPageIndexDay);
    monthPageIndexDay = monthPageIndexDay.startOf('month').startOf('week');
    for (let i = 0; i < rowCount; ++i) {
      if (monthPageIndexDay.isSame(weekPageIndexDay, 'date')) {
        return i;
      }
      monthPageIndexDay = monthPageIndexDay.add(1, 'w');
    }
    return -1;
  }, [
    ldayjs,
    selectedDay,
    monthPageIndex.month,
    monthPageIndex.year,
    weekPageIndex.dayOfYear,
    weekPageIndex.year,
  ]);
};

export type GetMonthPagerOffsetY = (info: {
  theme: CalendarTheme;
  rowIndex: number;
  rowCount: number;
  pageHeight: number;
}) => number;

const getDefaultMonthPagerOffsetY: GetMonthPagerOffsetY = ({
  theme,
  rowIndex,
  pageHeight,
  rowCount,
}) => {
  const betweenRows =
    (pageHeight -
      theme.pagePaddingTop -
      theme.pagePaddingBottom -
      theme.dayContainerSize * rowCount) /
    (rowCount - 1);

  return (betweenRows + theme.dayContainerSize) * rowIndex * -1;
};

const useMonthPagerOffsetY = (
  getMonthPagerOffsetY: GetMonthPagerOffsetY = getDefaultMonthPagerOffsetY,
) => {
  const theme = useTheme();
  const rowIndex = useMonthPageRowIndex();
  const monthIndexes = useMonthPageIndexes();
  const [monthPageIndex] = useMonthPageIndexState();
  const monthPages = useRenderedPageData('month');
  const monthPage = useMemo(() => {
    const arrayIndex = getMonthPageArrayIndex(monthIndexes, monthPageIndex);
    return monthPages.find((x) => x.arrayIndex === arrayIndex);
  }, [monthIndexes, monthPageIndex, monthPages]);

  return useMemo(() => {
    if (rowIndex < 0 || monthPage === undefined) {
      return 0;
    }
    return getMonthPagerOffsetY({
      theme,
      rowIndex,
      pageHeight: monthPage.pageHeight,
      rowCount: monthPage.rowCount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getMonthPagerOffsetY,
    monthPage?.pageHeight,
    monthPage?.rowCount,
    rowIndex,
    theme,
  ]);
};

export default useMonthPagerOffsetY;
