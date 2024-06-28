import {useMemo} from 'react';
import {getPageIndexNumber} from '../utils/page-index';
import {useWeekPageIndexes, useWeekPageIndexState} from './WeekPagesProvider';

const useWeekArrayIndex = () => {
  const [pageIndex] = useWeekPageIndexState();
  const indexes = useWeekPageIndexes();
  return useMemo(
    () => getPageIndexNumber(indexes, pageIndex),
    [indexes, pageIndex],
  );
};

export default useWeekArrayIndex;
