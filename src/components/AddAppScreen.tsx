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
} from 'react-native-paper';
import { AppsContext } from '../context/appsContext';

export const AddAppScreen: React.FC<{}> = ({}) => {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [appId, setAppId] = React.useState(null);

  const { apps, insertApp } = React.useContext(AppsContext);

  const closeModal = () => setModalOpen(false);
  const showModal = () => setModalOpen(true);

  const saveApp = (appId: string) => {
    const app = { name: 'name', id: appId };
    console.log('saveApp');
    console.log(app)
    insertApp(app);
    console.log('savedApp');
    console.log('length:' + apps.length);
    console.log(AppsContext)

};

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
                <Button
                  style={{ alignSelf: 'flex-end', marginTop: 20 }}
                  onPress={() => saveApp(appId)}
                >
                  Submit
                </Button>
              </View>
            </Surface>
          </Modal>
          {!isModalOpen && <Button onPress={showModal}>Add an app</Button>}
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
