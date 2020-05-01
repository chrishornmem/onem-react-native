import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  Button,
  Caption,
  Drawer,
  List,
  Subheading,
  Switch,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { CommonActions } from '@react-navigation/native';
import { AuthContext } from '../react-client-shared/reducers/tokenState';
import { MessageContext } from '../react-client-shared/reducers/messageState';
import { PreferencesContext } from '../context/preferencesContext';
import { CustomAvatar } from './CustomAvatar';
import { AppIcon } from './AppIcon';
import { AppsContext, App } from '../context/appsContext';
import { emitToServer } from '../react-client-shared/utils/Socket';
import { registerAppByName } from '../react-client-shared/api/register';

type Props = DrawerContentComponentProps<DrawerNavigationProp>;

export function DrawerContent(props: Props) {
  const { navigation, progress } = props;
  const paperTheme = useTheme();
  const { userState, tokenAction } = React.useContext(AuthContext);
  const { messageAction } = React.useContext(MessageContext);
  const {
    apps,
    getCurrentApp,
    setCurrentApp,
    setAllAppData,
  } = React.useContext(AppsContext);
  const isDrawerOpen = useIsDrawerOpen();

  const { rtl, theme, toggleRTL, toggleTheme } = React.useContext(
    PreferencesContext
  );

  const switchService = (appId: string) => {
    console.log('/switchService:' + appId);
    setCurrentApp(appId);
    emitToServer({
      action_type: 'serviceSwitch',
      app_id: appId,
    });
    messageAction({
      type: 'REQUESTING',
      payload: null,
    });
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ChatWindow',
      })
    );
  };

  const refreshAppsList = async () => {
    if (apps.length > 0) {
      const appList = [];
      apps.map(a => appList.push(a.name));
      try {
        const result = await registerAppByName(appList);
        console.log(result);
        setAllAppData(result.data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  React.useEffect(() => {
    if (isDrawerOpen) {
      refreshAppsList();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen]);

  const translateX = Animated.interpolate(progress, {
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
              navigation.toggleDrawer();
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
                    navigation.dispatch(
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
                      type: 'LOGOUT',
                      payload: null,
                    });
                    navigation.closeDrawer();
                  }}
                >
                  Logout
                </Button>
              </View>
            </View>
          )}
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
        <Drawer.Section title="Apps">
          <List.Section style={{ paddingLeft: 0 }}>
            {apps.map((app: App, i: any) => {
              return (
                <TouchableRipple key={i} onPress={() => switchService(app._id)}>
                  <List.Item
                    style={
                      getCurrentApp()._id === app._id
                        ? { backgroundColor: paperTheme.colors.background }
                        : undefined
                    }
                    title={app.name || 'name'}
                    description={app.about_text || 'About the app'}
                    descriptionNumberOfLines={1}
                    left={props => (
                      <AppIcon
                        {...props}
                        iconBg={app.webIconBg}
                        iconColor={app.webIconColor}
                        name={app.webAddIcon}
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  />
                </TouchableRipple>
              );
            })}
          </List.Section>
          <View style={styles.userInfoSection}>
            <View style={styles.row}>
              <View style={styles.section}>
                <Button
                  style={styles.buttonFullWidth}
                  color="blue"
                  uppercase={false}
                  accessibilityLabel="Home"
                  mode="outlined"
                  onPress={() => {
                    navigation.dispatch(
                      CommonActions.navigate({
                        name: 'AddApp',
                      })
                    );
                  }}
                >
                  Add app
                </Button>
              </View>
            </View>
          </View>
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
