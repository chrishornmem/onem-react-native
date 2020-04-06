import React from 'react';
import { Appbar, Avatar, useTheme, Portal, FAB } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { useSafeArea } from 'react-native-safe-area-context';
import {
  useIsFocused,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import { StackNavigatorParamlist } from './types';

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'FeedList'>;
};

export const ChatWindow = (props: Props) => {
  const theme = useTheme();
  const safeArea = useSafeArea();
  const isFocused = useIsFocused();
  const [isOpen, setOpen] = React.useState(false);
  const navigation = useNavigation();

  let iconClosed = 'dots-vertical';
  let iconOpen = 'dots-horizontal';

  return (
    <React.Fragment>
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
            color="black"
            //   theme={{
            //     colors: {
            //       background: 'white',
            //     },
            //   }}
            style={{paddingBottom:12}}
            fabStyle={styles.fab}
            onPress={() => {}}
          />
      </Appbar>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fab: {
    color: 'black',
    position: 'relative',
    bottom: -4,
 //   right: 10,
    backgroundColor: 'transparent',
    elevation: 0,
  },
});
