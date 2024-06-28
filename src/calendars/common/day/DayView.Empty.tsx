import React, {memo} from 'react';
import {View} from 'react-native';
import {useStyles} from '../providers/StylesProvider';
import type {FDay} from '@utils/day';

type DayViewEmptyProps = {
  day: FDay;
  isToday: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isSecondary: boolean;
};

const DayViewEmpty = ({
  day,
  isSecondary,
  isSelected,
  isToday,
  isDisabled,
}: DayViewEmptyProps) => {
  const {base, prop} = useStyles();

  const style =
    typeof prop.dayContainerStyle === 'function'
      ? prop.dayContainerStyle({
          day,
          isToday,
          isDisabled,
          isSelected,
          isSecondary,
        })
      : prop.dayContainerStyle;

  return <View style={[base.dayContainerStyle, style]} />;
};

DayViewEmpty.displayName = 'DayView.Empty';

export default memo(DayViewEmpty);
