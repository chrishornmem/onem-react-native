import { logger } from '../react-client-shared/utils/Log';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import { StackNavigator } from '../stack';
import { DrawerContent } from './drawerContent';
import { LoginScreen } from './LoginScreen';
import { AddAppScreen } from './AddAppScreen';

import usePersistedReducer from '../react-client-shared/hooks/usePersistedReducer';
import usePersistedAsyncReducer from '../react-client-shared/hooks/usePersistedAsyncReducer';
import { makeKeyFromPrefix } from '../react-client-shared/utils';

let initialized = false;

import { createSocket, disconnect } from '../react-client-shared/utils/Socket';
import {
  authenticate,
  isRefreshRequired,
} from '../react-client-shared/api/authenticate';
import {
  MessageContext,
  messageReducer,
  initialMessageState,
} from '../react-client-shared/reducers/messageState';
import {
  AuthContext,
  tokenReducer,
  initialTokenState,
} from '../react-client-shared/reducers/tokenState';

import { AppsContext } from '../context/appsContext';

import { User } from '../react-client-shared/reducers/userState';

import { socketReducer } from '../react-client-shared/reducers/socket';
import { Message } from '../react-client-shared/utils/Message';
import { Storage, STORAGE } from '../react-client-shared/utils/Storage';
import { getUserProfile } from '../react-client-shared/api/userProfile';
import { emitToServer } from '../react-client-shared/utils/Socket';

const Drawer = createDrawerNavigator();

export const RootNavigator = () => {
  const theme = useTheme();
  const storage = new Storage(STORAGE.ASYNC);
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;
  const [connectState, connectAction] = React.useReducer(socketReducer, {
    connectStatus: 'start',
  });
  const [tokenState, tokenAction] = usePersistedAsyncReducer(
    'token',
    tokenReducer,
    initialTokenState
    // STORAGE.ASYNC
  );
  const [messageState, messageAction] = React.useReducer(
  //  'chatWindow',
    messageReducer,
    initialMessageState
  );
  const [userState, setUserState] = React.useState({} as User);
  //const [userState, setUserState] = usePersistedAsyncState('user', {} as User)
  const { getCurrentApp } = React.useContext(AppsContext);

  function registerEvents(s: any) {
    s.on('connect', function() {
      logger.info('connected:');
      connectAction({
        type: 'CONNECTED',
        payload: null,
      });
      if (tokenState.loggingIn) {
        emitToServer({
          action_type: 'serviceSwitch',
          app_id: getCurrentApp()._id,
        });
        messageAction({
          type: 'SERVICE_SWITCH',
          payload: null,
        });
      } else {
        emitToServer({
          action_type: 'refreshContext',
          app_id: getCurrentApp()._id,
        });
        messageAction({
          type: 'REFRESH',
          payload: null,
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
      })
      .on('disconnect', function(reason: string) {
        logger.error('disconnected:');
        logger.error(reason);
        // the disconnection was initiated by the server, you need to reconnect manually

        if (reason === 'transport close' || reason === 'io server disconnect') {
          logger.error('disconected by server');
          if (tokenState.token) {
            // assume there's an issue with the token since there's no way to get feedback
            tokenAction({
              type: 'RESET_TOKEN',
              payload: tokenState.token,
            });
            messageAction({
              type: 'FORCED_LOGOUT',
              payload: null,
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
        recreateSocket(data.token);
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

  function recreateSocket(token: string) {
    disconnect();
    logger.info('recreating socket token:');
    logger.info(token);
    const s: any = createSocket(token);
    registerEvents(s);
    connectAction({
      type: 'CONNECTING',
      payload: null,
    });
  }

  React.useEffect(() => {
    const getToken = async () => {
      logger.info('/getToken: ');
      tokenAction({
        type: 'REFRESH_TOKEN',
      });
      if (!tokenState.token) {
        const tokenStateRaw = await storage.get('token');
        if (tokenStateRaw) {
          const parsedToken = JSON.parse(tokenStateRaw);
          if (parsedToken.token) {
            tokenAction({
              type: 'STORE_TOKEN',
              payload: { token: parsedToken.token },
            });
            recreateSocket(parsedToken.token);
            return;
          }
        }
      }
      try {
        const data = await authenticate(null);
        tokenAction({
          type: 'STORE_TOKEN',
          payload: data,
        });
        recreateSocket(data.token);
      } catch (error) {
        logger.error(error);
      }
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
        recreateSocket(data.token);
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
        recreateSocket(tokenState.token);
      } else if (tokenState.loggingIn && tokenState.token) {
        //  popUpWindow.close();
        recreateSocket(tokenState.token);
        tokenAction({
          type: 'REFRESH_TOKEN',
          payload: tokenState.token,
        });
        messageAction({
          type: 'REQUESTING',
          payload: null,
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
      setUserState(getUserProfile(tokenState.token));
    }
    return { tokenState, tokenAction, userState };
  }, [tokenState]);

  const messageContext = React.useMemo(() => {
    return { messageState, messageAction };
  }, [messageState]);

  return (
    <AuthContext.Provider value={authContext}>
      <MessageContext.Provider value={messageContext}>
        <NavigationContainer theme={navigationTheme}>
          <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="Home" component={StackNavigator} />
            <Drawer.Screen name="Login" component={LoginScreen} />
            <Drawer.Screen name="AddApp" component={AddAppScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </MessageContext.Provider>
    </AuthContext.Provider>
  );
};
