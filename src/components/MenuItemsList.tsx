import React, { Suspense } from 'react';
import { Video } from 'expo-av';

import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { MessageContext } from '../react-client-shared/reducers/messageState';

import { Button, Card, Paragraph, useTheme } from 'react-native-paper';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { MtText, MenuItem } from '../react-client-shared/utils/Message';
import { isVideoUrl } from '../react-client-shared/utils';
import { emitToServer } from '../react-client-shared/utils/Socket';

import { Loader } from './Loader';
import { Header } from './Header';
import { Footer } from './Footer';
import { CustomCardItem } from './CustomCardItem';
import { ResponsiveImage } from './ResponsiveImage';
import { Media } from './Media';
import { LoaderContext } from '../context/loaderContext';

const SwitchMenuItem: React.FC<{
  item: MenuItem;
  token: string;
  tokenAction: any;
  dispatch: any;
  index: number;
  setIsLoading: any;
}> = ({ item, token, tokenAction, dispatch, index, setIsLoading }) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [isVideo, isInternetVideo] = isVideoUrl(item?.src);

  const clicked = (i: Number) => {
    dispatch({
      type: 'REQUESTING',
    });
    setIsLoading(true);
    emitToServer({ action_type: 'menuOptionSelected', option_index: index });
  };

  const cardActionClicked = (i: Number) => {
    dispatch({
      type: 'REQUESTING',
    });
    setIsLoading(true);
    emitToServer({
      action_type: 'cardActionSelected',
      body_index: index,
      action_index: i,
    });
  };

  switch (item.type) {
    case 'option':
      return (
        <>
          {item.card && (
            <CustomCardItem
              item={item.card}
              onCardSelected={() => clicked(index)}
              onCardActionSelected={cardActionClicked}
            />
          )}
          {!item.card && item.description && !item.src ? (
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
              {item.src && !isVideo ? (
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
                <View style={styles.imageOptionContainer}>
                  {item.src && <Media src={item.src} />}
                  {item.description && (
                    <Button
                      style={[styles.caption, styles.captionButton]}
                      mode="contained"
                      uppercase={false}
                      onPress={() => clicked(index)}
                      contentStyle={{ alignSelf: 'flex-start' }}
                    >
                      {item.description}
                    </Button>
                  )}
                </View>
              )}
            </>
          )}
        </>
      );

    case 'content':
      return (
        <>
          {item.card && (
            <CustomCardItem
              item={item.card}
              onCardActionSelected={cardActionClicked}
              disabled
            />
          )}
          {!item.card && item.description && !item.src && (
            <Paragraph>{item.description}</Paragraph>
          )}
          {!item.card && item.src && <Media src={item.src} />}
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
  token: string;
  tokenAction: any;
}> = ({ token, tokenAction }) => {
  const { messageState, messageAction, isRequesting } = React.useContext(
    MessageContext
  );

  const { message } = messageState;
  const { mtText } = message;

  const [isLoading, setIsLoading] = React.useState(false);
  // const { isLoading } = React.useContext(LoaderContext);

  return (
    <>
      <Header
        title={mtText.header}
        leftHidden={mtText.__is_root}
        dispatch={messageAction}
        handleHomeClick={() => {
          setIsLoading(true);
        }}
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
                        dispatch={messageAction}
                        item={item}
                        index={i}
                        setIsLoading={setIsLoading}
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
        messageAction={messageAction}
        token={token}
        tokenAction={tokenAction}
      />
      {isLoading && <Loader />}
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
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
