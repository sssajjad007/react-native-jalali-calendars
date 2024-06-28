import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type dayjs from 'dayjs';
import {
  useIsChanged,
  useIsFirstRender,
  useMemoObject,
  useStableCallback,
} from '@rozhkov/react-useful-hooks';
import type {FDay} from '@utils/day';
import {fDay} from '@utils/day';
import {createRequiredContextValueHook} from '@utils/react-hooks';

export type PageType = 'week' | 'month';

export type PageDataBase<DayT extends FDay | dayjs.Dayjs> = {
  key: string;
  arrayIndex: number;
  type: PageType;
  start: DayT;
  end: DayT;
  pageHeight: number;
  rowCount: number;
};

export type PageData = PageDataBase<dayjs.Dayjs>;
export type PageDataProp = PageDataBase<FDay>;

const mapDataToProp = (data: PageData): PageDataProp => ({
  key: data.key,
  arrayIndex: data.arrayIndex,
  type: data.type,
  start: fDay(data.start),
  end: fDay(data.end),
  pageHeight: data.pageHeight,
  rowCount: data.rowCount,
});

type RenderedPagesEventsVal = {
  onPageMounted: (data: PageData) => void;
  onPageChanged: (data: PageData) => void;
  onPageUnmounted: (key: string) => void;
};
type RenderedPagesDataVal = ReadonlyArray<PageData>;

const RenderedPageEventsContext = createContext<
  RenderedPagesEventsVal | undefined
>(undefined);
const RenderedPageDataContext = createContext<RenderedPagesDataVal | undefined>(
  undefined,
);

export type OnPageMounted = (data: PageDataProp) => void;
export type OnPageUnmounted = (data: PageDataProp) => void;

type RenderedPagesProviderProps = PropsWithChildren<{
  onPageMounted: OnPageMounted | undefined;
  onPageUnmounted: OnPageUnmounted | undefined;
}>;

const RenderedPagesProvider = ({
  onPageMounted: onPageMountedProp,
  onPageUnmounted: onPageUnmountedProp,
  children,
}: RenderedPagesProviderProps) => {
  const [pages, setPages] = useState<ReadonlyArray<PageData>>([]);

  const onPageMounted = useStableCallback((data: PageData) => {
    onPageMountedProp?.(mapDataToProp(data));
    setPages((prev) => [...prev, data]);
  });
  const onPageChanged = useCallback((data: PageData) => {
    setPages((prev) => {
      const index = prev.findIndex((x) => x.key === data.key);
      if (index < 0) {
        throw new Error('Page not found');
      }
      const result = [...prev];
      result.splice(index, 1, data);
      return result;
    });
  }, []);
  const onPageUnmounted = useStableCallback((key: string) => {
    setPages((prev) => {
      const index = prev.findIndex((x) => x.key === key);
      if (index < 0) {
        throw new Error('Page not found');
      }
      onPageUnmountedProp?.(mapDataToProp(prev[index]!));
      const result = [...prev];
      result.splice(index, 1);
      return result;
    });
  });

  const events = useMemoObject<RenderedPagesEventsVal>({
    onPageMounted,
    onPageChanged,
    onPageUnmounted,
  });

  return (
    <RenderedPageDataContext.Provider value={pages}>
      <RenderedPageEventsContext.Provider value={events} children={children} />
    </RenderedPageDataContext.Provider>
  );
};

export default RenderedPagesProvider;

export const useRenderedPageData = (type?: PageType) => {
  const value = useContext(RenderedPageDataContext);
  if (value === undefined) {
    throw new Error(
      'useRenderedPagesData must be called from within RenderedPagesProvider!',
    );
  }
  if (type === undefined) {
    return value;
  }
  return value.filter((x) => x.type === type);
};

export const useRenderedPageEvents = createRequiredContextValueHook(
  RenderedPageEventsContext,
  'useRenderedPageEvents',
  'RenderedPagesProvider',
);

const createPageKey = (type: PageType, arrayIndex: number) =>
  `${type}_${arrayIndex}`;

export const useRenderedPageRegisterEffect = (
  type: PageType,
  arrayIndex: number,
  pageHeight: number,
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  rowCount: number,
) => {
  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (useIsChanged(type)) {
      throw new Error('Page type cannot be changed');
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (useIsChanged(arrayIndex)) {
      throw new Error('Array index cannot be changed');
    }
  }
  const key = createPageKey(type, arrayIndex);

  const {onPageMounted, onPageChanged, onPageUnmounted} =
    useRenderedPageEvents();
  const isFirstRender = useIsFirstRender();

  useEffect(() => {
    if (isFirstRender) {
      return;
    }
    onPageChanged({key, arrayIndex, start, end, pageHeight, type, rowCount});
  }, [start, end, pageHeight, rowCount]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onPageMounted({key, arrayIndex, start, end, pageHeight, type, rowCount});
    return () => {
      onPageUnmounted(key);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
