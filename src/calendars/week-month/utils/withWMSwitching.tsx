import React, {
  ComponentType,
  ForwardedRef,
  forwardRef,
  RefObject,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {ScrollViewProps as RNScrollViewProps} from 'react-native';
import {
  Gesture,
  GestureDetector,
  NativeViewGestureHandlerProps,
} from 'react-native-gesture-handler';
import type {
  Disconnect,
  WMCalendarInternalMethods,
} from '../hooks/useWMCalendarRef';
import {
  AnimatedRef,
  DerivedValue,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useScrollViewOffset,
} from 'react-native-reanimated';
import {useRefInstanceLifeCycleEffect, useSetRefs} from '@utils/react-hooks';
import type {CalendarMethods} from '@calendars/common';
import type {CalendarType} from '../types';
import {
  isFastSwipeDown,
  isFastSwipeUp,
} from '@utils/react-native-gesture-handler';
import type {AnimatedScrollView} from 'react-native-reanimated/lib/typescript/reanimated2/component/ScrollView';

const useConnectionPayload = (calendarRef: RefObject<CalendarMethods>) => {
  const [payload, setPayload] = useState<ConnectionPayload | null>(null);

  const disconnect = useRef<Disconnect | null>(null);
  useRefInstanceLifeCycleEffect(
    calendarRef as RefObject<CalendarMethods & WMCalendarInternalMethods>,
    {
      onAttached: (instance) => {
        disconnect.current = instance._connectOuterSwitchContainer(
          setPayload,
          setPayload,
        );
      },
      onUnattached: () => {
        disconnect.current?.();
        setPayload(null);
      },
      onStopListening: () => {
        disconnect.current?.();
      },
    },
  );

  return payload;
};

const useIsScrolledStart = (scrollRef: AnimatedRef<AnimatedScrollView>) => {
  const [isScrolledStart, setIsScrolledStart] = useState(true);

  const scrollOffsetSv = useScrollViewOffset(scrollRef);
  useAnimatedReaction(
    () => scrollOffsetSv.value,
    (cur, prev) => {
      prev = prev === null ? 0 : prev;
      if (cur <= 0 && prev > 0) {
        runOnJS(setIsScrolledStart)(true);
      } else if (cur > 0 && prev <= 0) {
        runOnJS(setIsScrolledStart)(false);
      }
    },
    [scrollOffsetSv],
  );

  return isScrolledStart;
};

export type ConnectionPayload = {
  type: CalendarType;
  weekPagerHeightSv: DerivedValue<number>;
  monthPagerHeightSv: DerivedValue<number>;
  typeProgressSv: SharedValue<number>;
  setTypeProgressEnd: (calendarType?: CalendarType | undefined) => void;
};

type WrappedScrollViewProps<
  ScrollViewPropsT = RNScrollViewProps & NativeViewGestureHandlerProps,
> = {calendarRef: RefObject<CalendarMethods>} & ScrollViewPropsT;

const withWMSwitching = <PropsT,>(WrappedScrollView: ComponentType<PropsT>) => {
  const Wrapper = (
    {
      calendarRef,
      scrollEnabled = true,
      waitFor: waitForProp,
      scrollEventThrottle = 16,
      ...restProps
    }: WrappedScrollViewProps,
    forwardedRef: ForwardedRef<any>,
  ) => {
    const scrollRef = useAnimatedRef<AnimatedScrollView>();
    const panRef = useRef();
    const setScrollRefs = useSetRefs(scrollRef, forwardedRef);
    const payload = useConnectionPayload(calendarRef);
    const isScrolledStart = useIsScrolledStart(scrollRef);

    const pan = useMemo(() => {
      const gesture = Gesture.Pan().runOnJS(false).withRef(panRef);
      if (payload === null || !isScrolledStart) {
        return gesture.enabled(false);
      }
      const {
        type,
        setTypeProgressEnd,
        weekPagerHeightSv,
        monthPagerHeightSv,
        typeProgressSv,
      } = payload;
      const isWeekType = type === 'week';
      const isMonthType = type === 'month';
      const updateTypeProgressByTouch = ({
        translationY,
      }: {
        translationY: number;
      }) => {
        'worklet';
        const weekPagerHeight = weekPagerHeightSv.value;
        const monthPagerHeight = monthPagerHeightSv.value;
        const inputs = isWeekType
          ? [0, monthPagerHeight - weekPagerHeight]
          : [0, weekPagerHeight - monthPagerHeight];
        const outputs = isWeekType ? [0, 1] : [1, 0];
        typeProgressSv.value = interpolate(
          translationY,
          inputs,
          outputs,
          'clamp',
        );
      };
      return gesture
        .failOffsetX([-5, 5])
        .failOffsetY(isWeekType ? -2 : -100000)
        .activeOffsetY(isWeekType ? 2 : [-2, 2])
        .onChange(updateTypeProgressByTouch)
        .onEnd(({velocityY}) => {
          'worklet';
          if (isWeekType && isFastSwipeDown(velocityY)) {
            setTypeProgressEnd('month');
          } else if (isMonthType && isFastSwipeUp(velocityY)) {
            setTypeProgressEnd('week');
          } else {
            setTypeProgressEnd();
          }
        });
    }, [isScrolledStart, payload]);

    const waitForPropArray = Array.isArray(waitForProp)
      ? waitForProp
      : waitForProp === undefined
      ? []
      : [waitForProp];

    return (
      <GestureDetector gesture={pan}>
        <WrappedScrollView
          {...(restProps as PropsT)}
          scrollEnabled={
            scrollEnabled && (payload === null || payload.type === 'week')
          }
          scrollEventThrottle={scrollEventThrottle}
          waitFor={
            isScrolledStart ? [...waitForPropArray, panRef] : waitForPropArray
          }
          ref={setScrollRefs}
        />
      </GestureDetector>
    );
  };

  Wrapper.displayName = `withWMSwitching(${WrappedScrollView.displayName})`;

  return forwardRef(Wrapper) as ComponentType<WrappedScrollViewProps<PropsT>>;
};

export default withWMSwitching;
