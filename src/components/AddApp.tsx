import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Surface, TextInput, Title  } from 'react-native-paper';

export const AddApp = (props: {
  saveApp: any;
  title: string;
  errorText?: string;
  cancelAction?: any;
  cancelButton?: boolean;
}) => {
  const [error, setError] = React.useState(null);
  const [appName, setAppName] = React.useState(null);

  const {
    errorText,
    saveApp,
    title,
    cancelButton = false,
    cancelAction = () => {},
  } = props;

  React.useEffect(() => {
    if (errorText) {
      setError(errorText);
    }
  }, [errorText]);

  return (
    <View style={styles.container}>
      <Surface style={styles.formContainer}>
        <View style={{ width: '100%' }}>
          <Title>{title}</Title>
          <TextInput
            label="App name"
            value={appName}
            onChangeText={name => {
              setAppName(name?.trim());
            }}
          />
          <HelperText type="error" visible={error}>
            {error}
          </HelperText>
          <View style={styles.buttons}>
            {cancelButton && (
              <Button compact mode="outlined" onPress={cancelAction}>
                Cancel
              </Button>
            )}
            <Button
              mode="contained"
              compact
              onPress={() => {
                setAppName(null);
                saveApp(appName);
              }}
            >
              Submit
            </Button>
          </View>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  formContainer: {
    padding: 20,
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    alignSelf: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
