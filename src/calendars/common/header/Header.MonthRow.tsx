import React, {memo} from 'react';
import {Text, View} from 'react-native';
import {useLocale} from '../providers/LocaleProvider';
import {useStyles} from '../providers/StylesProvider';
import {toUpperFirstCase} from '@utils/string';
import {useCustomRenders} from '../providers/CustomRendersProvider';
import {toPersianNumber} from '@utils/persian';

export type HeaderMonthRowProps = {year: number; month: number};

const HeaderMonthRow = ({year, month}: HeaderMonthRowProps) => {
  const {months} = useLocale();
  const {base, prop} = useStyles();
  const {renderMonthHeaderTitle} = useCustomRenders();
  const title = `${toUpperFirstCase(months[month] ?? '')} ${toPersianNumber(
    year,
  )}`;

  const renderTitle = () => {
    if (renderMonthHeaderTitle !== undefined) {
      return renderMonthHeaderTitle({title, month, year});
    }
    return (
      <Text style={[base.monthTitleStyle, prop.monthTitleStyle]}>{title}</Text>
    );
  };

  return (
    <View style={[base.monthRowStyle, prop.monthRowStyle]}>
      {renderTitle()}
    </View>
  );
};

HeaderMonthRow.displayName = 'Header.MonthRow';

export default memo(HeaderMonthRow);
