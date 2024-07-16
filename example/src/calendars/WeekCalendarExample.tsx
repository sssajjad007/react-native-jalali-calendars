import React, {memo} from 'react';
import {WeekCalendar} from 'react-native-jalali-calendars';

type WeekCalendarExampleProps = {
  width: number;
};

const WeekCalendarExample = ({width}: WeekCalendarExampleProps) => {
  return <WeekCalendar calendarWidth={width} locale={'fa'} />;
};

export default memo(WeekCalendarExample);
