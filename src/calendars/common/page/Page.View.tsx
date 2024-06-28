import React, {memo} from 'react';
import type {DaysOfWeek} from './utils';
import {View} from 'react-native';
import Day from '../day/Day';
import {useStyles} from '../providers/StylesProvider';
import type dayjs from 'dayjs';

type PageViewProps = {
  width: number;
  height: number;
  rows: ReadonlyArray<DaysOfWeek>;
  isSecondary: (day: dayjs.Dayjs) => boolean;
};

const PageView = ({rows, width, height, isSecondary}: PageViewProps) => {
  const {base, prop} = useStyles();
  return (
    <View
      style={[
        base.pageContainerStyle,
        prop.pageContainerStyle,
        {height, width},
      ]}>
      {rows.map((days, index) => (
        <View key={index} style={[base.dayRowStyle, prop.dayRowStyle]}>
          {days.map((day) => (
            <Day key={day.date()} day={day} isSecondary={isSecondary(day)} />
          ))}
        </View>
      ))}
    </View>
  );
};

PageView.displayName = 'Page.View';

export default memo(PageView);
