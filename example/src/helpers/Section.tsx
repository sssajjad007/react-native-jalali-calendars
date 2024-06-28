import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native';
import Divider from './Divider';

type SectionProps = PropsWithChildren<{title: string}>;

const Section = ({title, children}: SectionProps) => {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      <Divider />
      {children}
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {paddingVertical: 8},
  title: {
    fontSize: 20,
    paddingHorizontal: 20,
    fontWeight: '500',
    marginBottom: 12,
  },
});

export default Section;
