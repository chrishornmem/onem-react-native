import { logger } from './react-client-shared/utils/Log';

import React from 'react';
// import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
// import { DrawerNavigationProp } from '@react-navigation/drawer';
// import { Appbar, Avatar, Button, Text, useTheme } from 'react-native-paper';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ChatWindow } from './components/ChatWindow';

// import { BottomTabs } from './bottomTabs';
import { LoginScreen } from './components/LoginScreen';
import { StackNavigatorParamlist } from './types';

const Stack = createStackNavigator<StackNavigatorParamlist>();

export const StackNavigator = () => {
  //const theme = useTheme();

  // const authContext = React.useMemo(
  //   () => ({
  //     getToken: () => {
  //       // In a production app, we need to send some data (usually username, password) to server and get a token
  //       // We will also need to handle errors if sign in failed
  //       // After getting token, we need to persist the token using `AsyncStorage`
  //       // In the example, we'll use a dummy token

  //       return tokenState?.token;
  //     },
  //     runTokenAction: (params: any) => {
  //       return tokenAction(params)
  //     }
  //   }),
  //   [tokenAction, tokenState]
  // );

  return (
    <Stack.Navigator
      initialRouteName="ChatWindow"
      headerMode="none"
      // screenOptions={{
      //   header: ({ scene, previous, navigation }) => {
      //     const { options } = scene.descriptor;
      //     const title =
      //       options.headerTitle !== undefined
      //         ? options.headerTitle
      //         : options.title !== undefined
      //         ? options.title
      //         : scene.route.name;

      //     return (
      //       <>
      //       </>
      //     );
      //   },
      // }}
    >
      <Stack.Screen
        name="ChatWindow"
        component={ChatWindow}
        options={({ route }) => {
          const routeName = 'ChatWindow';
          return { headerTitle: routeName };
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ route }) => {
          const routeName = 'Login';
          return { headerTitle: routeName };
        }}
      />
    </Stack.Navigator>
  );
};
