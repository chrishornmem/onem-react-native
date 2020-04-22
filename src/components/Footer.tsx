import React from 'react';
import { Platform, Keyboard, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { FloatingAction } from './react-native-floating-action';

import { Appbar, Avatar, FAB, Portal, useTheme } from 'react-native-paper';

import { AuthContext } from '../react-client-shared/reducers/tokenState';
import { CustomAvatar } from './CustomAvatar';
import { emitToServer } from '../react-client-shared/utils/Socket';

export const Footer = (props: Props) => {
  const theme = useTheme();
  const [isOpen, setOpen] = React.useState(false);
  const [keyboardIsOpen, setKeyboardIsOpen] = React.useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const iconClosed = 'dots-vertical';
  const iconOpen = 'dots-horizontal';
  const { userState } = React.useContext(AuthContext);

  const { messageAction, verbs = [], maxVerbs = 6 } = props;

  const slicedVerbs = verbs.slice(0, maxVerbs);

  const makeVerbs = () => {
    let result = [];
    for (let i = 0; i < slicedVerbs.length; i++) {
      let verb = {
        name: slicedVerbs[i].name,
        text: slicedVerbs[i].name,
        onPress: (name: string) => {
          messageAction({
            type: 'REQUESTING',
            payload: null,
          });
          emitToServer({ action_type: 'footerVerbSelected', name: name });
        },
        icon: require('../../assets/onem-logo.png'),
      };
      result.push(verb);
    }
    return result;
  };

  const setKeyboardOpen = () => {
    setKeyboardIsOpen(true);
  };

  const setKeyboardClosed = () => {
    setKeyboardIsOpen(false);
  };

  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', setKeyboardOpen);
    Keyboard.addListener('keyboardDidHide', setKeyboardClosed);

    return function cleanUp() {
      Keyboard.removeListener('keyboardDidShow', setKeyboardOpen);
      Keyboard.removeListener('keyboardDidShow', setKeyboardClosed);
    };
  }, []);

  return (
    <>
      {(Platform.OS == 'ios' || !keyboardIsOpen) && (
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
            <CustomAvatar
              size={40}
              source={userState.picture}
              name={userState.name}
            />
          </TouchableOpacity>
          {verbs.length ? (
            <Portal>
              <FloatingAction
                //   open={isOpen}
                buttonSize={40}
                color="transparent"
                iconColor={theme.colors.disabled}
                distanceToEdge={20}
                actions={makeVerbs()}
                onPressItem={action => {
                  action.onPress(action.name);
                }}
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
            </Portal>
          ) : null}
        </Appbar>
      )}
    </>
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
