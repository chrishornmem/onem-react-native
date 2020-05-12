import React from 'react';

export type App = {
  _id: string;
  name: string;
  about_text: string;
  webAddIcon: string;
  webIconBg: string;
  webIconColor: string;
  current: boolean;
};

export type AppsContextType = {
  apps: App[];
  insertApp: (app: App) => void;
  clearAppStore: () => void;
  getCurrentApp: () => App;
  setCurrentApp: (appId: string) => void;
  setAllAppData: (all: App[]) => void;
  removeApp: (appId: string) => boolean;
};

export const AppsContext = React.createContext<AppsContextType>({
  apps: [],
  insertApp: () => {},
  clearAppStore: () => {},
  getCurrentApp: () => {},
  setCurrentApp: () => {},
  setAllAppData: () => {},
  removeApp: () => false,
});
