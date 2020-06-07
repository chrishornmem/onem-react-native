import React from 'react';
import { View } from 'react-native';

import * as url from 'url';

import { Video } from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';

import {
  Avatar,
  Button,
  Card,
  Paragraph,
  Subheading,
  Title,
} from 'react-native-paper';

import { WebView } from 'react-native-webview';

import { isVideoUrl } from '../react-client-shared/utils';
import { ResponsiveImage } from './ResponsiveImage';

export const CustomCardItem = (props: {
  item: CardItem;
  onCardSelected?: any;
  onCardActionSelected?: any;
  disabled?: boolean;
}) => {
  const {
    item,
    disabled = false,
    onCardSelected = null,
    onCardActionSelected = null,
  } = props;

  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);

  const setDynamicMediaDimensions = event => {
    const { width } = event.nativeEvent.layout;
    setWidth(width);
    setHeight(width * 0.5625);
  };

  const [isVideo, isInternetVideo] = isVideoUrl(item?.src);

  const LeftContent = props => (
    <Avatar.Image
      size={24}
      {...props}
      source={{ uri: item?.header?.avatar.src }}
    />
  );

  return (
    <View
      onLayout={setDynamicMediaDimensions}
      style={{ padding: 5, flex: 1, alignItems: 'center' }}
    >
      <Card
        onPress={
          typeof onCardSelected === 'function' && !disabled
            ? onCardSelected
            : undefined
        }
        style={{ maxWidth: 470, width: '100%' }}
      >
        {item?.header && (
          <Card.Title
            style={{ padding: 10 }}
            title={item?.header?.title}
            subtitle={item?.header?.subtitle}
            left={item?.header?.avatar ? LeftContent : false}
          />
        )}
        {height && item?.src?.includes('youtu.') ? (
          <YoutubePlayer
            width={width}
            height={height}
            videoId={url.parse(item.src)?.pathname?.slice(1)}
            play={false}
          />
        ) : null}
        {height &&
        !item?.src?.includes('youtu.') &&
        isVideo &&
        isInternetVideo ? (
          <View style={{ flex: 1, width: '100%' }}>
            <WebView
              overScrollMode="never"
              containerStyle={{ flex: 0, height: height }}
              source={{ uri: item.src }}
            />
          </View>
        ) : null}
        {item?.src && height && !isVideo ? (
          <ResponsiveImage width={width - 10} uri={item.src} />
        ) : null}
        {item?.src && height && isVideo && !isInternetVideo ? (
          <View style={{ flex: 1, height: height + 20, width: '100%' }}>
            <Video
              style={{
                //      borderRadius: 5,
                width: width - 10,
                height: height,
              }}
              resizeMode="stretch"
              source={{ uri: item?.src }}
              // shouldPlay
              useNativeControls
              onError={e => {
                console.log(e);
              }}
            />
          </View>
        ) : null}
        <Card.Content>
          {item.title && <Title>{item.title}</Title>}
          {item.subtitle && <Subheading>{item.subtitle}</Subheading>}
          {item.description && <Paragraph>{item.description}</Paragraph>}
        </Card.Content>
        <Card.Actions style={{ flexWrap: 'wrap' }}>
          {item?.actions?.map((action, i) => {
            return (
              <Button
                onPress={() => {
                  if (typeof onCardActionSelected === 'function') {
                    onCardActionSelected(i);
                  }
                }}
                key={i}
              >
                {action.name}
              </Button>
            );
          })}
        </Card.Actions>
      </Card>
    </View>
  );
};
