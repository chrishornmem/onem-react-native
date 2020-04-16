import * as React from 'react';
import { Linking, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { makeKeyFromPrefix } from '../react-client-shared/utils';
import { AuthContext } from '../react-client-shared/reducers/tokenState';

export const LoginScreen: React.FC<{}> = ({}) => {
  const navigation = useNavigation();
  const jumpToHome = DrawerActions.jumpTo('Home');
  const { tokenState, tokenAction }  = React.useContext(AuthContext);

  const token = tokenState.token;

  const AUTH_URL = 'https://authenticate.onem.zone';
  const url = `${AUTH_URL}/login?t=${token}&c=${makeKeyFromPrefix('context')}`;

  console.log('Login token:' + token);

  React.useEffect(() => {
    if (tokenState.token) {
      Linking.openURL(url)
    } else {
      console.log('Token is null');
    }
  }, [tokenState, url]);

  return (
    <></>
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
