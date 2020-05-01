import React from 'react';
import { StyleSheet, View } from 'react-native';
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
import { App } from '../context/appsContext';

export const AddApp = (props: {
  apps: App[];
  saveApp: any;
  clearAppStore: any;
  errorText?: string;
}) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [appName, setAppName] = React.useState(null);

  const { apps, clearAppStore, errorText, saveApp } = props;

  const closeModal = () => setModalOpen(false);
  const showModal = () => setModalOpen(true);

  React.useEffect(() => {
    if (errorText) {
      setError(errorText);
    }
  }, [errorText]);

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
                  label="Provide app name"
                  value={appName}
                  onChangeText={name => {
                    setAppName(name);
                  }}
                />
                <HelperText type="error" visible={error}>
                  {error}
                </HelperText>
                <Button
                  style={{ alignSelf: 'flex-end', marginTop: 20 }}
                  onPress={() => {
                    setAppName(null);
                    saveApp(appName);
                  }}
                >
                  Submit
                </Button>
              </View>
            </Surface>
          </Modal>
          {!isModalOpen && <Text>Apps count:{apps.length}</Text>}
          {!isModalOpen && <Button onPress={showModal}>Add an app</Button>}
          {!isModalOpen && <Button onPress={clearAppStore}>Clear store</Button>}
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
