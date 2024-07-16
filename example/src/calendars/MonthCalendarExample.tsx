import React, {memo} from 'react';
import {MonthCalendar} from 'react-native-jalali-calendars';

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
        return {}; // Add a return statement when isToday is false
      }}
      calendarWidth={width}
      locale={'fa'}
    />
  );
};

export default memo(MonthCalendarExample);
