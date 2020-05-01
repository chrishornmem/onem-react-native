import React from 'react';
import { AppsContext } from '../context/appsContext';
import { registerAppByName } from '../react-client-shared/api/register';
import { isEmptyObj } from '../react-client-shared/utils';
import { AddApp } from './AddApp';

export const AddAppInit: React.FC<{}> = ({}) => {
  const [error, setError] = React.useState(null);
  const { apps, insertApp, clearAppStore } = React.useContext(AppsContext);

  const saveApp = (appName: string) => {
    setError(null);
    registerAppByName(appName)
      .then(result => {
        if (isEmptyObj(result?.data)) {
          throw 'Invalid app name';
        }
        const app = { ...result.data };
        insertApp(app);
      })
      .catch(e => {
        console.log(e);
        setError(JSON.stringify(e));
      });
  };

  return (
    <AddApp
      apps={apps}
      saveApp={saveApp}
      clearAppStore={clearAppStore}
      errorText={error}
    />
  );
};
