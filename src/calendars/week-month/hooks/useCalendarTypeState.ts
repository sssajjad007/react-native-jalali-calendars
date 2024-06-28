import {useIsFirstRender, useStableCallback} from '@rozhkov/react-useful-hooks';
import {useEffect, useState} from 'react';
import type {CalendarType} from '../types';

export type OnTypeChanged = (data: {type: CalendarType}) => void;

const useCalendarTypeState = (
  typeProp: CalendarType | undefined,
  onChangedProp: OnTypeChanged | undefined,
) => {
  const [type, setType] = useState(typeProp ?? 'week');

  const change = useStableCallback((tp: CalendarType) => {
    onChangedProp?.({type: tp});
    setType(tp);
  });

  const isFirstRender = useIsFirstRender();
  useEffect(() => {
    if (typeProp !== undefined && typeProp !== type && !isFirstRender) {
      setType(typeProp);
    }
  }, [isFirstRender, type, typeProp]);

  return [type, change] as [typeof type, typeof change];
};

export default useCalendarTypeState;
