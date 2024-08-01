import React, {isValidElement, useMemo} from 'react';
import type dayjs from 'dayjs';
import {useCustomRenders} from '../providers/CustomRendersProvider';
import DayView from './DayView';
import DayViewEmpty from './DayView.Empty';
import {useIsDayToday, useToday} from '../providers/TodayProvider';
import {useMarkedData} from '../providers/MarkedDaysProvider';
import {
  useDayInRange,
  useIsSelectedDay,
  useOnDayPress,
} from '../providers/DayProvider';
import {useStableCallback} from '@rozhkov/react-useful-hooks';
import DotsContext from '../dot/DotsContext';
import {EMPTY_ARRAY} from 'default-values';
import {fDay} from '@utils/day';
import shareData from '../shareData';

type DayProps = {
  day: dayjs.Dayjs;
  isSecondary?: boolean;
};

const Day = ({day, isSecondary = false}: DayProps) => {
  const {renderDay} = useCustomRenders();
  const markedData = useMarkedData(day);
  const isSelected = useIsSelectedDay(day) || Boolean(markedData?.selected);
  const isDisabled = !useDayInRange(day) || Boolean(markedData?.disabled);
  const isToday = useIsDayToday(day);
  const today = useToday();
  const fday = useMemo(() => fDay(day), [day]);
  const onDayPress = useOnDayPress();
  const onPress = useStableCallback(() => onDayPress({day, isDisabled}));
  const onToday = () => {
    onDayPress({day: today, isDisabled});
  };
  shareData.calendar.onTodayPress = onToday;

  const renderContent = () => {
    if (renderDay != null) {
      const customDay = renderDay({
        day: fday,
        onPress,
        isSecondary,
        isDisabled,
        isSelected,
        isToday,
      });

      return isValidElement(customDay) ? (
        customDay
      ) : (
        <DayViewEmpty
          day={fday}
          isSelected={isSelected}
          isDisabled={isDisabled}
          isToday={isToday}
          isSecondary={isSecondary}
        />
      );
    }
    return (
      <DayView
        date={day.date()}
        day={fday}
        isSelected={isSelected}
        isDisabled={isDisabled}
        isToday={isToday}
        isSecondary={isSecondary}
        onPress={onPress}
      />
    );
  };

  return (
    <DotsContext.Provider value={markedData?.dots ?? EMPTY_ARRAY}>
      {renderContent()}
    </DotsContext.Provider>
  );
};

export default Day;
