import * as React from 'react';

import {SafeAreaView, StyleSheet, useWindowDimensions} from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView as GHScrollView,
} from 'react-native-gesture-handler';
import MonthCalendarExample from './calendars/MonthCalendarExample';
import WeekCalendarExample from './calendars/WeekCalendarExample';
import WMCalendarExample from './calendars/WMCalendarExample';
import Box from './helpers/Box';
import Section from './helpers/Section';

export default function App() {
  const {width} = useWindowDimensions();

  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <GHScrollView contentContainerStyle={styles.contentContainerStyle}>
          <Section title={'Week Calendar'}>
            <WeekCalendarExample width={width} />
          </Section>
          <Box height={60} />
          <Section title={'Month Calendar'}>
            <MonthCalendarExample width={width} />
          </Section>
          <Box height={60} />
          <Section title={'Week-Month Calendar'}>
            <WMCalendarExample width={width} />
          </Section>
        </GHScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {paddingVertical: 20},
});
