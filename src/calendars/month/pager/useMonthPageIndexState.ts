import {
  MonthPageIndex,
  OnPageIndexChanged,
  useDayState,
  useLocaledDayjs,
} from '@calendars/common';
import {useCallback, useEffect} from 'react';
import {
  useInit,
  useIsFirstRender,
  useStableCallback,
  useStateRef,
} from '@rozhkov/react-useful-hooks';

const useMonthPageIndexState = (
  initPageIndexProp: MonthPageIndex | string | undefined,
  onPageChangedProp: OnPageIndexChanged<MonthPageIndex> | undefined,
) => {
  const ldayjs = useLocaledDayjs();
  const [selectedDay] = useDayState();
  const isFirstRender = useIsFirstRender();

  const [pageIndex, setPageIndex, pageIndexRef] = useStateRef<MonthPageIndex>(
    useInit<MonthPageIndex>(() => {
      if (initPageIndexProp !== undefined) {
        if (typeof initPageIndexProp === 'string') {
          const day = ldayjs(initPageIndexProp).startOf('month').utc(true);
          return {
            year: day.year(),
            month: day.month(),
          };
        }
        return initPageIndexProp;
      } else if (selectedDay !== null) {
        const day = selectedDay.startOf('month').utc(true);
        return {
          year: day.year(),
          month: day.month(),
        };
      } else {
        const today = ldayjs().startOf('month').utc(true);
        return {
          year: today.year(),
          month: today.month(),
        };
      }
    }),
  );

  const onPageChanged = useStableCallback(onPageChangedProp);
  const changePageIndex = useCallback(
    (index: MonthPageIndex) => {
      const curIndex = pageIndexRef.current;
      if (curIndex.month !== index.month || curIndex.year !== index.year) {
        onPageChanged?.({value: index});
        setPageIndex(index);
      }
    },
    [onPageChanged, pageIndexRef, setPageIndex],
  );

  useEffect(() => {
    if (isFirstRender || selectedDay === null) {
      return;
    }
    changePageIndex({
      year: selectedDay.year(),
      month: selectedDay.month(),
    });
  }, [selectedDay]); // eslint-disable-line react-hooks/exhaustive-deps

  return [pageIndex, changePageIndex] as [
    typeof pageIndex,
    typeof changePageIndex,
  ];
};

export default useMonthPageIndexState;
