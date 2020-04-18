import * as React from 'react';
import { Platform } from 'react-native';
import {
  CommonActions,
  DrawerActions,
  useFocusEffect,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { Linking } from 'expo';
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

  const linkingUrl = Linking.makeUrl() + '?';

  console.log('linkingUrl:' + linkingUrl);
  console.log('tokenState:');
  console.log(tokenState);

  const AUTH_URL = 'https://c4e770d5.eu.ngrok.io';
  const url = `${AUTH_URL}/login?t=${token}&c=${makeKeyFromPrefix(
    'context'
  )}&l=${linkingUrl}`;

  console.log('Login token:' + token);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleRedirect = (event: { url: string }) => {
    if (Platform.OS == 'ios') {
      WebBrowser.dismissBrowser();
    } else {
      Linking.removeEventListener('url', handleRedirect);
    }

    // if (Platform.OS == 'web') {
    //   WebBrowser.maybeCompleteAuthSession()
    // }

    console.log('/handleRedirect');
    console.log(event);

    const { queryParams } = Linking.parse(event.url);
    console.log('queryParams:');
    console.log(queryParams);
    tokenAction({
      type: 'LOGIN',
      payload: queryParams,
    });
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ChatWindow',
      })
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const openPopupWindow = async () => {
        // We add `?` at the end of the URL since the test backend that is used
        // just appends `authToken=<token>` to the URL provided.

        Linking.addEventListener('url', handleRedirect);
        console.log('tokenAction:' + typeof tokenAction);
        tokenAction({
          type: 'TEST',
        });
        let result = await WebBrowser.openBrowserAsync(url);

        //let redirectData;
        //if (result) {
        console.log('got result');
        console.log(result);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'ChatWindow',
          })
        );
        // redirectData = Linking.parse(result.url);
        // }
        let redirectData;
        if (result.url) {
          redirectData = Linking.parse(result.url);
          console.log('redirectData:');
          console.log(redirectData);
          // tokenAction({
          //   type: 'LOGIN',
          //   payload: redirectData.queryParams,
          // });
        }
      };

      if (socket) {
        console.log('registering socket');
        socket.on('LOGIN', function() {
          console.log('LOGGING IN dismissing');
          if (Platform.OS === 'ios') {
            WebBrowser.dismissBrowser();
          }
          navigation.dispatch(
            CommonActions.navigate({
              name: 'ChatWindow',
            })
          );
        });
        if (tokenState.token && !tokenState.loggingIn) {
          openPopupWindow();
        } else {
          console.log('tokenState:');
          console.log(tokenState);
        }
      }
      // return function cleanup() {
      //   Linking.removeEventListener('url', handleRedirect);
      // };
    }, [handleRedirect, navigation, tokenAction, tokenState, url])
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
};
