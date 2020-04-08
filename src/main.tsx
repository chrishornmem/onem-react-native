import React from 'react';
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from 'react-native-paper';
import { I18nManager, SafeAreaView, StyleSheet } from 'react-native';
import { Updates } from 'expo';
import { useColorScheme } from 'react-native-appearance';

import { RootNavigator } from './rootNavigator';
import { PreferencesContext } from './context/preferencesContext';

export const Main = () => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light'
  );
  const [rtl] = React.useState<boolean>(I18nManager.isRTL);

  function toggleTheme() {
    setTheme(theme => (theme === 'light' ? 'dark' : 'light'));
  }

  const toggleRTL = React.useCallback(() => {
    I18nManager.forceRTL(!rtl);
    Updates.reloadFromCache();
  }, [rtl]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      toggleRTL,
      theme,
      rtl: (rtl ? 'right' : 'left') as 'right' | 'left',
    }),
    [rtl, theme, toggleRTL]
  );

  return (
    <SafeAreaView style={styles.container}>
      <PreferencesContext.Provider value={preferences}>
        <PaperProvider
          theme={
            theme === 'light'
              ? {
                ...DefaultTheme,
                colors: { ...DefaultTheme.colors },
              }
              : {
                ...DarkTheme,
                colors: { ...DarkTheme.colors },
              }
          }
        >
          <RootNavigator />
        </PaperProvider>
      </PreferencesContext.Provider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
