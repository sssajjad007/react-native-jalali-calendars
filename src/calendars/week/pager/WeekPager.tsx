import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';
import useWeekArrayIndex from './usePageIndexNumber';
import WeekPageView from './WeekPage';
import {
  CalendarMethods,
  FlatListPager,
  GetPageHeight,
  RenderPage,
  SyncIndexConfig,
  useAnimatedPagerHeight,
  useCalendarWidth,
  useLocaledDayjs,
  useRenderedPageData,
  WeekPageIndex,
} from '@calendars/common';
import {getPageIndexNumber, getWeekPageIndexByDay} from '../utils/page-index';
import Animated, {SharedValue, useAnimatedRef} from 'react-native-reanimated';
import type {FlatList, StyleProp, ViewStyle} from 'react-native';
import {
  useWeekPageIndexes,
  useWeekPageIndexProgress,
  useWeekPageIndexState,
} from './WeekPagesProvider';
import {useMemoArray, useStableCallback} from '@rozhkov/react-useful-hooks';
import {
  useAnimatedListener,
  useMemoAnimatedStyle,
} from '@utils/react-native-reanimated';

const keyExtractor = (_: any, index: number) => index.toString();

export type WeekPagerProps = {
  pageHeight: number | GetPageHeight | undefined;
  style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  onHeightChanged?: SharedValue<number>;
  syncIndexIfChanged?: Partial<SyncIndexConfig>;
  translateY?: SharedValue<number>;
  opacity?: SharedValue<number>;
  windowSize?: number;
};

const WeekPager = (
  {
    pageHeight,
    style: styleProp,
    pointerEvents,
    onHeightChanged,
    syncIndexIfChanged,
    translateY,
    opacity,
    windowSize,
  }: WeekPagerProps,
  forwardedRef: ForwardedRef<CalendarMethods>,
) => {
  const ldayjs = useLocaledDayjs();
  const indexes = useWeekPageIndexes();
  const pagerRef = useAnimatedRef<FlatList<WeekPageIndex>>();
  const curIndex = useWeekArrayIndex();
  const calendarWidth = useCalendarWidth();
  const [, changePageIndex] = useWeekPageIndexState();
  const changeIndex = useStableCallback((index: number) => {
    changePageIndex(indexes[index]!);
  });

  const indexProgressSv = useWeekPageIndexProgress();
  const pages = useRenderedPageData('week');
  const pagerHeightSv = useAnimatedPagerHeight(indexProgressSv, pages);
  const style = useMemoAnimatedStyle(() => {
    'worklet';
    return {
      height: pagerHeightSv.value,
      transform: [{translateY: translateY?.value ?? 0}],
      opacity: opacity?.value ?? 1,
    };
  }, [pagerHeightSv, translateY, opacity]);

  useAnimatedListener(pagerHeightSv, onHeightChanged);
  useImperativeHandle(forwardedRef, () => ({
    scrollToToday: ({animated} = {}) => {
      if (pagerRef.current === null) {
        return;
      }
      const targetIndex = getPageIndexNumber(
        indexes,
        getWeekPageIndexByDay(ldayjs()),
      );
      if (targetIndex < 0) {
        if (__DEV__) {
          console.warn("Today's page is not exists");
        }
        return;
      }
      pagerRef.current.scrollToIndex({index: targetIndex, animated});
    },
  }));

  const styleResult = useMemoArray([styleProp, style]);
  const renderPage = useCallback<RenderPage<WeekPageIndex>>(
    ({item, index}) => (
      <WeekPageView
        pageIndex={item}
        arrayIndex={index}
        pageHeight={pageHeight}
      />
    ),
    [pageHeight],
  );

  return (
    <FlatListPager<WeekPageIndex>
      ref={pagerRef}
      style={styleResult}
      data={indexes}
      keyExtractor={keyExtractor}
      index={curIndex}
      onChangeIndex={changeIndex}
      syncIndexIfChanged={syncIndexIfChanged}
      horizontal={true}
      pageLength={calendarWidth}
      pointerEvents={pointerEvents}
      renderPage={renderPage}
      windowSize={windowSize}
    />
  );
};

export default forwardRef(WeekPager);
