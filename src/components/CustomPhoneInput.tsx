import React from 'react';
import { isOfTypeAutoCompleteType } from '../react-client-shared/utils';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

import data from './Countries';

import {
  IconButton,
  Modal,
  Paragraph,
  Portal,
  TextInput,
  Button,
  useTheme,
  HelperText,
  Text,
} from 'react-native-paper';
import { FormItem } from '../react-client-shared/utils/Message';

const CustomPhoneInput = (props: { formikProps: any; item: FormItem }) => {
  const { formikProps, item } = props;
  const theme = useTheme();
  const [selectedCountry, setSelectedCountry] = React.useState(data[0]);
  const [error, setError] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);

  const handleChange = (value: string) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(
        value,
        selectedCountry.code
      );
      if (
        phoneNumber?.country &&
        phoneNumber.country !== selectedCountry.code
      ) {
        const countryObj = data.filter(
          (obj: { code: string }) => obj.code === phoneNumber.country
        )[0];
        setSelectedCountry(countryObj);
      }

      if (phoneNumber?.isValid()) {
        formikProps.setFieldTouched(item.name, true); // seems this should be called before setting the value
        formikProps.setFieldValue(item.name, phoneNumber.number, true);
        formikProps.setFieldError(item.name, null);
        setError(undefined);
      } else {
        throw 'Invalid phone number';
      }
    } catch (e) {
      console.log(e);
      formikProps.setFieldTouched(item.name, true); // seems this should be called before setting the value
      formikProps.setFieldValue(item.name, null, true);
      formikProps.setFieldError(item.name, 'Phone number is invalid');
      setError('Phone number is invalid');
    }
  };

  const getCountry = (country: string) => {
    try {
      const countryObj = data.filter(
        (obj: { name: string }) => obj.name === country
      )[0];
      // Set data from user choice of country
      setSelectedCountry(countryObj);
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  function Item({ item, borderTopColor }) {
    return (
      <TouchableWithoutFeedback onPress={() => getCountry(item.name)}>
        <View
          style={[
            styles.countryStyle,
            {
              borderTopColor: borderTopColor,
            },
          ]}
        >
          <Text style={{ fontSize: 24 }}>{item.flag}</Text>
          <Text style={{ fontSize: 16, paddingHorizontal: 5 }}>
            {item.name} ({item.dial_code})
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  const ITEM_HEIGHT = 57;

  return (
    <>
      <Paragraph>
        {item.description ? item.description.replace('\n', '\n\n') : ''}
      </Paragraph>
      <View style={styles.inputContainer}>
        <TouchableWithoutFeedback
          onPress={() => {
            setShowModal(true);
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 40, paddingRight: 0 }}>
              {selectedCountry.flag}
            </Text>
            <IconButton
              style={{
                alignItems: 'flex-start',
                marginHorizontal: 0,
                paddingHorizontal: 0,
              }}
              icon="menu-down"
              size={20}
            />
          </View>
        </TouchableWithoutFeedback>
        {/* open modal */}
        <TextInput
          style={{ flexGrow: 1 }}
          keyboardType={'phone-pad'}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={false}
          maxLength={20}
          textContentType="telephoneNumber"
          defaultValue={item.default ? String(item.default) : undefined}
          error={error !== null ? true : false}
          autoCompleteType={
            isOfTypeAutoCompleteType(item.name) ? item.name : undefined
          }
          onChangeText={handleChange}
        />
      </View>
      <HelperText type="error">{error}</HelperText>

      <View style={{ flex: 1 }}>
        <Portal>
          <Modal
            contentContainerStyle={[
              styles.modalContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.placeholder,
              },
            ]}
            visible={showModal}
            onDismiss={() => setShowModal(false)}
          >
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <Item item={item} borderTopColor={theme.colors.placeholder} />
              )}
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
            />
            <Button
              style={{ width: '100%' }}
              mode="contained"
              onPress={() => setShowModal(false)}
            >
              Close
            </Button>
          </Modal>
        </Portal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    //   padding: 20,
    height: '70%',
    width: '90%',
    minWidth: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryStyle: {
    width: 300,
    //    backgroundColor: '#5059ae',
    borderTopWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CustomPhoneInput;
