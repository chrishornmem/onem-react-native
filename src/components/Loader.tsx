import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal } from 'react-native-paper';

export const Loader = (props: {}) => {
  const { ...rest } = props;

  return (
    <>
      {Platform.OS == 'android' ? (
        <Portal>
          <View style={styles.loading}>
            <ActivityIndicator {...rest} size="large" />
          </View>
        </Portal>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator {...rest} size="large" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
