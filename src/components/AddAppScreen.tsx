import React from 'react';
import {
  useFocusEffect,
  CommonActions,
  NavigationProp,
} from '@react-navigation/native';

import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { AppsContext } from '../context/appsContext';
import { registerAppByName } from '../react-client-shared/api/register';
import { isEmptyObj } from '../react-client-shared/utils';
import { MessageContext } from '../react-client-shared/reducers/messageState';
import { emitToServer } from '../react-client-shared/utils/Socket';
import { AddApp } from './AddApp';

export const AddAppScreen: React.FC<{ navigation: NavigationProp }> = ({
  navigation,
}) => {
  const [error, setError] = React.useState(null);
  const [appName, setAppName] = React.useState(null);
  const [requesting, setRequesting] = React.useState(false);

  const { messageAction } = React.useContext(MessageContext);

  const { apps, insertApp, setCurrentApp } = React.useContext(AppsContext);

  const saveApp = (appName: string) => {
    setRequesting(true);
    setError(null);
    registerAppByName(appName)
      .then(result => {
        if (isEmptyObj(result?.data)) {
          throw { message: 'App not found' };
        }
        const app = { ...result.data };
        const prevAppsLength = apps.length;
        insertApp(app);
        // eslint-disable-next-line promise/always-return
        if (app._id && prevAppsLength > 0) {
          switchService(app._id);
        }
      })
      .catch(e => {
        let message =
          e?.message || 'Error communicating with server, check network';
        setError(message);
      })
      .finally(() => setRequesting(false));
  };

  const switchService = (appId: string) => {
    setCurrentApp(appId);
    emitToServer({
      action_type: 'serviceSwitch',
      app_id: appId,
    });
    messageAction({
      type: 'REQUESTING',
      payload: null,
    });
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ChatWindow',
      })
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      setError(null);
      setAppName(null);
      const onBackPress = () => {
        return true;
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <View style={styles.mainWrapper}>
      <AddApp
        value={appName}
        onSubmit={() => saveApp(appName?.trim())}
        onChangeText={name => {
          setAppName(name);
          setError(null);
        }}
        errorText={error}
        title="Add an app"
        cancelButton
        disabled={!appName}
        cancelAction={() => navigation.goBack()}
      />
      {requesting && (
        <Portal>
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        </Portal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
