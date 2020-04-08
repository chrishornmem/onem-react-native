import React from 'react';

import { Appbar, Button, useTheme } from 'react-native-paper';

export const Header = (props: Props) => {
  const theme = useTheme();

  return (
    <>
      <Appbar
        theme={{ colors: { primary: theme.colors.surface } }}
        style={{
          justifyContent: 'space-between',
        }}
      >
        <Appbar.Action
          accessibilityLabel="Back"
          color={theme.colors.text}
          size={36}
          style={{ margin: 0, padding: 0, alignItems: 'flex-start' }}
          icon="chevron-left"
          onPress={() => {}}
        />
        <Appbar.Content title={'Title'} />
        <Button
          mode="text"
          onPress={() => {}}
          style={{ alignItems: 'flex-end' }}
        >
          DONE1
        </Button>
      </Appbar>
    </>
  );
};

