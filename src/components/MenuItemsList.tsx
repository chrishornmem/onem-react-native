import React, { Suspense } from 'react';
import { Video } from 'expo-av';

import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button, Caption, Card, Paragraph, useTheme } from 'react-native-paper';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { MtText, MenuItem } from '../react-client-shared/utils/Message';
import { isVideoUrl } from '../react-client-shared/utils';
import { emitToServer } from '../react-client-shared/utils/Socket';

import { Header } from './Header';
import { Footer } from './Footer';
import { ResponsiveImage } from './ResponsiveImage';

const SwitchMenuItem: React.FC<{
  item: MenuItem;
  token: string;
  tokenAction: any;
  dispatch: any;
  index: number;
}> = ({ item, token, tokenAction, dispatch, index }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const clicked = (i: Number) => {
    dispatch({
      type: 'REQUESTING',
    });
    emitToServer({ action_type: 'menuOptionSelected', option_index: index });
  };

  switch (item.type) {
    case 'option':
      return (
        <>
          {item.description && !item.src ? (
            <>
              <Button
                style={styles.buttonFullWidth}
                uppercase={false}
                accessibilityLabel={item.description}
                mode="outlined"
                onPress={() => clicked(index)}
              >
                {item.description}
              </Button>
            </>
          ) : (
            <>
              {!isVideoUrl(item.src) ? (
                <View style={styles.imageOptionContainer}>
                  <ResponsiveImage
                    width={Dimensions.get('window').width - 32}
                    style={{ borderRadius: 5 }}
                    uri={item.src}
                    // resizeMode="contain"
                  />
                  <Button
                    mode="contained"
                    onPress={() => clicked(index)}
                    uppercase={false}
                    contentStyle={{ alignSelf: 'flex-start' }}
                    style={[styles.caption, styles.captionButton]}
                  >
                    {item.description}
                  </Button>
                </View>
              ) : (
                <>
                  <Video
                    style={{
                      //      borderRadius: 5,
                      width: Dimensions.get('window').width - 32,
                      height: 300,
                    }}
                    source={{ uri: item.src }}
                    //shouldPlay
                    useNativeControls
                    onError={e => {
                      console.log(e);
                    }}
                  />
                  <Button
                    style={[styles.captionButton]}
                    mode="contained"
                    uppercase={false}
                    onPress={() => clicked(index)}
                    contentStyle={{ alignSelf: 'flex-start' }}
                  >
                    {item.description}
                  </Button>
                </>
              )}
            </>
          )}
        </>
      );

    case 'content':
      return (
        <>
          {item.description && !item.src ? (
            <Paragraph>{item.description}</Paragraph>
          ) : (
            <>
              {!isVideoUrl(item.src) ? (
                <View style={{ paddingRight: 16 }}>
                  <ResponsiveImage
                    width={Dimensions.get('window').width - 32}
                    uri={item.src}
                    style={{ borderRadius: 5 }}
                  />
                </View>
              ) : (
                //                 <View>
                //                   <Image
                // //                    style={{ borderRadius: 5, width: '100%', height: 100, resizeMode: 'cover' }}
                //                     source={{ uri: item.src }}
                //                   />
                //                 </View>

                <Video
                  style={{
                    //      borderRadius: 5,
                    width: Dimensions.get('window').width - 32,
                    height: 300,
                  }}
                  source={{ uri: item.src }}
                  //shouldPlay
                  useNativeControls
                  onError={e => {
                    console.log(e);
                  }}
                />
              )}
            </>
          )}
        </>
      );

    case 'login':
      return (
        <Button
          style={styles.buttonFullWidth}
          color={theme.colors.primary}
          uppercase={false}
          accessibilityLabel="Login or Signup"
          mode="contained"
          onPress={() =>
            navigation.dispatch(
              CommonActions.navigate({
                name: 'Login',
              })
            )
          }
        >
          Login/Signup
        </Button>
      );

    case 'logout':
      return (
        <Button
          style={styles.buttonFullWidth}
          color={theme.colors.error}
          uppercase={false}
          accessibilityLabel="Logout"
          mode="contained"
          onPress={() => {
            tokenAction({
              type: 'LOGOUT',
            });
            dispatch({
              type: 'LOGOUT',
              payload: null,
            });
          }}
        >
          Logout
        </Button>
      );

    default:
      return null;
  }
};

const MenuItemsList: React.FC<{
  mtText: MtText;
  dispatch: any;
  token: string;
  tokenAction: any;
}> = ({ mtText, dispatch, token, tokenAction }) => {
  return (
    <>
      <Header
        title={mtText.header}
        leftHidden={mtText.__is_root}
        dispatch={dispatch}
      />
      <Card style={[styles.cardWrapper, { paddingBottom: 50 }]}>
        <Card.Content style={styles.container}>
          <ScrollView>
            {mtText?.body
              ? (mtText.body as MenuItem[]).map((item: MenuItem, i: number) => {
                  return (
                    <View style={styles.item} key={i}>
                      <SwitchMenuItem
                        token={token}
                        tokenAction={tokenAction}
                        dispatch={dispatch}
                        item={item}
                        index={i}
                      />
                    </View>
                  );
                })
              : null}
          </ScrollView>
        </Card.Content>
      </Card>
      <Footer
        verbs={
          typeof mtText === 'object' && mtText.__verbs
            ? (mtText as MtText).__verbs
            : []
        }
        messageAction={dispatch}
        token={token}
        tokenAction={tokenAction}
      />
    </>
  );
};

export default MenuItemsList;

const styles = StyleSheet.create({
  buttonFullWidth: {
    width: '100%',
  },
  item: {
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    //  justifyContent: 'center',
  },
  cardWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageOptionContainer: {
    flex: 1,
    width: '100%',
    //  justifyContent: 'center',
  },
  caption: {
    position: 'absolute',
    bottom: 0,
  },
  captionButton: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
