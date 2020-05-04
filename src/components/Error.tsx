import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { getError } from '../react-client-shared/utils/Message';
import { AppsContext } from '../context/appsContext';
import { MessageContext } from '../react-client-shared/reducers/messageState';
import { emitToServer } from '../react-client-shared/utils/Socket';

export const Error: React.FC<{ message: any | string }> = ({ message }) => {
  const [open, setOpen] = React.useState(true);
  const { getCurrentApp } = React.useContext(AppsContext);
  const { messageAction } = React.useContext(MessageContext);

  const handleClose = () => {
    setOpen(false);
    if (typeof message !== 'string' && message.severity === 'INFO') {
      emitToServer({
        action_type: 'refreshContext',
        app_id: getCurrentApp()._id,
      });
      messageAction({
        type: 'REFRESH',
        payload: null,
      });
    } else {
      emitToServer({
        action_type: 'serviceSwitch',
        app_id: getCurrentApp()._id,
      });
      messageAction({
        type: 'REQUESTING',
        payload: null,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Snackbar
          onDismiss={handleClose}
          visible={open}
          action={{
            label: message?.severity === 'INFO' ? 'retry' : 'ok',
            onPress: () => {
              handleClose;
            },
          }}
        >
          {getError(message).error_text}
        </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  wrapper: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 50,
  },
});
