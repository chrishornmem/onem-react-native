import React from 'react';
import * as url from 'url';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Video } from 'expo-av';
import YoutubePlayer from 'react-native-youtube-iframe';
import { WebView } from 'react-native-webview';

import { isVideoUrl } from '../react-client-shared/utils';
import { ResponsiveImage } from './ResponsiveImage';

export const Media = (props: { src: string }) => {
  const { src } = props;
  const componentIsMounted = React.useRef(true);

  const [height, setHeight] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const [isVideo, isInternetVideo] = isVideoUrl(src);

  const setDynamicMediaDimensions = event => {
    const { width } = event.nativeEvent.layout;
    if (componentIsMounted.current) {
      setWidth(width);
      setHeight(width * 0.5625);
    }
  };

  React.useEffect(() => {
    return function cleanUp() {
      componentIsMounted.current = false;
    };
  }, []);

  return (
    <>
      {componentIsMounted.current && (
        <View
          onLayout={setDynamicMediaDimensions}
          style={{ flex: 1, alignItems: 'center' }}
        >
          {height && src?.includes('youtu.') ? (
            <TouchableOpacity activeOpacity={1}>
              {componentIsMounted.current && (
                <>
                  {/* {console.log(
                    `Width:${width}, Height:${height}, videoId:${url
                      .parse(src)
                      ?.pathname?.slice(1)}`
                  )} */}
                  <YoutubePlayer
                    width={width}
                    height={height}
                    videoId={url.parse(src)?.pathname?.slice(1)}
                    play={false}
                    initialPlayerParams={{}}
                  />
                </>
              )}
            </TouchableOpacity>
          ) : null}
          {height && !src.includes('youtu.') && isVideo && isInternetVideo ? (
            <View style={{ flex: 1, width: '100%' }}>
              <TouchableOpacity activeOpacity={1}>
                <WebView
                  overScrollMode="never"
                  containerStyle={{ flex: 0, height: height }}
                  source={{ uri: src }}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          {src && height && !isVideo ? (
            <ResponsiveImage width={width - 10} uri={src} />
          ) : null}
          {src && height && isVideo && !isInternetVideo ? (
            <TouchableOpacity activeOpacity={1}>
              <View style={{ flex: 1, height: height, width: '100%' }}>
                <Video
                  style={{
                    //      borderRadius: 5,
                    width: width,
                    height: height,
                  }}
                  resizeMode="stretch"
                  source={{ uri: src }}
                  // shouldPlay
                  useNativeControls
                  onError={e => {
                    console.log(e);
                  }}
                />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  wrapper: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 50,
  },
});
