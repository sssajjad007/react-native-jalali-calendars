import {
  Header as BaseHeader,
  OnMonthChanged,
  OnMonthInitialized,
} from '@calendars/common';
import React, {memo} from 'react';
import {useMonthPageIndexState} from '../pager/MonthPagesProvider';

type HeaderProps = {
  visibleMonthHeader: boolean;
  visibleWeekDaysHeader: boolean;
  onMonthInitialized: OnMonthInitialized | undefined;
  onMonthChanged: OnMonthChanged | undefined;
  showFirstLetterOfDaysName?: boolean;
};

const Header = ({
  visibleMonthHeader,
  visibleWeekDaysHeader,
  onMonthInitialized,
  onMonthChanged,
  showFirstLetterOfDaysName,
}: HeaderProps) => {
  const [{year, month}] = useMonthPageIndexState();
  return (
    <BaseHeader
      year={year}
      month={month}
      visibleMonthHeader={visibleMonthHeader}
      visibleWeekDaysHeader={visibleWeekDaysHeader}
      onMonthInitialized={onMonthInitialized}
      onMonthChanged={onMonthChanged}
      showFirstLetterOfDaysName={showFirstLetterOfDaysName}
    />
  );
};

Header.displayName = 'Month(Header)';

export default memo(Header);
