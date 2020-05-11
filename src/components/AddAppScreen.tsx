import React from 'react';
import {
  useFocusEffect,
  CommonActions,
  NavigationProp,
} from '@react-navigation/native';

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

  const { messageAction } = React.useContext(MessageContext);

  const { apps, insertApp, setCurrentApp } = React.useContext(AppsContext);

  const saveApp = (appName: string) => {
    setError(null);
    console.log("calling registerAppByName:");
    console.log(appName);
    registerAppByName(appName)
      .then(result => {
        if (isEmptyObj(result?.data)) {
          throw 'Invalid app name';
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
        console.log(e);
        setError(e);
      });
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
    }, [])
  );

  return (
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
  );
};
