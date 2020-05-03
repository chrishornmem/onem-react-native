import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

export const EditButton = (props: {
  children: any;
  onPress?: any;
  disabled?: boolean;
  mode?: 'text' | 'outlined' | 'contained';
  style?: StyleProp<ViewStyle>;
}) => {
  const { style, onPress, children, ...rest } = props;
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        style={[styles.button, style]}
        onPress={onPress}
        color={theme.colors.text}
        {...rest}
    //    compact
      >
        {children}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
   // flexShrink: 1,
    flexDirection: 'row',
  },
  button: {
    // margin: 8,
    // height: 40,
       width: '50%',
    //  minWidth: 'auto',
    //    flexBasis: 0,
    //    flexShrink: 2,
    // flexDirection: 'row'
    // borderRadius: 8,
    // borderWidth: StyleSheet.hairlineWidth,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
