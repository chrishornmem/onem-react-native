import React from 'react';

export type App = {
  id: string;
  name: string;
  about: string;
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
};

export const AppsContext = React.createContext<AppsContextType>({
  apps: [],
  insertApp: () => {},
  clearAppStore: () => {},
  getCurrentApp: () => {},
  setCurrentApp: () => {},
});
