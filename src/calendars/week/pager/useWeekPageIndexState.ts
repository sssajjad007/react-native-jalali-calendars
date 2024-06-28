import type {OnPageIndexChanged, WeekPageIndex} from '@calendars/common';
import {useDayState, useLocaledDayjs} from '@calendars/common';
import {useCallback} from 'react';
import {
  useInit,
  useStableCallback,
  useStateRef,
} from '@rozhkov/react-useful-hooks';

const useWeekPageIndexState = (
  initPageIndexProp: WeekPageIndex | string | undefined,
  onPageIndexChanged: OnPageIndexChanged<WeekPageIndex> | undefined,
) => {
  const ldayjs = useLocaledDayjs();
  const [selectedDay] = useDayState();

  const [pageIndex, setPageIndex, pageIndexRef] = useStateRef<WeekPageIndex>(
    useInit<WeekPageIndex>(() => {
      if (initPageIndexProp !== undefined) {
        if (typeof initPageIndexProp === 'string') {
          const day = ldayjs(initPageIndexProp).startOf('w');
          return {
            year: day.year(),
            dayOfYear: day.startOf('w').dayOfYear(),
          };
        }
        return initPageIndexProp;
      } else if (selectedDay !== null) {
        const day = selectedDay.startOf('w');
        return {
          year: day.year(),
          dayOfYear: day.dayOfYear(),
        };
      } else {
        const today = ldayjs().startOf('w');
        return {
          year: today.year(),
          dayOfYear: today.dayOfYear(),
        };
      }
    }),
  );

  const onPageChanged = useStableCallback(onPageIndexChanged);
  const changePageIndex = useCallback(
    (index: WeekPageIndex) => {
      const curIndex = pageIndexRef.current;
      if (
        curIndex.dayOfYear !== index.dayOfYear ||
        curIndex.year !== index.year
      ) {
        onPageChanged?.({value: index});
        setPageIndex(index);
      }
    },
    [onPageChanged, pageIndexRef, setPageIndex],
  );

  return [pageIndex, changePageIndex] as [
    typeof pageIndex,
    typeof changePageIndex,
  ];
};

export default useWeekPageIndexState;
