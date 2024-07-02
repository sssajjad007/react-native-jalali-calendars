import React, {memo} from 'react';
import {MonthCalendar} from '@sssajjad007/react-native-jalali-calendars';

type MonthCalendarExampleProps = {
  width: number;
};

const MonthCalendarExample = ({width}: MonthCalendarExampleProps) => {
  return (
    <MonthCalendar
      onDayPress={(day) => console.log(day)}
      dayContainerStyle={({isToday}) => {
        if (isToday) {
          return {
            backgroundColor: 'pink',
          };
        }
      }}
      calendarWidth={width}
      locale={'fa'}
    />
  );
};

export default memo(MonthCalendarExample);
