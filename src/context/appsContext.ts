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
  getCurrentApp: () => void;
  setCurrentApp: (appId: string) => void;
  removeApp: (appId: string) => boolean;
  refreshAppsList: () => void;
};

export const AppsContext = React.createContext<AppsContextType>({
  apps: [],
  insertApp: () => {},
  clearAppStore: () => {},
  getCurrentApp: () => {},
  setCurrentApp: () => {},
  removeApp: () => false,
  refreshAppsList: () => {},
});
