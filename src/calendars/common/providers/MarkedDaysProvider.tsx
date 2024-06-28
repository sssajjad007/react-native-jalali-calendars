import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  useIsChanged,
  useIsFirstRender,
  useMemoObject,
} from '@rozhkov/react-useful-hooks';
import dayjs from 'dayjs';
import {useRenderedPageData} from './RenderedPagesProvider';
import {createRequiredContextValueHook} from '@utils/react-hooks';
import {Day, fDay, FDay} from '@utils/day';

export type DotData = {
  color: string;
  key?: string | number;
  selectedColor?: string;
} & Record<string, any>;
export type MarkedDayData = {
  dots?: DotData[];
  selected?: boolean;
  disabled?: boolean;
};
export type MarkedDay = [Day, MarkedDayData];
export type MarkedDayRange = [Day, Day, MarkedDayData];
export type MarkedDayItem = MarkedDay | MarkedDayRange;
export type MarkedDaysSelector = (info: {
  start: FDay;
  end: FDay;
}) => ReadonlyArray<MarkedDayItem>;
type MarkedDaysObject = {
  list?: ReadonlyArray<MarkedDayItem>;
  selector?: MarkedDaysSelector;
};
export type MarkedDays =
  | ReadonlyArray<MarkedDayItem>
  | MarkedDaysSelector
  | MarkedDaysObject;

const isMarkedDay = (value: MarkedDayItem): value is MarkedDay => {
  return value.length === 2;
};

type UnifiedMarkedDays = {
  [year: number]: {
    [month: number]: {
      [dayOfMonth: number]: MarkedDayData[];
    };
  };
};

const unifyMarkedDays = (
  dest: UnifiedMarkedDays,
  list: ReadonlyArray<MarkedDayItem>,
): UnifiedMarkedDays => {
  const push = (day: Day | Date, data: MarkedDayData) => {
    const dayObj = new Date(day);
    const yearMap = (dest[dayObj.getUTCFullYear()] ??= {});
    const monthMap = (yearMap[dayObj.getUTCMonth()] ??= {});
    const dateList = (monthMap[dayObj.getUTCDate()] ??= []);
    dateList.push(data);
  };
  list.forEach((listItem) => {
    if (isMarkedDay(listItem)) {
      push(listItem[0], listItem[1]);
    } else {
      const start = dayjs.utc(listItem[0]);
      const end = dayjs.utc(listItem[1]);
      const data = listItem[2];
      const count = end.diff(start, 'd');
      for (let i = 0; i <= count; ++i) {
        push(start.add(i, 'd').toDate(), data);
      }
    }
  });
  return dest;
};

const getMarkedDataList = (source: UnifiedMarkedDays, day: dayjs.Dayjs) =>
  source[day.year()]?.[day.month()]?.[day.date()];

// region ----- merge -----

const mergeDots = (
  resultDots: ReadonlyArray<DotData> | undefined,
  nextDots: ReadonlyArray<DotData> | undefined,
): DotData[] | undefined => {
  if (resultDots === undefined) {
    return nextDots as DotData[];
  }
  if (nextDots === undefined || nextDots.length === 0) {
    return resultDots as DotData[];
  }
  const result = [...resultDots];
  nextDots.forEach((nextDot) => {
    if (nextDot.key === undefined) {
      result.push(nextDot);
    }
    const existedIndex = result.findIndex((x) => x.key === nextDot.key);
    if (existedIndex < 0) {
      result.push(nextDot);
    }
    result.splice(existedIndex, 1, {...result[existedIndex], ...nextDot});
  });
  return result;
};

const mergeMarkedData = (list: ReadonlyArray<MarkedDayData>) => {
  return list.reduce((r, {dots, ...rest}) => {
    Object.assign(r, rest, {dots: mergeDots(r.dots, dots)});
    return r;
  }, {} as MarkedDayData);
};

// endregion merge

