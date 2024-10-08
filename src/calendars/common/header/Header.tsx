import React, {memo} from 'react';
import HeaderMonthRow from './Header.MonthRow';
import HeaderWeekDaysRow from './Header.WeekDaysRow';
import useMonthEventsEffect, {
  OnMonthChanged,
  OnMonthInitialized,
} from './useMonthEventsEffect';

type HeaderProps = {
  year: number;
  month: number;
  visibleMonthHeader: boolean;
  visibleWeekDaysHeader: boolean;
  onMonthInitialized: OnMonthInitialized | undefined;
  onMonthChanged: OnMonthChanged | undefined;
  showFirstLetterOfDaysName?: boolean;
};

const Header = ({
  year,
  month,
  visibleMonthHeader,
  visibleWeekDaysHeader,
  onMonthInitialized,
  onMonthChanged,
  showFirstLetterOfDaysName,
}: HeaderProps) => {
  useMonthEventsEffect(year, month, onMonthInitialized, onMonthChanged);
  return (
    <>
      {visibleMonthHeader && <HeaderMonthRow year={year} month={month} />}
      {visibleWeekDaysHeader && (
        <HeaderWeekDaysRow
          showFirstLetterOfDaysName={showFirstLetterOfDaysName}
        />
      )}
    </>
  );
};

export default memo(Header);
