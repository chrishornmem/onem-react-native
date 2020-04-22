import React from 'react';
import {
  Provider as PaperProvider,
  DefaultTheme,
  DarkTheme,
} from 'react-native-paper';
import { I18nManager, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { Updates } from 'expo';
import { useColorScheme } from 'react-native-appearance';

import { RootNavigator } from './components/rootNavigator';
import { AddAppScreen } from './components/AddAppScreen';

import { PreferencesContext } from './context/preferencesContext';
import { AppsContext, AppsContextType, App } from './context/appsContext';

import { Storage, STORAGE } from './react-client-shared/utils/Storage';
import useAsyncStorage from './react-client-shared/hooks/useAsyncStorage';

export const Main = () => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light'
  );

  const storage = new Storage(STORAGE.ASYNC);

  const [appData, setApps, hydrated] = useAsyncStorage('apps', {
    apps: [],
  });

  const insertApp = (app: App) => {
    let a = appData.apps;
    a.push(app);
    setApps({ apps: a });
  };

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

  //const componentIsMounted = React.useRef(true);

  // React.useEffect(() => {
  //   storage
  //     .get('apps')
  //     .then((appList: string) => {
  //       if (componentIsMounted.current && appList) {
  //         setApps(JSON.parse(appList));
  //       } else {
  //         setApps([]);
  //       }
  //     })
  //     .catch(() => {
  //       if (componentIsMounted.current) {
  //         setApps([]);
  //       }
  //     });
  //   return function cleanUp() {
  //     componentIsMounted.current = false;
  //   };
  // }, []);

  const appsContext = React.useMemo(
    () => ({
      apps: appData.apps,
      insertApp: insertApp,
    }),
    [appData.apps]
  );

  return (
    <SafeAreaView style={styles.container}>
      <PreferencesContext.Provider value={preferences}>
        <AppsContext.Provider value={appsContext}>
          <PaperProvider
            theme={
              theme === 'light'
                ? {
                    ...DefaultTheme,
                    colors: {
                      ...DefaultTheme.colors,
                      primary: '#3f51b5',
                      disabled: 'rgba(0,0,0,0.38)',
                      text: 'rgba(0,0,0,0.87)',
                    },
                  }
                : {
                    ...DarkTheme,
                    colors: { ...DarkTheme.colors, primary: '#3f51b5' },
                  }
            }
          >
            {console.log('appsContext:')}
            {console.log(JSON.stringify(appsContext))}
            {hydrated && (
              <>
                {appsContext.apps && appsContext?.apps.length ? (
                  <RootNavigator />
                ) : (
                  // <RootNavigator />
                  <AddAppScreen />
                )}
              </>
            )}
          </PaperProvider>
        </AppsContext.Provider>
      </PreferencesContext.Provider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
