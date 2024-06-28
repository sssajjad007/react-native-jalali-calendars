import React, {
  ForwardedRef,
  forwardRef,
  RefAttributes,
  useCallback,
  useMemo,
} from 'react';
import {
  getMonthPageIndexOrDefault,
  getSyncedMonthPageIndex,
  getSyncedWeekPageIndex,
  getWeekPageIndexOrDefault,
} from './utils/page-index';
import useCalendarTypeState, {
  OnTypeChanged,
} from './hooks/useCalendarTypeState';
import Header from './header/Header';
import PagersController, {
  RenderMonthPager,
  RenderWeekPager,
} from './pager/PagersController';
import type {GetMonthPagerOffsetY} from './hooks/useMonthPagerOffsetY';
import type {CalendarType} from './types';
import type {AnimConfig} from '@utils/react-native-reanimated';
import {
  BaseCalendarProps,
  baseProviders,
  CalendarContainer,
  CalendarMethods,
  GetPageHeight,
  MonthPageIndex,
  OnPageIndexChanged,
  OnMonthChanged,
  OnMonthInitialized,
  useDayState,
  useLocaledDayjs,
  WeekPageIndex,
} from '@calendars/common';
import type {Day} from '@utils/day';
import {useInit, useStableCallback} from '@rozhkov/react-useful-hooks';
import {
  getWeekPageEndOrDefault,
  getWeekPageStartOrDefault,
  WeekPager,
  WeekPagesProvider,
} from '@calendars/week';
import {
  getMonthPageEndOrDefault,
  getMonthPageStartOrDefault,
  MonthPager,
  MonthPagesProvider,
} from '@calendars/month';

type WMCalendarCoreProps = {
  onPageIndexChanged?: OnPageIndexChanged<WeekPageIndex | MonthPageIndex>;
  pageHeight?:
    | GetPageHeight
    | Partial<Record<CalendarType, number | GetPageHeight>>;
  initPageIndex?: Day;
  pageStart?: MonthPageIndex | Day;
  pageEnd?: MonthPageIndex | Day;
  type?: CalendarType;
  enableSwitchGesture?: boolean;
  switchAnimConfig?: AnimConfig;
  onTypeChanged?: OnTypeChanged;
  monthPagerOffsetY?: GetMonthPagerOffsetY;
  // common props
  visibleMonthHeader?: boolean;
  visibleWeekDaysHeader?: boolean;
  onMonthInitialized?: OnMonthInitialized;
  onMonthChanged?: OnMonthChanged;
  calendarWidth?: number;
};

const WMCalendarCore = (
  {
    type: typeProp,
    onTypeChanged,
    enableSwitchGesture,
    switchAnimConfig,
    initPageIndex,
    pageEnd,
    pageStart,
    onPageIndexChanged,

    pageHeight,
    monthPagerOffsetY,

    calendarWidth,
    visibleMonthHeader = true,
    visibleWeekDaysHeader = true,
    onMonthInitialized,
    onMonthChanged,
  }: WMCalendarCoreProps,
  forwardedRef: ForwardedRef<CalendarMethods>,
) => {
  const [selectedDay] = useDayState();
  const ldayjs = useLocaledDayjs();
  const [type, changeType] = useCalendarTypeState(typeProp, onTypeChanged);

  const {initWeekPageIndex, initMonthPageIndex} = useInit(() => {
    if (type === 'week') {
      const weekIndex = getWeekPageIndexOrDefault(
        initPageIndex,
        selectedDay,
        ldayjs,
      );
      const monthIndex = getSyncedMonthPageIndex(
        ldayjs().year(weekIndex.year).dayOfYear(weekIndex.dayOfYear),
        selectedDay,
      );
      return {
        initWeekPageIndex: weekIndex,
        initMonthPageIndex: monthIndex,
      };
    } else if (type === 'month') {
      const monthIndex = getMonthPageIndexOrDefault(
        initPageIndex,
        selectedDay,
        ldayjs,
      );
      const weekIndex = getSyncedWeekPageIndex(
        ldayjs().year(monthIndex.year).month(monthIndex.month),
        selectedDay,
      );
      return {
        initWeekPageIndex: weekIndex,
        initMonthPageIndex: monthIndex,
      };
    } else {
      throw new Error('No implementation');
    }
  });
  const monthPageStart = useMemo(
    () => getMonthPageStartOrDefault(pageStart, ldayjs),
    [ldayjs, pageStart],
  );
  const monthPageEnd = useMemo(
    () => getMonthPageEndOrDefault(pageEnd, ldayjs),
    [ldayjs, pageEnd],
  );
  const weekPageStart = useMemo(
    () => getWeekPageStartOrDefault(monthPageStart, ldayjs),
    [ldayjs, monthPageStart],
  );
  const weekPageEnd = useMemo(
    () => getWeekPageEndOrDefault(monthPageEnd, ldayjs),
    [ldayjs, monthPageEnd],
  );
  const onWeekPageIndexChanged = useStableCallback<
    OnPageIndexChanged<WeekPageIndex>
  >((e) => {
    if (type === 'week') {
      onPageIndexChanged?.(e);
    }
  });
  const onMonthPageIndexChanged = useStableCallback<
    OnPageIndexChanged<MonthPageIndex>
  >((e) => {
    if (type === 'month') {
      onPageIndexChanged?.(e);
    }
  });
  const {weekPageHeight, monthPageHeight} = useMemo(() => {
    if (typeof pageHeight === 'object') {
      return {
        weekPageHeight: pageHeight.week,
        monthPageHeight: pageHeight.month,
      };
    }
    return {weekPageHeight: pageHeight, monthPageHeight: pageHeight};
  }, [pageHeight]);

  const renderWeekPager = useCallback<RenderWeekPager>(
    (props) => <WeekPager pageHeight={weekPageHeight} {...props} />,
    [weekPageHeight],
  );
  const renderMonthPager = useCallback<RenderMonthPager>(
    (props) => <MonthPager pageHeight={monthPageHeight} {...props} />,
    [monthPageHeight],
  );

  return (
    <WeekPagesProvider
      pageStart={weekPageStart}
      pageEnd={weekPageEnd}
      onPageIndexChanged={onWeekPageIndexChanged}
      initPageIndex={initWeekPageIndex}>
      <MonthPagesProvider
        pageStart={monthPageStart}
        pageEnd={monthPageEnd}
        onPageIndexChanged={onMonthPageIndexChanged}
        initPageIndex={initMonthPageIndex}>
        <CalendarContainer width={calendarWidth}>
          <Header
            calendarType={type}
            visibleMonthHeader={visibleMonthHeader}
            visibleWeekDaysHeader={visibleWeekDaysHeader}
            onMonthInitialized={onMonthInitialized}
            onMonthChanged={onMonthChanged}
          />
          <PagersController
            ref={forwardedRef}
            type={type}
            onChangedType={changeType}
            switchAnimConfig={switchAnimConfig}
            enableSwitchGesture={enableSwitchGesture}
            getMonthPagerOffsetY={monthPagerOffsetY}
            renderWeekPager={renderWeekPager}
            renderMonthPager={renderMonthPager}
          />
        </CalendarContainer>
      </MonthPagesProvider>
    </WeekPagesProvider>
  );
};

export type WMCalendarProps = WMCalendarCoreProps &
  BaseCalendarProps &
  RefAttributes<CalendarMethods>;

const WMCalendar = baseProviders(forwardRef(WMCalendarCore));

WMCalendar.displayName = 'WMCalendar';

export default WMCalendar;
