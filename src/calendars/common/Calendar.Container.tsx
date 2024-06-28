import React, {PropsWithChildren, useState} from 'react';
import {LayoutChangeEvent, View} from 'react-native';
import CalendarWidthContext from './providers/CalendarWidthContext';
import {useStyles} from './providers/StylesProvider';

type CalendarContainerProps = PropsWithChildren<{
  width: number | undefined;
}>;

const CalendarContainer = ({
  width: widthProp,
  children,
}: CalendarContainerProps) => {
  const [calendarWidthStt, setCalendarWidthStt] = useState<number | null>(null);
  const onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const width = nativeEvent.layout.width;
    if (calendarWidthStt !== width) {
      setCalendarWidthStt(width);
    }
  };
  const width = widthProp ?? calendarWidthStt;
  const {prop} = useStyles();

  return (
    <View style={[prop.containerStyle, {width: widthProp}]} onLayout={onLayout}>
      {width != null && (
        <CalendarWidthContext.Provider value={width}>
          {children}
        </CalendarWidthContext.Provider>
      )}
    </View>
  );
};

CalendarContainer.displayName = 'Calendar.Container';

export default CalendarContainer;
