import React, {memo} from 'react';
import {WMCalendar} from 'react-native-jalali-calendars';
import {StyleSheet, Text, View} from 'react-native';

type WMCalendarExampleProps = {width: number};

// TODO add a button to switch between view modes
const WMCalendarExample = ({width}: WMCalendarExampleProps) => {
  return (
    <View style={styles.root}>
      <WMCalendar
        locale={'fa'}
        calendarWidth={width}
        markedDays={[
          ['1403-04-02', '1403-04-14', {dots: [{color: 'red', key: 1}]}], // range from '1403-04-02' to '1403-04-14'
          ['1403-04-05', '1403-04-10', {dots: [{color: 'green', key: 2}]}], // range from '1403-04-05' to '1403-04-10'
        ]}
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
