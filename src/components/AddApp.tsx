import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Surface,
  TextInput,
  Title,
} from 'react-native-paper';

export const AddApp = (props: {
  onSubmit: any;
  value: string;
  title: string;
  disabled: boolean;
  onChangeText?: any;
  errorText?: string;
  cancelAction?: any;
  cancelButton?: boolean;
}) => {
  const {
    disabled,
    errorText,
    onSubmit,
    value,
    onChangeText,
    title,
    cancelButton = false,
    cancelAction = () => {},
  } = props;

  return (
    <View style={styles.container}>
      <Surface style={styles.formContainer}>
        <View style={{ width: '100%' }}>
          <Title>{title}</Title>
          <TextInput
            label="App name"
            value={value}
            onChangeText={onChangeText}
          />
          <HelperText type="error">{errorText}</HelperText>
          <View style={styles.buttons}>
            {cancelButton && (
              <Button compact mode="outlined" onPress={cancelAction}>
                Cancel
              </Button>
            )}
            <Button
              mode="contained"
              compact
              disabled={disabled}
              style={!cancelButton ? { width: '100%' } : null}
              onPress={onSubmit}
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
  },
});
