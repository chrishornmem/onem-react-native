import React from 'react';
import { Appbar, Avatar, useTheme, Portal, FAB } from 'react-native-paper';
import { StyleSheet, FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { StackNavigationProp } from '@react-navigation/stack';

import { Twitt } from './components/twitt';
import { twitts } from './data';
import { StackNavigatorParamlist } from './types';

import { useSafeArea } from 'react-native-safe-area-context';
import {
  useIsFocused,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';

type TwittProps = React.ComponentProps<typeof Twitt>;

function renderItem({ item }: { item: TwittProps }) {
  return <Twitt {...item} />;
}

function keyExtractor(item: TwittProps) {
  return item.id.toString();
}

type Props = {
  navigation?: StackNavigationProp<StackNavigatorParamlist>;
};

const Feed = (props: Props) => {
  const theme = useTheme();

  const data = twitts.map(twittProps => ({
    ...twittProps,
    onPress: () =>
      props.navigation &&
      props.navigation.push('Details', {
        ...twittProps,
      }),
  }));

  return (
    <FlatList
      contentContainerStyle={{ backgroundColor: theme.colors.background }}
      style={{ backgroundColor: theme.colors.background }}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={() => (
        <View style={{ height: StyleSheet.hairlineWidth }} />
      )}
    />
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
