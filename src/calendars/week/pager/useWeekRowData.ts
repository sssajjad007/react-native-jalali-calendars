import {useMemo} from 'react';
import {
  useLocaledDayjs,
  WeekPageIndex,
  createDaysOfWeek,
} from '@calendars/common';

const useWeekRowData = ({year, dayOfYear}: WeekPageIndex) => {
  const ldayjs = useLocaledDayjs();
  return useMemo(() => {
    let start = ldayjs()
      .year(year)
      .dayOfYear(dayOfYear)
      .startOf('week')
      .utc(true);
    return createDaysOfWeek(start);
  }, [dayOfYear, ldayjs, year]);
};

export default useWeekRowData;
