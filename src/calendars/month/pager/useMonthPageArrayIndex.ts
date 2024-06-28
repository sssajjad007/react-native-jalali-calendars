import {useMemo} from 'react';
import {
  useMonthPageIndexes,
  useMonthPageIndexState,
} from './MonthPagesProvider';
import {getMonthPageArrayIndex} from './utils';

const useMonthPageArrayIndex = () => {
  const [pageIndex] = useMonthPageIndexState();
  const indexes = useMonthPageIndexes();
  return useMemo(
    () => getMonthPageArrayIndex(indexes, pageIndex),
    [indexes, pageIndex],
  );
};

export default useMonthPageArrayIndex;