const getMarkedDaysListOrDefault = (
  markedDays: MarkedDays | undefined,
): ReadonlyArray<MarkedDayItem> | null => {
  if (Array.isArray(markedDays)) {
    return markedDays;
  } else if (typeof markedDays === 'object') {
    return (markedDays as MarkedDaysObject).list ?? null;
  } else {
    return null;
  }
};
const getMarkedDaysSelectorOrDefault = (
  markedDays: MarkedDays | undefined,
): MarkedDaysSelector | null => {
  if (typeof markedDays === 'function') {
    return markedDays;
  } else if (markedDays !== undefined && !Array.isArray(markedDays)) {
    return (markedDays as MarkedDaysObject).selector ?? null;
  } else {
    return null;
  }
};

type MarkedDaysVal = {
  // staticMarks and dynamicMarks are superficially updated every time
  staticMarks: UnifiedMarkedDays | null;
  dynamicMarks: UnifiedMarkedDays | null;
};

const MarkedDaysContext = createContext<MarkedDaysVal | undefined>(undefined);

type MarkedDaysProviderProps = PropsWithChildren<{
  markedDays: MarkedDays | undefined;
}>;

const useStaticMarks = (markedDays: MarkedDays | undefined) => {
  const [staticMarks, setStaticMarks] = useState<UnifiedMarkedDays | null>(
    null,
  );
  const isFirstRender = useIsFirstRender();
  const MDList = getMarkedDaysListOrDefault(markedDays);
  const isMDListChanged = useIsChanged(MDList);

  useEffect(() => {
    if (!isFirstRender && !isMDListChanged) {
      return;
    }
    setStaticMarks(MDList !== null ? unifyMarkedDays({}, MDList) : null);
  }, [MDList, isFirstRender, isMDListChanged, setStaticMarks]);

  return staticMarks;
};

const useDynamicMarks = (markedDays: MarkedDays | undefined) => {
  const [dynamicMarks, setDynamicMarks] = useState<UnifiedMarkedDays | null>(
    null,
  );
  const isFirstRender = useIsFirstRender();
  const activePages = useRenderedPageData();
  const isActivePagesChanged = useIsChanged(activePages);
  const MDSelector = getMarkedDaysSelectorOrDefault(markedDays);
  const isMDSelectorChanged = useIsChanged(MDSelector);

  useEffect(() => {
    if (!(isFirstRender || isMDSelectorChanged || isActivePagesChanged)) {
      return;
    }
    if (MDSelector === null) {
      setDynamicMarks(null);
    } else {
      // TODO [optimize] We need to compare which date range was removed and which one was added.
      //  Relative to this, call the selector and remove the dates
      const dist = {};
      activePages.forEach(({start, end}) => {
        unifyMarkedDays(dist, MDSelector({start: fDay(start), end: fDay(end)}));
      });
      setDynamicMarks(dist);
    }
  }, [
    MDSelector,
    activePages,
    isActivePagesChanged,
    isFirstRender,
    isMDSelectorChanged,
  ]);

  return dynamicMarks;
};

const MarkedDaysProvider = ({
  markedDays,
  children,
}: MarkedDaysProviderProps) => {
  const result = useMemoObject<MarkedDaysVal>({
    staticMarks: useStaticMarks(markedDays),
    dynamicMarks: useDynamicMarks(markedDays),
  });

  return <MarkedDaysContext.Provider value={result} children={children} />;
};

export default MarkedDaysProvider;

const useMarkedDays = createRequiredContextValueHook(
  MarkedDaysContext,
  'useMarkedDays',
  'MarkedDaysProvider',
);

export const useMarkedData = (day: dayjs.Dayjs) => {
  const {staticMarks, dynamicMarks} = useMarkedDays();
  return useMemo(() => {
    const dayUtc = day.utc(true);
    const staticData = getMarkedDataList(staticMarks ?? {}, dayUtc);
    const dynamicData = getMarkedDataList(dynamicMarks ?? {}, dayUtc);
    if (
      (staticData === undefined || staticData.length === 0) &&
      (dynamicData === undefined || dynamicData.length === 0)
    ) {
      return null;
    }
    return mergeMarkedData([...(staticData ?? []), ...(dynamicData ?? [])]);
  }, [day, dynamicMarks, staticMarks]);
};
