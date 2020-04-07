import React from 'react';
import {
  Appbar,
  Avatar,
  FAB,
  Button,
  Text,
  useTheme,
} from 'react-native-paper';
import { StyleSheet, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { StackNavigationProp } from '@react-navigation/stack';
import { StackNavigatorParamlist } from './types';

import { useSafeArea } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';

type Props = {
  navigation?: StackNavigationProp<StackNavigatorParamlist>;
};

const ContentTitle = ({ title, style }) => (
  <Appbar.Content
    title={<Text style={style}> {title} </Text>}
    style={{ alignItems: 'center' }}
  />
);

const Feed = (props: Props) => {
  const theme = useTheme();

  return (
    <>
      <Appbar.Header
        style={{ marginLeft: 0, paddingLeft: 0 }}
        theme={{ colors: { primary: theme.colors.surface } }}
      >
        <Appbar.Action
          accessibilityLabel="Back"
          color="black"
          size={36}
          style={{ marginLeft: 0, paddingLeft: 0 }}
          icon="chevron-left"
          onPress={() => {}}
        />
        <ContentTitle title={'Title'} style={{ color: 'black' }} />
        <Button mode="text" onPress={() => this.submit()}>
          DONE1
        </Button>
      </Appbar.Header>
    </>
  );
};

export const ChatWindow = (props: Props) => {
  const theme = useTheme();
  const safeArea = useSafeArea();
  const isFocused = useIsFocused();
  const [isOpen, setOpen] = React.useState(false);
  const navigation = useNavigation();

  let iconClosed = 'dots-vertical';
  let iconOpen = 'dots-horizontal';

  React.useEffect(() => {
    {
      console.log(safeArea);
    }
  },[]);

  return (
    <SafeAreaView style={styles.container}>
      <Feed />
      <Appbar
        style={styles.bottom}
        theme={{ colors: { primary: theme.colors.surface } }}
      >
        <View style={styles.wrapper}>
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
            //style={{ paddingBottom: 12 }}
            fabStyle={styles.fab}
            onPress={() => {}}
          />
        </View>
      </Appbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    //paddingHorizontal: 0,
    // alignItems: 'center',
    // justifyContent: 'space-between',
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
    margin: 0,
    //marginHorizontal: 0,
    marginVertical: 8,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
