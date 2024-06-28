import React, {memo} from 'react';
import {WMCalendar} from '@sssajjad007/react-native-jalali-calendars';
import {StyleSheet, Text, View} from 'react-native';

type WMCalendarExampleProps = {width: number};

// TODO add a button to switch between view modes
const WMCalendarExample = ({width}: WMCalendarExampleProps) => {
  return (
    <View style={styles.root}>
      <WMCalendar
        locale={'fa'}
        calendarWidth={width}
        onDayPress={(day) => {
          console.log(day);
        }}
      />
      <Text style={styles.bottomSecondary}>
        You can switch views with a gesture (swipe up/down)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {minHeight: 360},
  bottomSecondary: {paddingVertical: 4, paddingHorizontal: 20, color: 'gray'},
});

export default memo(WMCalendarExample);
