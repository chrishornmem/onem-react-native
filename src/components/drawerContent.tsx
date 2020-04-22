import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Button,
  Caption,
  Drawer,
  Switch,
  Text,
  Subheading,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { CommonActions } from '@react-navigation/native';
import { AuthContext } from '../react-client-shared/reducers/tokenState';
import { MessageContext } from '../react-client-shared/reducers/messageState';
import { PreferencesContext } from '../context/preferencesContext';
import { CustomAvatar } from './CustomAvatar';

type Props = DrawerContentComponentProps<DrawerNavigationProp>;

export function DrawerContent(props: Props) {
  const paperTheme = useTheme();
  const { userState, tokenAction } = React.useContext(AuthContext);
  const { messageAction } = React.useContext(MessageContext);

  const { rtl, theme, toggleRTL, toggleTheme } = React.useContext(
    PreferencesContext
  );

  const translateX = Animated.interpolate(props.progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  return (
    <DrawerContentScrollView {...props}>
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
            <CustomAvatar
              source={userState.picture}
              name={userState.name}
              size={64}
            />
          </TouchableOpacity>
          <Subheading style={styles.title}>
            {userState.name || 'Sign up or login to link your mobile number'}
          </Subheading>
          {userState.email && (
            <Caption style={styles.caption}>{userState.email}</Caption>
          )}
          {!userState.is_authenticated && (
            <View style={styles.row}>
              <View style={styles.section}>
                <Button
                  style={styles.buttonFullWidth}
               //   color="blue"
                  uppercase={false}
                  accessibilityLabel="Login or Sign up"
                  mode="contained"
                  onPress={() =>
                    props.navigation.dispatch(
                      CommonActions.navigate({
                        name: 'Login',
                      })
                    )
                  }
                >
                  Login / Sign Up
                </Button>
              </View>
            </View>
          )}
          {userState.is_authenticated && (
            <View style={styles.row}>
              <View style={styles.section}>
                <Button
                  style={styles.buttonFullWidth}
            //      color="blue"
                  uppercase={false}
                  accessibilityLabel="Logout"
                  mode="contained"
                  onPress={() => {
                    tokenAction({
                      type: 'LOGOUT',
                    });
                    messageAction({
                      type: 'LOGOUT'
                    });
                    props.navigation.closeDrawer();
                  }}
                >
                  Logout
                </Button>
              </View>
            </View>
          )}
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
                      name: 'ChatWindow',
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
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    textAlign: 'center',
  //  fontWeight: 'bold',
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
