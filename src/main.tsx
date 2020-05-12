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
import { AddAppInit } from './components/AddAppInit';

import { PreferencesContext } from './context/preferencesContext';
import { AppsContext, App } from './context/appsContext';

import useAsyncStorage from './react-client-shared/hooks/useAsyncStorage';

export const Main = () => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light'
  );

  const [appData, setApps, hydrated] = useAsyncStorage('apps', {
    apps: [],
  });

  const insertApp = (app: App) => {
    let a = appData.apps;
    app.current = a.length === 0;
    if (!getApp(app._id)) {
      a.push(app);
      setApps({ apps: a });
    }
  };

  const getCurrentApp = () => {
    for (let a of appData.apps) {
      if (a.current) {
        return a;
      }
    }
    return {_id: null};
  };

  const getApp = (appId: string) => {
    for (let a of appData.apps) {
      if (a._id === appId) {
        return a;
      }
    }
    return undefined;
  };

  const setCurrentApp = (appId: string) => {
    let appsTemp = appData.apps;
    for (let a of appsTemp) {
      if (a._id === appId) {
        a.current = true;
      } else {
        a.current = false;
      }
    }
    setApps({ apps: appsTemp });
    return true;
  };

  const clearAppStore = () => {
    setApps({ apps: [] });
  };

  const setAllAppData = (all: App[]) => {
    console.log("/setAllAppData")
    const currentApp = getCurrentApp();
    if (currentApp._id) {
      setApps({ apps: all });
      setCurrentApp(currentApp._id);
    } else if (all.length > 0) {
      let newData = all;
      newData[0].current = true;
      setApps({ apps: newData });
    }
  }

  const removeApp = (id: string) => {
    let changeCurrent = false;
    const newData = appData.apps;
    const prevIndex = newData.findIndex(item => item._id === id);
    if (prevIndex !== -1) {
      if (newData[prevIndex]?.current && newData.length > 1) {
        changeCurrent = true;
      }
      newData.splice(prevIndex, 1);
      if (changeCurrent) newData[0].current = true;
      setAllAppData(newData);
    }
    return changeCurrent;
  }

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
      clearAppStore: clearAppStore,
      getCurrentApp: getCurrentApp,
      setCurrentApp: setCurrentApp,
      setAllAppData: setAllAppData,
      removeApp: removeApp,
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
            {hydrated && (
              <>
                {appsContext.apps && appsContext?.apps.length ? (
                  <RootNavigator />
                ) : (
                  // <RootNavigator />
                  <AddAppInit />
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
