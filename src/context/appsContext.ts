import React from 'react';

export type App = {
  id: string;
  name: string;
};

export type AppsContextType = {
  apps: App[];
};

export const AppsContext = React.createContext<AppsContextType>({
  apps: [],
});
