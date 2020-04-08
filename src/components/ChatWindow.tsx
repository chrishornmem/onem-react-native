import { logger } from '../react-client-shared/utils/Log';

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { StackNavigationProp } from '@react-navigation/stack';
import { StackNavigatorParamlist } from '../types';
import { Card, Text, useTheme } from 'react-native-paper';

import usePersistedReducer from '../react-client-shared/hooks/usePersistedReducer';

import { Header } from './Header';
import { Footer } from './Footer';
import { Error } from './Error';
import { MessageScreen } from './MessageScreen';

import {
  createSocket,
  disconnect,
  reconnect,
} from '../react-client-shared/utils/Socket';
import {
  authenticate,
  isRefreshRequired,
} from '../react-client-shared/api/authenticate';
import {
  messageReducer,
  initialMessageState,
} from '../react-client-shared/reducers/messageState';
import {
  tokenReducer,
  initialTokenState,
} from '../react-client-shared/reducers/tokenState';
import {
  screenReducer,
  initialScreenState,
} from '../react-client-shared/reducers/screenState';
import {
  userReducer,
  initialUserState,
} from '../react-client-shared/reducers/userState';
import { socketReducer } from '../react-client-shared/reducers/socket';

type Props = {
  navigation?: StackNavigationProp<StackNavigatorParamlist>;
};

let initialized = false;

