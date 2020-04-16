import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Avatar,
  Button,
  Caption,
  Drawer,
  Paragraph,
  Switch,
  Text,
  Title,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { AuthContext } from './react-client-shared/reducers/tokenState';
import { PreferencesContext } from './context/preferencesContext';
import { getUserProfile } from './react-client-shared/api/userProfile';
import { User } from './react-client-shared/reducers/userState';

type Props = DrawerContentComponentProps<DrawerNavigationProp>;

export function DrawerContent(props: Props) {
  const paperTheme = useTheme();
  const { tokenState, tokenAction } = React.useContext(AuthContext);
  const [userState, setUserState] = React.useState({} as User)

  const { rtl, theme, toggleRTL, toggleTheme } = React.useContext(
    PreferencesContext
  );

  const translateX = Animated.interpolate(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  React.useEffect(() => {
    if (tokenState.token) {
      setUserState(getUserProfile(tokenState.token))
    }
  }, [tokenState.token]);

  return (
    <DrawerContentScrollView {...props}>
      {console.log("userState:")}
      {console.log(userState)}
      <Animated.View
        //@ts-ignore
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              props.navigation.toggleDrawer();
            }}
          >
            <Avatar.Image
              source={{
                uri:
                  userState.picture || 'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
              }}
              size={50}
            />
          </TouchableOpacity>
          <Title style={styles.title}>{userState.name}</Title>
          <Caption style={styles.caption}>{userState.email}</Caption>
          {!userState.is_authenticated && <View style={styles.row}>
            <View style={styles.section}>
              <Button
                style={styles.buttonFullWidth}
                color="blue"
                uppercase={false}
                accessibilityLabel="Login or Sign up"
                mode="contained"
                onPress={() =>
                  props.navigation.dispatch(
                    CommonActions.navigate({
                      name: 'Login'
                    })
                  )
                }
              >
                Login / Sign Up
              </Button>
            </View>
          </View>}
          {userState.is_authenticated && <View style={styles.row}>
            <View style={styles.section}>
              <Button
                style={styles.buttonFullWidth}
                color="blue"
                uppercase={false}
                accessibilityLabel="Logout"
                mode="contained"
                onPress={() => {
                  console.log("tokenAction:"+typeof tokenAction);
                  console.log("token:"+tokenState.token);
                  tokenAction({
                    type: "LOGOUT"
                  });
                  props.navigation.closeDrawer();
                }}
              >
                Logout
              </Button>
            </View>
          </View>}
          <View style={styles.row}>
            <View style={styles.section}>
              <Button
                style={styles.buttonFullWidth}
                color="blue"
                uppercase={false}
                accessibilityLabel="Home"
                mode="outlined"
                onPress={() =>
                  props.navigation.dispatch(
                    CommonActions.navigate({
                      name: 'ChatWindow'
                    })
                  )
                }
              >
                Home
              </Button>
            </View>
          </View>
        </View>
        <Drawer.Section title="Preferences">
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={theme === 'dark'} />
              </View>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={toggleRTL}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={rtl === 'right'} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  buttonFullWidth: {
    width: '100%',
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
