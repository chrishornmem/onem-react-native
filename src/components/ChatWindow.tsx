import { logger } from '../react-client-shared/utils/Log';

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Error } from './Error';
import { MessageScreen } from './MessageScreen';
//import { MessageState } from '../react-client-shared/reducers/messageState';
import { AuthContext } from '../react-client-shared/reducers/tokenState';
import { MessageContext } from '../react-client-shared/reducers/messageState';

export const ChatWindow: React.FC<{}> = ({}) => {
  const { tokenState, tokenAction } = React.useContext(AuthContext);

  const token = tokenState?.token;
  const { messageState, messageAction, isRequesting } = React.useContext(
    MessageContext
  );
  
  return (
    <>
      <View style={styles.mainWrapper}>
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
});
