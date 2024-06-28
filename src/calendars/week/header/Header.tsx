import React, {memo} from 'react';
import {
  getYearAndMonthByWeekPageIndex,
  Header as BaseHeader,
  OnMonthChanged,
  OnMonthInitialized,
  useDayState,
  useLocaledDayjs,
} from '@calendars/common';
import {useWeekPageIndexState} from '../pager/WeekPagesProvider';

type HeaderProps = {
  visibleMonthHeader: boolean;
  visibleWeekDaysHeader: boolean;
  onMonthInitialized: OnMonthInitialized | undefined;
  onMonthChanged: OnMonthChanged | undefined;
};

const Header = ({
  visibleMonthHeader,
  visibleWeekDaysHeader,
  onMonthInitialized,
  onMonthChanged,
}: HeaderProps) => {
  const ldayjs = useLocaledDayjs();
  const [pageIndex] = useWeekPageIndexState();
  const [selectedDay] = useDayState();
  const {year: pageIndexYear, dayOfYear} = pageIndex;
  const pageDay = ldayjs().year(pageIndexYear).dayOfYear(dayOfYear);
  const {year, month} = getYearAndMonthByWeekPageIndex(pageDay, selectedDay);

  return (
    <BaseHeader
      year={year}
      month={month}
      visibleMonthHeader={visibleMonthHeader}
      visibleWeekDaysHeader={visibleWeekDaysHeader}
      onMonthInitialized={onMonthInitialized}
      onMonthChanged={onMonthChanged}
    />
  );
};

Header.displayName = 'Week(Header)';

export default memo(Header);
