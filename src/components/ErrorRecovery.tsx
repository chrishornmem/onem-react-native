import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paragraph, Subheading, Button, useTheme } from 'react-native-paper';
import { AppsContext, App } from '../context/appsContext';
import { emitToServer } from '../react-client-shared/utils/Socket';
import { MessageContext } from '../react-client-shared/reducers/messageState';

export const ErrorRecovery: React.FC<{ app: App }> = ({ app }) => {
  console.log('error recovery');

  const theme = useTheme();
  const { getCurrentApp, removeApp } = React.useContext(AppsContext);
  const { messageAction } = React.useContext(MessageContext);

  const switchService = (appId: string) => {
    emitToServer({
      action_type: 'serviceSwitch',
      app_id: appId,
    });
    messageAction({
      type: 'REQUESTING',
      payload: null,
    });
  };

  return (
    <View style={styles.container}>
      <Paragraph>We detected a problem with the following app:</Paragraph>
      <Subheading style={[styles.appName, { color: theme.colors.error }]}>
        {app?.name?.toUpperCase() || 'Unknown'}
      </Subheading>
      <Paragraph>
        You will need to remove the app from the configuration.
      </Paragraph>
      <Button
        onPress={() => {
          let currentChanged = removeApp(app._id);
          if (currentChanged) {
            switchService(getCurrentApp()._id)
          }
        }}
        style={styles.resetButton}
        mode="contained"
      >
        Remove app
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    paddingVertical: 20,
  },
  resetButton: {
    width: '100%',
    marginVertical: 20,
  },
});
