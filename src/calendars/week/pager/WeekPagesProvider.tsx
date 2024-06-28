import {
  OnPageIndexChanged,
  WeekPageIndex,
  useLocaledDayjs,
} from '@calendars/common';
import {SharedValue, useSharedValue} from 'react-native-reanimated';
import React, {createContext, PropsWithChildren, useMemo} from 'react';
import type dayjs from 'dayjs';
import usePageIndexState from './useWeekPageIndexState';
import {
  createWeekIndexes,
  getWeekPageEndOrDefault,
  getWeekPageIndexNumber,
  getWeekPageStartOrDefault,
} from './utils';
import {
  useInit,
  useMemoArray,
  useMemoObject,
} from '@rozhkov/react-useful-hooks';
import {createRequiredContextValueHook} from '@utils/react-hooks';

type PagesInfoVal = {
  indexes: ReadonlyArray<WeekPageIndex>;
  indexProgress: SharedValue<number>;
};
type PageIndexStateVal = [WeekPageIndex, (index: WeekPageIndex) => void];

const PagesInfoContext = createContext<PagesInfoVal | undefined>(undefined);
const WeekPageIndexStateContext = createContext<PageIndexStateVal | undefined>(
  undefined,
);

type WeekPagesProviderProps = PropsWithChildren<{
  pageStart: WeekPageIndex | dayjs.Dayjs | string | undefined;
  pageEnd: WeekPageIndex | dayjs.Dayjs | string | undefined;
  onPageIndexChanged: OnPageIndexChanged<WeekPageIndex> | undefined;
  initPageIndex: WeekPageIndex | string | undefined;
}>;

const WeekPagesProvider = ({
  pageStart: pageStartProp,
  pageEnd: pageEndProp,
  initPageIndex,
  onPageIndexChanged,
  children,
}: WeekPagesProviderProps) => {
  const ldayjs = useLocaledDayjs();
  const [index, changeIndex] = usePageIndexState(
    initPageIndex,
    onPageIndexChanged,
  );

  const pageStart = useMemo(
    () => getWeekPageStartOrDefault(pageStartProp, ldayjs),
    [ldayjs, pageStartProp],
  );
  const pageEnd = useMemo(
    () => getWeekPageEndOrDefault(pageEndProp, ldayjs),
    [ldayjs, pageEndProp],
  );

  const indexes = useMemo(() => {
    return createWeekIndexes(pageStart, pageEnd);
  }, [pageStart, pageEnd]);

  const indexProgress = useSharedValue(
    useInit(() => getWeekPageIndexNumber(indexes, index)),
  );

  const infoResult = useMemoObject<PagesInfoVal>({
    indexes,
    indexProgress,
  });
  const stateResult = useMemoArray<PageIndexStateVal>([index, changeIndex]);

  return (
    <PagesInfoContext.Provider value={infoResult}>
      <WeekPageIndexStateContext.Provider value={stateResult}>
        {children}
      </WeekPageIndexStateContext.Provider>
    </PagesInfoContext.Provider>
  );
};

export default WeekPagesProvider;

export const useWeekPagesInfo = createRequiredContextValueHook(
  PagesInfoContext,
  'useWeekPagesInfoState',
  'WeekPagesProvider',
);
export const useWeekPageIndexState = createRequiredContextValueHook(
  WeekPageIndexStateContext,
  'useWeekPageIndexState',
  'WeekPagesProvider',
);
export const useWeekPageIndexes = () => useWeekPagesInfo().indexes;
export const useWeekPageIndexProgress = () => useWeekPagesInfo().indexProgress;
