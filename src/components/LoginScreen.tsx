import * as React from 'react';
import { Platform } from 'react-native';
import {
  CommonActions,
  useFocusEffect,
  NavigationProp,
} from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { makeKeyFromPrefix } from '../react-client-shared/utils';
import { AuthContext } from '../react-client-shared/reducers/tokenState';
import { AUTH_URL } from '../react-client-shared/config';

export const LoginScreen: React.FC<{ navigation: NavigationProp }> = ({
  navigation,
}) => {
  const { tokenState, tokenAction } = React.useContext(AuthContext);
  const token = tokenState.token;
  const linkingUrl = Linking.makeUrl() + '?';
  const url = `${AUTH_URL}/login?t=${token}&c=${makeKeyFromPrefix(
    'context'
  )}&l=${linkingUrl}`;

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

    const { queryParams } = Linking.parse(event.url);

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
        Linking.addEventListener('url', handleRedirect);
        await WebBrowser.openBrowserAsync(url);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'ChatWindow',
          })
        );
      };

      if (tokenState.token && !tokenState.loggingIn) {
        openPopupWindow();
      }
    }, [])
  );

  return <></>;
};
