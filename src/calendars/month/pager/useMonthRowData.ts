import {
  createDaysOfWeek,
  DaysOfWeek,
  getMonthRowCount,
  MonthPageIndex,
  useLocaledDayjs,
} from '@calendars/common';
import {useMemo} from 'react';

const useMonthRowData = ({year, month}: MonthPageIndex): DaysOfWeek[] => {
  const ldayjs = useLocaledDayjs();
  return useMemo(() => {
    let start = ldayjs().year(year).month(month);
    const rowCount = getMonthRowCount(start);
    start = start.startOf('month').startOf('week').utc(true);
    const result: DaysOfWeek[] = [];
    for (let i = 0; i < rowCount; ++i) {
      result.push(createDaysOfWeek(start));
      start = start.add(1, 'week');
    }
    return result;
  }, [month, ldayjs, year]);
};

export default useMonthRowData;
