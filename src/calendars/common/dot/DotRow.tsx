import React, {memo} from 'react';
import type {DotData} from '../providers/MarkedDaysProvider';
import {View} from 'react-native';
import {useStyles} from '../providers/StylesProvider';
import {useDots} from './DotsContext';

type DotProps = {
  isDaySelected: boolean;
} & DotData;

const Dot = memo(({isDaySelected, color, selectedColor}: DotProps) => {
  const {base, prop} = useStyles();
  const backgroundColor = isDaySelected ? selectedColor ?? color : color;

  return (
    <View style={[base.dayDotStyle, prop.dayDotStyle, {backgroundColor}]} />
  );
});

type DotRowProps = {
  isDaySelected: boolean;
};

const DotRow = ({isDaySelected}: DotRowProps) => {
  const {base, prop} = useStyles();
  const dots = useDots();

  if (dots.length === 0) {
    return null;
  }
  return (
    <View style={[base.dayDotRowStyle, prop.dayDotRowStyle]}>
      {dots.map(({key, ...rest}, index) => (
        <Dot key={key ?? index} isDaySelected={isDaySelected} {...rest} />
      ))}
    </View>
  );
};

export default memo(DotRow);
