import { logger } from '../react-client-shared/utils/Log';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { Error } from './Error';
import { MessageScreen } from './MessageScreen';

//import { MessageState } from '../react-client-shared/reducers/messageState';
import { AuthContext } from '../react-client-shared/reducers/tokenState';
import { MessageContext } from '../react-client-shared/reducers/messageState';
import { ConnectionContext } from '../react-client-shared/reducers/socket';

export const ChatWindow: React.FC<{}> = ({}) => {
  const { tokenState, tokenAction } = React.useContext(AuthContext);

  const token = tokenState?.token;
  const { messageState, messageAction, isRequesting } = React.useContext(
    MessageContext
  );

  const { connectState } = React.useContext(ConnectionContext);

  return (
    <>
      <View style={styles.mainWrapper}>
        {connectState?.connectStatus !== 'connected' &&
          connectState?.connectStatus !== 'start' && (
            <View style={styles.snackbar}>
              <Snackbar onDismiss={() => {}} visible>
                Internet connection is offline
              </Snackbar>
            </View>
          )}
        {messageState.hasError ? (
          <Error message={messageState.message} />
        ) : (
          <>
            {!tokenState.loggingIn &&
              !tokenState.loggingOut &&
              messageState.message && (
                <View style={styles.container}>
                  <MessageScreen token={token} tokenAction={tokenAction} />
                </View>
              )}
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    // justifyContent: 'center',
  },
  horizontal: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  mainWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  snackbar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 50,
  },
});
