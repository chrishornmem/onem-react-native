import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatWindow } from './components/ChatWindow';

import { LoginScreen } from './components/LoginScreen';
import { StackNavigatorParamlist } from './stackTypes';

const Stack = createStackNavigator<StackNavigatorParamlist>();

export const StackNavigator = () => {

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
