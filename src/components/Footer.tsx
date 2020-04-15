import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { FloatingAction } from 'react-native-floating-action';

import { Appbar, Avatar, FAB, Portal, useTheme } from 'react-native-paper';

export const Footer = (props: Props) => {
  const theme = useTheme();
  const [isOpen, setOpen] = React.useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const iconClosed = 'dots-vertical';
  const iconOpen = 'dots-horizontal';

  return (
    <Appbar
      style={styles.bottom}
      theme={{ colors: { primary: theme.colors.surface } }}
    >
      <TouchableOpacity
        style={{ marginLeft: 10 }}
        onPress={() => {
          ((navigation as any) as DrawerNavigationProp<{}>).openDrawer();
        }}
      >
        <Avatar.Image
          size={40}
          source={{
            uri:
              'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
          }}
        />
      </TouchableOpacity>
      <View style={{ paddingTop: 80 }}>
        <FloatingAction
          //   open={isOpen}
          buttonSize={40}
          distanceToEdge={20}
          actions={[
            {
              text: 'Accessibility',
              icon: require('../../assets/onem-logo.png'),
              name: 'bt_accessibility',
              //    position: 2
            },
            {
              text: 'Language',
              icon: require('../../assets/onem-logo.png'),
              name: 'bt_language',
              //    position: 1
            },
            {
              text: 'Location',
              icon: require('../../assets/onem-logo.png'),
              name: 'bt_room',
              //     position: 3
            },
            {
              text: 'Video',
              icon: require('../../assets/onem-logo.png'),
              name: 'bt_videocam',
              //     position: 4
            },
          ]}
          //    accessibilityLabel="verbs"
          //    onStateChange={({ open }) => setOpen(open)}
          visible={isFocused}
          //icon={isOpen ? iconOpen : iconClosed}
          //color={theme.colors.text}
          // theme={{
          //   colors: {
          //     background: theme.colors.surface,
          //   },
          // }}
          //style={{ paddingBottom: 12 }}
          //fabStyle={styles.fab}
          //onPress={() => {}}
        />
      </View>
    </Appbar>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    //paddingHorizontal: 0,
    // alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    //flexDirection: 'row'
  },
  fab: {
    //  display: 'flex',
    //    alignSelf: 'flex-end',
    // color: 'black',
    // height: 40,
    // width: 40,
    // borderRadius: 20,
    elevation: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    //  margin: 0,
    //marginHorizontal: 0,
    //  marginVertical: 8,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
