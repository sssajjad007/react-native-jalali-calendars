import {useIsFirstRender} from '@rozhkov/react-useful-hooks';
import {useEffect} from 'react';

export type OnMonthInitialized = (event: {year: number; month: number}) => void;
export type OnMonthChanged = (event: {year: number; month: number}) => void;

const useMonthEventsEffect = (
  year: number,
  month: number,
  onMonthInitialized: OnMonthInitialized | undefined,
  onMonthChanged: OnMonthChanged | undefined,
) => {
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (isFirstRender) {
      onMonthInitialized?.({year, month});
      return;
    }
    onMonthChanged?.({year, month});
  }, [year, month]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useMonthEventsEffect;
