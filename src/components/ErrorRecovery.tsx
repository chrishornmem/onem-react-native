import React from 'react';

import {
  useFocusEffect,
} from '@react-navigation/native';

import { BackHandler, StyleSheet, View } from 'react-native';
import { Paragraph, Subheading, Button, useTheme } from 'react-native-paper';
import { AppsContext, App } from '../context/appsContext';
import { emitToServer } from '../react-client-shared/utils/Socket';
import { MessageContext } from '../react-client-shared/reducers/messageState';

export const ErrorRecovery: React.FC<{
  app: App;
  message: any | string;
  messageAction: any;
  onPress: any;
}> = ({ app, message, messageAction, onPress }) => {
  const theme = useTheme();
  const { getCurrentApp, removeApp } = React.useContext(AppsContext);
  //console.log('messageContext:');
  //console.log(MessageContext);
  //const { messageAction } = React.useContext(MessageContext);
  //console.log('messageAction:' + typeof messageAction);
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

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log("back pressed");
        return true;
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* <Paragraph>{JSON.stringify(message?.severity)}</Paragraph> */}
      <Paragraph>We detected a problem with the following app:</Paragraph>
      <Subheading style={[styles.appName, { color: theme.colors.error }]}>
        {app?.name?.toUpperCase() || 'Unknown'}
      </Subheading>
      <Paragraph>
        You will need to remove the app from the configuration.
      </Paragraph>
      <Button
        onPress={() => onPress()}
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
