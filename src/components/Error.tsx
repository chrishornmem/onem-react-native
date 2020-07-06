import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Snackbar, useTheme } from 'react-native-paper';
import { getError, MtText } from '../react-client-shared/utils/Message';
import { AppsContext } from '../context/appsContext';
import { MessageContext } from '../react-client-shared/reducers/messageState';
import { emitToServer } from '../react-client-shared/utils/Socket';
import { ErrorRecovery } from './ErrorRecovery';

export const Error: React.FC<{ message: any | string }> = ({ message }) => {
  const [open, setOpen] = React.useState(true);
  const { getCurrentApp, removeApp } = React.useContext(AppsContext);
  const { messageAction } = React.useContext(MessageContext);

  const curApp = getCurrentApp();

  const theme = useTheme();

  const { application_error, error_text, severity } = getError(message);

  const [switchingService, setSwitchingService] = React.useState(false);

  const mtText: any =
    typeof message === 'object'
      ? (message.mtText as MtText)
      : {
          __is_root: false,
          snackbar: {
            message: error_text,
            severity: severity,
            meta: {
              auto_hide_duration: null,
              overlay: false,
            },
          },
        };
  const auto_hide_duration =
    mtText?.snackbar?.meta?.auto_hide_duration === null
      ? 7000
      : mtText?.snackbar?.meta?.auto_hide_duration;

  const handleSnackbarDismiss = () => {
    setOpen(false);
    if (!application_error && severity === 'info') {
      messageAction({
        type: 'REQUESTING',
      });
      emitToServer({
        action_type: 'refreshContext',
        app_id: getCurrentApp()._id,
      });
    } else if (!application_error && severity !== 'info ') {
      messageAction({
        type: 'REQUESTING',
      });
      emitToServer({
        action_type: 'serviceSwitch',
        app_id: getCurrentApp()._id,
      });
    }
  };

  const handleSnackbarAction = () => {
    if (mtText?.snackbar?.name) {
      messageAction({
        type: 'REQUESTING',
      });
      emitToServer({
        action_type: 'snackbarAction',
        name: mtText?.snackbar?.name,
      });
    }
  };

  const handleErrorOnPress = () => {
    const currentChanged = removeApp(curApp._id);
    if (currentChanged) {
      setSwitchingService(true);
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

  const errorStyles = {
    success: {
      backgroundColor: 'green',
    },
    error: {
      backgroundColor: theme.colors.error,
    },
    info: {
      backgroundColor: theme.colors.primary,
    },
    warn: {
      backgroundColor: theme.colors.accent,
    },
  };

  return (
    <>
      {!application_error && !switchingService ? (
        <ErrorRecovery
          message={message}
          messageAction={messageAction}
          app={curApp}
          onPress={handleErrorOnPress}
        />
      ) : (
        <>
          {!switchingService && (
            <Portal>
              <Snackbar
                style={[{ bottom: 45 }, errorStyles[severity]]}
                onDismiss={handleSnackbarDismiss}
                duration={auto_hide_duration}
                visible={open}
                action={{
                  label: application_error ? mtText?.snackbar?.name : null,
                  onPress: () => {
                    handleSnackbarAction();
                  },
                }}
              >
                {error_text}
              </Snackbar>
            </Portal>
          )}
        </>
      )}
    </>
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
