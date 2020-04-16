import { logger } from '../react-client-shared/utils/Log';

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Error } from './Error';
import { MessageScreen } from './MessageScreen';
//import { MessageState } from '../react-client-shared/reducers/messageState';
import { AuthContext } from '../react-client-shared/reducers/tokenState';
import { MessageContext } from '../react-client-shared/reducers/messageState';

export const ChatWindow: React.FC<{}> = ({}) => {
  const authContext  = React.useContext(AuthContext);
  const { messageState, messageAction } = React.useContext(MessageContext);

  const token = authContext?.tokenState?.token;
  const tokenAction = authContext?.tokenAction;

  console.log("token:"+token);

  return (
    <>
      <View style={styles.mainWrapper}>
        {messageState.requesting && (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {messageState.hasError ? (
          <Error message={messageState.message} />
        ) : (
          <View style={styles.container}>
            {!messageState.requesting &&
            messageState.message &&
            messageState.message.mtText ? (
              <MessageScreen
                message={messageState.message}
                messageAction={messageAction}
                token={token}
                tokenAction={tokenAction}
              />
            ) : null}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    //  justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  mainWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
