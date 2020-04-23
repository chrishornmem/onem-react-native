import React from 'react';
import { AsyncStorage, StyleSheet, View } from 'react-native';
import {
  Button,
  Modal,
  Portal,
  Provider,
  Surface,
  Text,
  TextInput,
  HelperText,
} from 'react-native-paper';
import { AppsContext } from '../context/appsContext';
import { registerApp } from '../react-client-shared/api/register';
import { isEmptyObj } from '../react-client-shared/utils';

export const AddAppScreen: React.FC<{}> = ({}) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [appId, setAppId] = React.useState(null);
  const [errorText, setErrorText] = React.useState(null);

  const { apps, insertApp, clearAppStore } = React.useContext(AppsContext);

  const closeModal = () => setModalOpen(false);
  const showModal = () => setModalOpen(true);

  const saveApp = (appId: string) => {
    setErrorText(null);
    registerApp(appId)
      .then(result => {
        if (isEmptyObj(result?.data)) {
          throw 'Invalid app id';
        }
        const app = { name: 'name', id: appId, ...result.data };

        console.log('saveApp');
        console.log(app);
        console.log('result:');
        console.log(result);
        insertApp(app);
        console.log('savedApp');
        console.log('length:' + apps.length);
        console.log(AppsContext);
        setAppId(null);
      })
      .catch(e => {
        console.log(e);
        setErrorText(e);
      });
  };

  const clear = () => {
    clearAppStore()
  }

  return (
    <Provider>
      <Portal>
        <View style={styles.container}>
          <Modal
            contentContainerStyle={styles.modalContainer}
            visible={isModalOpen}
            onDismiss={closeModal}
          >
            <Surface style={styles.modalContainer}>
              <View style={{ width: '100%' }}>
                <TextInput
                  label="Provide app id"
                  value={appId}
                  onChangeText={id => {
                    setAppId(id);
                  }}
                />
                <HelperText type="error" visible={errorText}>
                  {errorText}
                </HelperText>
                <Button
                  style={{ alignSelf: 'flex-end', marginTop: 20 }}
                  onPress={() => saveApp(appId)}
                >
                  Submit
                </Button>
              </View>
            </Surface>
          </Modal>
          {!isModalOpen && <Text>Apps count:{apps.length}</Text>}
          {!isModalOpen && <Button onPress={showModal}>Add an app</Button>}
          {!isModalOpen && <Button onPress={clear}>Clear store</Button>}
        </View>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  modalContainer: {
    padding: 20,
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    alignSelf: 'center',
  },
});
