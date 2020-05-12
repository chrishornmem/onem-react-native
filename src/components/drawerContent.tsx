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
  IconButton,
  List,
  Subheading,
  Switch,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { SwipeListView } from 'react-native-swipe-list-view';

import Animated from 'react-native-reanimated';
import { CommonActions } from '@react-navigation/native';
import { AuthContext } from '../react-client-shared/reducers/tokenState';
import { MessageContext } from '../react-client-shared/reducers/messageState';
import { PreferencesContext } from '../context/preferencesContext';
import { CustomAvatar } from './CustomAvatar';
import { AppIcon } from './AppIcon';
import { AppsContext, App } from '../context/appsContext';
import { emitToServer } from '../react-client-shared/utils/Socket';
import { registerApp } from '../react-client-shared/api/register';

type Props = DrawerContentComponentProps<DrawerNavigationProp>;

export function DrawerContent(props: Props) {

  const VERSION = 'v0.2.0POC';

  const { navigation, progress } = props;
  const paperTheme = useTheme();
  const { userState, tokenAction } = React.useContext(AuthContext);
  const { messageAction } = React.useContext(MessageContext);
  const {
    apps,
    getCurrentApp,
    setCurrentApp,
    setAllAppData,
    removeApp,
  } = React.useContext(AppsContext);
  const isDrawerOpen = useIsDrawerOpen();

  const [openRows, setOpenRows] = React.useState([]);

  const { rtl, theme, toggleRTL, toggleTheme } = React.useContext(
    PreferencesContext
  );

  const onRowDidOpen = (
    rowKey: React.ReactText,
    rowMap: { [x: string]: any }
  ) => {
    const newOpenRows = openRows;
    newOpenRows.push(rowMap[rowKey]);
    setOpenRows(newOpenRows);
  };

  const closeAllOpenRows = () => {
    openRows.forEach(ref => {
      ref?.closeRow();
    });
  };

  const switchService = (appId: string) => {
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
      apps.map(a => appList.push(a._id));
      try {
        const result = await registerApp(appList);
        console.log("/refreshAppsList")
        console.log(result.data)
        for (let a of result.data) {
          a.webAddIcon = a.webAddIcon.replace(/_/g, '-');
        }
        setAllAppData(result.data);
      } catch (e) {
        console.log(e)
      }
    }
  };

  const renderItem = (data: { item: App }) => (
    <TouchableRipple
      key={data.item._id}
      onPress={() => switchService(data.item._id)}
    >
      <List.Item
        style={
          getCurrentApp()._id === data.item._id
            ? { backgroundColor: paperTheme.colors.background }
            : { backgroundColor: paperTheme.colors.surface }
        }
        title={data.item.name || 'name'}
        description={data.item.about_text || 'About the app'}
        descriptionNumberOfLines={1}
        left={props => (
          <AppIcon
            {...props}
            iconBg={data.item.webIconBg}
            iconColor={data.item.webIconColor}
            name={data.item.webAddIcon}
            style={{ marginLeft: 8 }}
          />
        )}
      />
    </TouchableRipple>
  );

  const renderHiddenItem = (data: { item: { _id: string } }, rowMap: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          let currentChanged = removeApp(data.item._id);
          if (currentChanged) {
            switchService(getCurrentApp()._id)
          }
        }}
      >
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  React.useEffect(() => {
    if (isDrawerOpen) {
      closeAllOpenRows();
      refreshAppsList();
    }
  }, [isDrawerOpen]);


  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 0.5, 0.7, 0.8, 1],
    outputRange: [-100, -85, -70, -45, 0],
  });

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 1,
        }}
      >
        <View style={styles.version}>
          <Text style={{ color: paperTheme.colors.disabled }}>{VERSION}</Text>
        </View>
        <IconButton
          style={styles.close}
          icon="close"
          size={28}
          color={paperTheme.colors.disabled}
          onPress={() => navigation.toggleDrawer()}
        />
      </View>
      <DrawerContentScrollView style={{ paddingTop: 0 }} {...props}>
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
            <CustomAvatar
              source={userState.picture}
              name={userState.name}
              size={64}
            />
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
              <SwipeListView
                data={apps}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-75}
                disableRightSwipe
                onRowDidOpen={onRowDidOpen}
              />
            </List.Section>
            <View style={styles.userInfoSection}>
              <View style={{ marginVertical: 10 }}>
                <View style={styles.section}>
                  <Button
                    color="blue"
                    icon="plus"
                    compact
                    labelStyle={{ minWidth: '80%' }}
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
    </>
  );
}

const styles = StyleSheet.create({
  buttonFullWidth: {
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
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
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
  version: {
    // position: 'absolute',
    // left: 10,
    // top: 10,
    fontSize: 8,
    marginLeft: 10,
  },
  close: {
    // position: 'absolute',
    // left: 50,
    // top: 10,
    //fontSize: 8,
    //  alignSelf: 'flex-end'
  },
});
