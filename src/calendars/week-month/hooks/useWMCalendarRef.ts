import {ForwardedRef, RefObject, useEffect, useImperativeHandle} from 'react';
import type {ConnectionPayload} from '../utils/withWMSwitching';
import type {DerivedValue, SharedValue} from 'react-native-reanimated';
import {
  useArgByRef,
  useInit,
  useIsFirstRender,
  useMemoObject,
} from '@rozhkov/react-useful-hooks';
import type {CalendarMethods} from '@calendars/common';
import EventEmitter from '@utils/event-emitter';
import type {CalendarType} from '../types';

export type Disconnect = () => void;

export type WMCalendarInternalMethods = {
  _connectOuterSwitchContainer: (
    onInitialization: (payload: ConnectionPayload) => void,
    onPayloadChanged: (payload: ConnectionPayload) => void,
  ) => Disconnect;
};

const useWMCalendarRef = (
  forwardedRef: ForwardedRef<CalendarMethods>,
  {
    type,
    weekPagerRef,
    monthPagerRef,
    typeProgressSv,
    weekPagerHeightSv,
    monthPagerHeightSv,
    setTypeProgressEnd,
    snapToWeek,
  }: {
    type: CalendarType;
    weekPagerRef: RefObject<CalendarMethods>;
    monthPagerRef: RefObject<CalendarMethods>;
    weekPagerHeightSv: DerivedValue<number>;
    monthPagerHeightSv: DerivedValue<number>;
    typeProgressSv: SharedValue<number>;
    setTypeProgressEnd: () => void;
    snapToWeek?: () => void;
  },
) => {
  const emitter = useInit(() => new EventEmitter());
  const changedEventName = 'changed-payload';

  const typeRef = useArgByRef(type);
  const isFirstRender = useIsFirstRender();
  const payload = useMemoObject<ConnectionPayload>({
    type,
    typeProgressSv,
    weekPagerHeightSv,
    monthPagerHeightSv,
    setTypeProgressEnd,
  });
  const payloadRef = useArgByRef(payload);

  useEffect(() => {
    if (isFirstRender) {
      return;
    }
    emitter.emit(changedEventName, payload);
  }, [changedEventName, emitter, isFirstRender, payload]);

  useImperativeHandle(
    forwardedRef as ForwardedRef<CalendarMethods & WMCalendarInternalMethods>,
    () => {
      const inst =
        typeRef.current === 'week'
          ? weekPagerRef.current
          : monthPagerRef.current;
      return {
        scrollToToday: (...params) => inst?.scrollToToday(...params),
        _connectOuterSwitchContainer: (onInitialization, onPayloadChanged) => {
          onInitialization(payloadRef.current);
          const subscription = emitter.addListener(
            changedEventName,
            onPayloadChanged,
          );
          return () => {
            subscription.remove();
          };
        },
        snapToWeekMode: () => {
          snapToWeek?.();
        },
      };
    },
    [type], // eslint-disable-line react-hooks/exhaustive-deps
  );
};

export default useWMCalendarRef;
