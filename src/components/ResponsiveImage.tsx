import React from 'react';
import { Image, StyleProp } from 'react-native';

export const ResponsiveImage: React.FC<{
  width?: number;
  height?: number;
  uri: string;
  style: StyleProp<T>;
}> = ({ width, height, uri, style }) => {
  const [widthVal, setWidthVal] = React.useState(width);
  const [heightVal, setHeightVal] = React.useState(height);

  React.useEffect(() => {
    Image.getSize(
      uri,
      (w: number, h: number) => {
        if (widthVal && !heightVal) {
          setHeightVal(h * (widthVal / w));
        } else if (!widthVal && heightVal) {
          setWidthVal(w * (heightVal / h));
        }
      },
      () => {
        setHeightVal(0);
        setWidthVal(0);
      }
    );
  }, []);

  return (
    <>
      {heightVal && widthVal && uri ? (
        <Image
          source={{ uri: uri }}
          style={[{ height: heightVal, width: widthVal }, style]}
        />
      ) : null}
    </>
  );
};
