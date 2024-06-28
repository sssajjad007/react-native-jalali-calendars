import React, {createContext, PropsWithChildren, useMemo} from 'react';
import type dayjs from 'dayjs';
import {
  createMonthIndexes,
  getMonthPageArrayIndex,
  getMonthPageEndOrDefault,
  getMonthPageStartOrDefault,
} from './utils';
import usePageIndexState from './useMonthPageIndexState';
import {SharedValue, useSharedValue} from 'react-native-reanimated';
import {
  MonthPageIndex,
  OnPageIndexChanged,
  useLocaledDayjs,
} from '@calendars/common';
import {
  useInit,
  useMemoArray,
  useMemoObject,
} from '@rozhkov/react-useful-hooks';
import {createRequiredContextValueHook} from '@utils/react-hooks';

export type MonthPagesInfoContextValue = {
  indexes: ReadonlyArray<MonthPageIndex>;
  indexProgress: SharedValue<number>;
};
export type MonthPageIndexStateContextValue = [
  MonthPageIndex,
  (index: MonthPageIndex) => void,
];

const MonthPagesInfoContext = createContext<
  MonthPagesInfoContextValue | undefined
>(undefined);
const MonthPageIndexStateContext = createContext<
  MonthPageIndexStateContextValue | undefined
>(undefined);

type MonthPagesProviderProps = PropsWithChildren<{
  pageStart: MonthPageIndex | dayjs.Dayjs | string | undefined;
  pageEnd: MonthPageIndex | dayjs.Dayjs | string | undefined;
  onPageIndexChanged: OnPageIndexChanged<MonthPageIndex> | undefined;
  initPageIndex: MonthPageIndex | string | undefined;
}>;

const MonthPagesProvider = ({
  pageStart: pageStartProp,
  pageEnd: pageEndProp,
  initPageIndex,
  onPageIndexChanged,
  children,
}: MonthPagesProviderProps) => {
  const ldayjs = useLocaledDayjs();
  const [index, changeIndex] = usePageIndexState(
    initPageIndex,
    onPageIndexChanged,
  );

  const pageStart = useMemo(
    () => getMonthPageStartOrDefault(pageStartProp, ldayjs),
    [ldayjs, pageStartProp],
  );
  const pageEnd = useMemo(
    () => getMonthPageEndOrDefault(pageEndProp, ldayjs),
    [ldayjs, pageEndProp],
  );

  const indexes = useMemo(() => {
    return createMonthIndexes(pageStart, pageEnd);
  }, [pageStart, pageEnd]);

  const indexProgress = useSharedValue(
    useInit(() => getMonthPageArrayIndex(indexes, index)),
  );

  const infoResult = useMemoObject<MonthPagesInfoContextValue>({
    indexes,
    indexProgress,
  });
  const stateResult = useMemoArray<MonthPageIndexStateContextValue>([
    index,
    changeIndex,
  ]);

  return (
    <MonthPagesInfoContext.Provider value={infoResult}>
      <MonthPageIndexStateContext.Provider value={stateResult}>
        {children}
      </MonthPageIndexStateContext.Provider>
    </MonthPagesInfoContext.Provider>
  );
};

export default MonthPagesProvider;

export const useMonthPagesInfo = createRequiredContextValueHook(
  MonthPagesInfoContext,
  'useMonthPagesInfoState',
  'MonthPagesProvider',
);
export const useMonthPageIndexState = createRequiredContextValueHook(
  MonthPageIndexStateContext,
  'useMonthPageIndexState',
  'MonthPagesProvider',
);
export const useMonthPageIndexes = () => useMonthPagesInfo().indexes;
export const useMonthPageIndexProgress = () =>
  useMonthPagesInfo().indexProgress;
