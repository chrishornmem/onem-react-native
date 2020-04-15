import * as React from 'react';
import { View, Text } from 'react-native';

export function LoginScreen({ route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login!</Text>
      <Text>{route?.params?.user ? route.params.user : 'Noone'}'s profile</Text>
    </View>
  );
}