export const ChatWindow = (props: Props) => {
  //const safeArea = useSafeArea();
  const theme = useTheme();

  const [connectState, connectAction] = React.useReducer(socketReducer, {
    connectStatus: 'start',
  });
  const [tokenState, tokenAction] = usePersistedReducer(
    'token',
    tokenReducer,
    initialTokenState,
    true
  );
  const [messageState, messageAction] = usePersistedReducer(
    'chatWindow',
    messageReducer,
    initialMessageState
  );
  const [screenState, screenAction] = usePersistedReducer(
    'screen',
    screenReducer,
    initialScreenState
  );
  const [userState, userAction] = usePersistedReducer(
    'userProfile',
    userReducer,
    initialUserState
  );

  React.useEffect(() => {
    const getToken = async () => {
      logger.info('/getToken: ');
      tokenAction({
        type: 'REFRESH_TOKEN',
      });
      try {
        const data = await authenticate(null);
        tokenAction({
          type: 'STORE_TOKEN',
          payload: data,
        });
        disconnect();
        logger.info('got token:');
        logger.info(data.token);
        const s: any = createSocket(data.token);
        registerEvents(s);
        connectAction({
          type: 'CONNECTING',
          payload: null,
        });
      } catch (error) {
        logger.error(error);
      }

      connectAction({
        type: 'CONNECTING',
        payload: null,
      });
    };

    const refreshToken = async (t: string) => {
      logger.info('/refreshToken:' + t);

      tokenAction({
        type: 'REFRESH_TOKEN',
      });
      try {
        const data = await authenticate(t);
        tokenAction({
          type: 'STORE_TOKEN',
          payload: data,
        });
        disconnect();
        const s: any = createSocket(data.token);
        registerEvents(s);
        connectAction({
          type: 'CONNECTING',
          payload: null,
        });
      } catch (error) {
        logger.error(error);
      }
    };

    if (!initialized) {
      initialized = true;
      tokenAction({
        type: 'CLEAR_REFRESH',
      });
    }

    function registerEvents(s: any) {
      s.on('connect', function() {
        logger.info('connected:');
        connectAction({
          type: 'CONNECTED',
          payload: null,
        });
        if (tokenState.loggingIn) {
          messageAction({
            type: 'SERVICE_SWITCH',
          });
        } else {
          messageAction({
            type: 'REFRESH',
          });
        }
        tokenAction({
          type: 'LOGGED_IN',
        });
      })
        .on('connect_error', function(reason: any) {
          logger.error('connect_error:');
          logger.error(reason);
          // connectAction({
          //     type: "CONNECTING",
          //     payload: null
          // });
        })
        .on('reconnect', function(reason: any) {
          logger.error('reconnect:');
          logger.error(reason);

          connectAction({
            type: 'CONNECTING',
            payload: null,
          });
          messageAction({
            type: 'RECONNECT',
          });
          if (tokenState.token) {
            reconnect(tokenState.token);
          }
        })
        .on('disconnect', function(reason: string) {
          logger.error('disconnected:');
          logger.error(reason);
          // the disconnection was initiated by the server, you need to reconnect manually

          if (
            reason === 'transport close' ||
            reason === 'io server disconnect'
          ) {
            logger.error('disconected by server');
            if (tokenState.token) {
              // assume there's an issue with the token since there's no way to get feedback
              tokenAction({
                type: 'RESET_TOKEN',
                payload: tokenState.token,
              });
              messageAction({
                type: 'FORCED_LOGOUT',
              });
              // const s: any = createSocket(tokenState.token);
              // registerEvents(s);
            }
            connectAction({
              type: 'CONNECTING',
              payload: null,
            });
          }
        })
        .on('MESSAGE RECEIVED', function(data: Message) {
          logger.info('MESSAGE RECEIVED:');
          logger.info(data);
          messageAction({
            type: 'RECEIVED',
            payload: data,
          });
        })
        .on('REFRESH TOKEN', function(data: any) {
          logger.info('REFRESH TOKEN:');
          logger.info(data);
          //  popUpWindow.close();
          // refreshToken(tokenState.token);
          tokenAction({
            type: 'STORE_TOKEN',
            payload: data,
          });
          disconnect();
          const s: any = createSocket(data.token);
          registerEvents(s);
          connectAction({
            type: 'CONNECTING',
            payload: null,
          });
        })
        .on('LOGIN', function(data: any) {
          logger.info('LOGIN:');
          logger.info(data);
          // refreshToken(tokenState.token);
          tokenAction({
            type: 'LOGIN',
            payload: data,
          });
        })
        .on('LOGOUT', function(data: any) {
          logger.info('LOGOUT:');
          logger.info(data);
          // refreshToken(tokenState.token);
          tokenAction({
            type: 'LOGOUT',
            payload: data,
          });
        });
    }

    try {
      if (
        !tokenState.refreshingToken &&
        tokenState.token &&
        isRefreshRequired(tokenState.token)
      ) {
        logger.info('calling refresh token');
        refreshToken(tokenState.token);
      } else if (connectState.connectStatus === 'start' && tokenState.token) {
        logger.info('status is connecting:' + tokenState.token);
        let s = createSocket(tokenState.token);
        registerEvents(s);
        connectAction({
          type: 'CONNECTING',
          payload: null,
        });
      } else if (tokenState.loggingIn && tokenState.token) {
        //  popUpWindow.close();
        disconnect();
        const s: any = createSocket(tokenState.token);
        registerEvents(s);
        connectAction({
          type: 'CONNECTING',
          payload: null,
        });
        tokenAction({
          type: 'REFRESH_TOKEN',
          payload: tokenState.token,
        });
        messageAction({
          type: 'REQUESTING',
        });
      } else if (!tokenState.token && !tokenState.refreshingToken) {
        getToken();
      } else if (tokenState.loggingOut) {
        getToken();
      }
    } catch (e) {
      logger.error("*** shouldn't come here ***");
      logger.error(e);
      //getToken(null);
    }
    //eslint-disable-next-line
}, [messageState, connectState, tokenState, screenState]);

  return (
    <>
      {console.log('messageState')}
      {console.log(messageState)}
      <Header />
      <Card style={styles.cardWrapper}>
        {messageState.requesting && (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {messageState.hasError ? (
          <Error message={messageState.message} />
        ) : (
          <>
            {!messageState.requesting &&
            messageState.message &&
            messageState.message.mtText ? (
              <MessageScreen
                message={messageState.message}
                messageAction={messageAction}
                user={userState.user}
                userAction={userAction}
                token={tokenState.token}
                tokenAction={tokenAction}
              />
            ) : null}
          </>
        )}
      </Card>
      <Footer />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  cardWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
