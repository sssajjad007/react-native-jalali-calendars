import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

const Divider = () => {
  return <View style={styles.root} />;
};

const styles = StyleSheet.create({
  root: {borderBottomColor: '#d9d9d9', borderBottomWidth: 0.5},
});

export default memo(Divider);
