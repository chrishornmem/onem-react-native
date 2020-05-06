import React from 'react';

import {
  View,
  // Text,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  AsYouType,
  parsePhoneNumberFromString,
  ParseError,
} from 'libphonenumber-js';

import data from './Countries';

import {
  IconButton,
  Modal,
  Paragraph,
  Portal,
  Provider,
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
  const [selectedCountry, setSelectedCountry] = React.useState({
    name: 'United Kingdom',
    flag: '🇬🇧',
    code: 'GB',
    dial_code: '+44',
  });

  const [error, setError] = React.useState('');

  const [showModal, setShowModal] = React.useState(false);

  const [countryData, setCountryData] = React.useState([]);

  //const theme = useTheme();

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
        const countryObj = countryData.filter(
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
    const countryData = data;
    try {
      const countryObj = countryData.filter(
        (obj: { name: string }) => obj.name === country
      )[0];
      // Set data from user choice of country
      setSelectedCountry(countryObj);
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    setCountryData(data);
  }, []);

  return (
    <>
      <Paragraph>
        {item.description ? item.description.replace('\n', '\n\n') : ''}
      </Paragraph>

      {/* <View style={styles.container}> */}
      {/* <Container style={styles.infoContainer}> */}
      {/* Phone input with native-base */}
      {/* phone section  */}
      <View style={styles.infoContainer}>
        {/* country flag */}
        <TouchableWithoutFeedback onPress={() => setShowModal(true)}>
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
          style={styles.input}
          keyboardType={'phone-pad'}
          //    returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={false}
          // value={item.default}
          onChangeText={handleChange}
        />
      </View>
      <HelperText type="error">{error}</HelperText>
      <Portal>
        <View style={{ flex: 1 }}>
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
              data={countryData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => getCountry(item.name)}>
                  <View
                    style={[
                      styles.countryStyle,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '90%',
                        //    justifyContent: 'space-between',
                        //     backgroundColor: theme.colors.surface,
                        borderTopColor: theme.colors.placeholder,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 24 }}>{item.flag}</Text>
                    <Text style={{ fontSize: 16, paddingHorizontal: 5 }}>
                      {item.name} ({item.dial_code})
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            />
            <Button
              style={{ width: '100%' }}
              mode="contained"
              onPress={() => setShowModal(false)}
            >
              Close
            </Button>
          </Modal>
        </View>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    padding: 20,
    height: '70%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemStyle: {
    marginBottom: 10,
  },
  modalStyle: {
    flex: 1,
    height: 300,
  },
  iconStyle: {
    color: '#fff',
    fontSize: 28,
    // marginLeft: 15,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#b44666',
    padding: 14,
    marginBottom: 10,
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  textStyle: {
    padding: 5,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  countryStyle: {
    flex: 1,
    //    backgroundColor: '#5059ae',
    borderTopWidth: 1,
    padding: 12,
  },
  closeButtonStyle: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#b44666',
  },
});

export default CustomPhoneInput;
