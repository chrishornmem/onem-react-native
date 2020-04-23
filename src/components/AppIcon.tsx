import React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import { Icon } from 'react-native-elements';

export const AppIcon = (props: {
  name: IconSource;
  iconBg?: string;
  iconColor?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) => {
  const { name, iconBg, iconColor, size, style, ...rest } = props;

    console.log("/appIcon");
    console.log(props);

  return (
    <View
      style={[styles.item, { backgroundColor: iconBg }, style]}
      pointerEvents="box-none"
    >
      <Icon {...rest} name={name} size={size} color={iconColor}  />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    margin: 8,
    height: 40,
    width: 40,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
