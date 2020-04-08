import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useIsFocused, useNavigation } from '@react-navigation/native';

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
      <Portal>
        <FAB.Group
          open={isOpen}
          actions={[
            {
              icon: 'star',
              label: 'Add',
              onPress: () => console.log('Pressed add'),
            },
            {
              icon: 'star',
              label: 'Star',
              onPress: () => console.log('Pressed star'),
            },
            {
              icon: 'email',
              label: 'Email',
              onPress: () => console.log('Pressed email'),
            },
            {
              icon: 'bell',
              label: 'Remind',
              onPress: () => console.log('Pressed notifications'),
            },
          ]}
          accessibilityLabel="verbs"
          onStateChange={({ open }) => setOpen(open)}
          visible={isFocused}
          icon={isOpen ? iconOpen : iconClosed}
          color={theme.colors.text}
          //   theme={{
          //     colors: {
          //       background: 'white',
          //     },
          //   }}
          //style={{ paddingBottom: 12 }}
          fabStyle={styles.fab}
          onPress={() => { }}
        />
      </Portal>
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
    //flexDirection: 'row'
  },
  fab: {
    //  display: 'flex',
    //    alignSelf: 'flex-end',
    // color: 'black',
    height: 40,
    width: 40,
    borderRadius: 20,
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
