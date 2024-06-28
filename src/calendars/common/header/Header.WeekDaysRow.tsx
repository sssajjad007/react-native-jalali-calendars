import React, {memo} from 'react';
import {Text, View} from 'react-native';
import {useLocale} from '../providers/LocaleProvider';
import {useStyles} from '../providers/StylesProvider';
import {getSortedWeekDayNames} from './utils';

type WeekDayProp = {title: string};

const WeekDay = memo(({title}: WeekDayProp) => {
  const {base, prop} = useStyles();

  return (
    <View style={[base.weekDayContainerStyle, prop.weekDayContainerStyle]}>
      <Text style={[base.weekDayTitleStyle, prop.weekDayTitleStyle]}>
        {title}
      </Text>
    </View>
  );
});

WeekDay.displayName = 'Header.WeekDay';

const HeaderWeekDaysRow = () => {
  const {weekDays, weekStart} = useLocale();
  const sortedWeekDays = getSortedWeekDayNames(weekDays, weekStart);
  const {base, prop} = useStyles();

  return (
    <View style={[base.weekDayRowStyle, prop.weekDayRowStyle]}>
      {sortedWeekDays.map((weekDay) => (
        <WeekDay key={weekDay} title={weekDay} />
      ))}
    </View>
  );
};

HeaderWeekDaysRow.displayName = 'Header.WeekDaysRow';

export default memo(HeaderWeekDaysRow);
