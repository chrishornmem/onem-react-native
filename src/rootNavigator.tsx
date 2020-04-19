import { logger } from './react-client-shared/utils/Log';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import { StackNavigator } from './stack';
import { DrawerContent } from './components/drawerContent';
import { LoginScreen } from './components/LoginScreen';

import usePersistedReducer from './react-client-shared/hooks/usePersistedReducer';

let initialized = false;

import {
  createSocket,
  disconnect,
  reconnect,
} from './react-client-shared/utils/Socket';
import {
  authenticate,
  isRefreshRequired,
} from './react-client-shared/api/authenticate';
import {
  MessageContext,
  messageReducer,
  initialMessageState,
} from './react-client-shared/reducers/messageState';
import {
  AuthContext,
  tokenReducer,
  initialTokenState,
} from './react-client-shared/reducers/tokenState';

import { User } from './react-client-shared/reducers/userState';

import { socketReducer } from './react-client-shared/reducers/socket';
import { Message } from './react-client-shared/utils/Message';
import { STORAGE } from './react-client-shared/utils/Storage';
import { getUserProfile } from './react-client-shared/api/userProfile';

const Drawer = createDrawerNavigator();

export const RootNavigator = () => {
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  const [connectState, connectAction] = React.useReducer(socketReducer, {
    connectStatus: 'start',
  });
  const [tokenState, tokenAction] = usePersistedReducer(
    'token',
    tokenReducer,
    initialTokenState,
    STORAGE.ASYNC
  );
  const [messageState, messageAction] = usePersistedReducer(
    'chatWindow',
    messageReducer,
    initialMessageState
  );

  const [userState, setUserState] = React.useState({} as User)

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

          // connectAction({
          //   type: 'CONNECTING',
          //   payload: null,
          // });
          // messageAction({
          //   type: 'RECONNECT',
          // });
          // if (tokenState.token) {
          //   reconnect(tokenState.token);
          // }
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
  }, [messageState, connectState, tokenState]);

  const authContext = React.useMemo(() => {
    if (tokenState.token) {
      setUserState(getUserProfile(tokenState.token))
    }
    return { tokenState, tokenAction, userState };
  }, [tokenState, tokenAction]);

  const messageContext = React.useMemo(() => {
    return { messageState, messageAction };
  }, [messageState, messageAction]);

  return (
    <AuthContext.Provider value={authContext}>
      <MessageContext.Provider value={messageContext}>
        <NavigationContainer theme={navigationTheme}>
          <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="Home" component={StackNavigator} />
            <Drawer.Screen name="Login" component={LoginScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </MessageContext.Provider>
    </AuthContext.Provider>
  );
};
