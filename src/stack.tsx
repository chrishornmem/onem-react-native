import React from 'react';
// import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
// import { DrawerNavigationProp } from '@react-navigation/drawer';
// import { Appbar, Avatar, Button, Text, useTheme } from 'react-native-paper';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ChatWindow } from './components/ChatWindow';

// import { BottomTabs } from './bottomTabs';
// import { Details } from './details';
import { StackNavigatorParamlist } from './types';

const Stack = createStackNavigator<StackNavigatorParamlist>();

export const StackNavigator = () => {
  //const theme = useTheme();

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
        // options={({ route }) => {
        //   const routeName = route.state
        //     ? route.state.routes[route.state.index].name
        //     : 'ChatWindow';
        //   return { headerTitle: routeName };
        // }}
      />
      {/* <Stack.Screen
        name="Details"
        component={Details}
        options={{ headerTitle: 'Tweet' }}
      /> */}
    </Stack.Navigator>
  );
};
