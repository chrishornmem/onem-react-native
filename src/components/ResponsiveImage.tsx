import React from 'react';
import { ActivityIndicator, Image, StyleProp } from 'react-native';
// import { Image } from 'react-native-elements';

export const ResponsiveImage: React.FC<{
  uri: string;
  width?: number;
  height?: number;
  style?: StyleProp<T>;
}> = ({ uri, width, height, style }) => {
  const [widthVal, setWidthVal] = React.useState(width);
  const [heightVal, setHeightVal] = React.useState(height);
  const modUri = uri + '?' + new Date().toString();

  const componentIsMounted = React.useRef(true);

  React.useEffect(() => {
    return function cleanUp() {
      componentIsMounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    Image.getSize(
      uri,
      (w: number, h: number) => {
        if (componentIsMounted.current) {
          if (width && h && !height) {
            setHeightVal(h * (widthVal / w));
          } else if (!width && w && height) {
            setWidthVal(w * (heightVal / h));
          }
        }
      },
      e => {
        if (componentIsMounted.current) {
          console.log(uri);
          console.log('error in getting image');
          console.log(e);
          setHeightVal(0);
          setWidthVal(0);
        }
      }
    );
  }, [width, height, heightVal, uri, widthVal]);

  return (
    <>
      {(!heightVal || !widthVal) && <ActivityIndicator />}
      {heightVal && widthVal && uri ? (
        <Image
         // key={new Date().toString()}
         resizeMode='contain'
          source={{ uri: modUri }}
          style={[{ height: heightVal, width: widthVal }, style]}
        />
      ) : null}
    </>
  );
};
