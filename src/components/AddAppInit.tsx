import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';

import { AppsContext } from '../context/appsContext';
import { registerAppByName } from '../react-client-shared/api/register';
import { isEmptyObj } from '../react-client-shared/utils';
import { AddApp } from './AddApp';

export const AddAppInit: React.FC<{}> = ({}) => {
  const [error, setError] = React.useState(null);
  const [appName, setAppName] = React.useState(null);
  const [requesting, setRequesting] = React.useState(false);

  const { insertApp } = React.useContext(AppsContext);
  const componentIsMounted = React.useRef(true);

  const saveApp = (appName: string) => {
    setError(null);
    setRequesting(true);
    registerAppByName(appName)
      .then(result => {
        if (isEmptyObj(result?.data)) {
          throw { message: 'App not found' };
        }
        const app = { ...result.data };
        insertApp(app, false);
      })
      .catch(e => {
        let message =
          e?.message || 'Error communicating with server, check network';
        return setError(message);
      })
      .finally(() => {
        if (componentIsMounted.current) setRequesting(false);
      });
  };

  React.useEffect(() => {
    return function cleanUp() {
      componentIsMounted.current = false;
    };
  }, []);

  return (
    <View style={styles.mainWrapper}>
      <AddApp
        value={appName}
        title="Add your first app"
        onChangeText={name => {
          setAppName(name);
          setError(null);
        }}
        disabled={!appName}
        errorText={error}
        onSubmit={() => saveApp(appName?.trim())}
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
