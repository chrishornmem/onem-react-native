import React, { Suspense } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Video } from 'expo-av';
import { ScrollView } from 'react-native';

import { Button, Caption, Card, Paragraph } from 'react-native-paper';

import { MtText, MenuItem } from '../react-client-shared/utils/Message';
import { User } from '../react-client-shared/reducers/userState';
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
              <TouchableOpacity onPress={() => clicked(index)}>
                {!isVideoUrl(item.src) ? (
                  <Image
                    style={{ borderRadius: 5, width: '100%' }}
                    source={{ uri: item.src }}
                    resizeMode="contain"
                  />
                ) : (
                    <Video
                      style={{ borderRadius: 5, width: '100%' }}
                      source={{ uri: item.src }}
                    ></Video>
                  )}
                <Caption>{item.description}</Caption>
              </TouchableOpacity>
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
                      style={{ borderRadius: 5, width: '100%' }}
                      source={{ uri: item.src }}
                    ></Video>
                  )}
              </>
            )}
        </>
      );

    case 'login':
      return (
        <Button
          style={styles.buttonFullWidth}
          color="blue"
          uppercase={false}
          accessibilityLabel="Login or Sign up"
          mode="contained"
          onPress={() => console.log('Pressed')}
        >
          Login / Sign Up
        </Button>
      );

    case 'logout':
      return (
        <Button
          style={styles.buttonFullWidth}
          color="blue"
          uppercase={false}
          accessibilityLabel="Logout"
          mode="contained"
          onPress={() => console.log('Pressed')}
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
  userAction: any;
  user: User;
}> = ({ mtText, dispatch, token, tokenAction, userAction, user }) => {
  return (
    <>
      <Header
        title={mtText.header}
        leftHidden={mtText.__is_root}
        dispatch={dispatch}
      />
      <Card style={styles.cardWrapper}>
        <Card.Content style={styles.container}>
          <ScrollView>
            {mtText && mtText.body
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
      <Footer />
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
});
