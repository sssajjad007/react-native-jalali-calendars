import React, {memo} from 'react';
import {MonthCalendar} from '@sssajjad007/react-native-jalali-calendars';

type MonthCalendarExampleProps = {
  width: number;
};

const MonthCalendarExample = ({width}: MonthCalendarExampleProps) => {
  return <MonthCalendar calendarWidth={width} locale={'fa'} />;
};

export default memo(MonthCalendarExample);
