import * as React from 'react';
import { Platform } from 'react-native';
import { CommonActions, DrawerActions, useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { makeKeyFromPrefix } from '../react-client-shared/utils';
import { socket } from '../react-client-shared/utils/Socket';
import { AuthContext } from '../react-client-shared/reducers/tokenState';

export const LoginScreen: React.FC<{ navigation: NavigationProp }> = ({
  navigation,
}) => {
  const jumpToHome = DrawerActions.jumpTo('Home');
  const { tokenState, tokenAction } = React.useContext(AuthContext);

  const token = tokenState.token;

  const AUTH_URL = 'https://authenticate.onem.zone';
  const url = `${AUTH_URL}/login?t=${token}&c=${makeKeyFromPrefix('context')}`;

  console.log('Login token:' + token);

  useFocusEffect(
    React.useCallback(() => {
      if (socket) {
        console.log("registering socket")
        socket.on('LOGIN', function () {
          console.log("LOGGING IN dismissing");
          if (Platform.OS === 'ios') {
            WebBrowser.dismissBrowser();
          }
          navigation.dispatch(
            CommonActions.navigate({
              name: 'ChatWindow'
            })
          )
        });
        if (tokenState.token && !tokenState.loggingIn) {
          WebBrowser.openBrowserAsync(url)
        } else {
          console.log('tokenState:');
          console.log(tokenState);
        }
      }
    }, [navigation, tokenState, url])
  );

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
