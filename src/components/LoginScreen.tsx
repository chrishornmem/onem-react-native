import * as React from 'react';
import { Linking, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

export function LoginScreen({ route }) {
  const navigation = useNavigation();
  const jumpToHome = DrawerActions.jumpTo('Home');

  return (
    <>{Linking.openURL('https://authenticate.onem.zone')}</>
    // <WebView source={{ uri: 'https://authenticate.onem.zone' }} />

    // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    //   <Text>Login!</Text>
    //   <Text>{route?.params?.user ? route.params.user : 'Noone'}'s profile</Text>
    //   <Button
    //     onPress={() => {
    //       navigation.dispatch(jumpToHome);
    //     }}
    //   >
    //     Go home
    //   </Button>
    // </View>
  );
}
