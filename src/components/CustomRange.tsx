import React from 'react';
import { View, Slider, StyleSheet } from 'react-native';
import { Paragraph, Text } from 'react-native-paper';
// import Slider from '@react-native-community/slider';
import { FormItem } from '../react-client-shared/utils/Message';

const CustomRange = (props: { formikProps: any; item: FormItem }) => {
  const { formikProps, item } = props;

  //const theme = useTheme();

  const handleChange = (value: number) => {
    formikProps.setFieldTouched(item.name, true); // seems this should be called before setting the value
    formikProps.setFieldValue(item.name, value, true);
  };

  const step =
    typeof item.step === 'string' ? parseFloat(item.step as string) : item.step;
  const min_value =
    typeof item.min_value === 'string'
      ? parseFloat(item.min_value as string)
      : item.min_value;
  const max_value =
    typeof item.max_value === 'string'
      ? parseFloat(item.max_value as string)
      : item.max_value;
  const default_value =
    typeof item.default === 'string'
      ? parseFloat(item.default as string)
      : item.default;

  return (
    <>
      <Paragraph>
        {item.description ? item.description.replace('\n', '\n\n') : ''}
      </Paragraph>
      <View style={styles.container}>
        <Slider
          style={{ width: 300 }}
          step={step || 1}
          minimumValue={min_value || 0}
          maximumValue={max_value || 100}
          value={(default_value as number) || 0}
          onSlidingComplete={handleChange}
        />
        <View style={styles.labels}>
          <Text>{item.min_value || '0'}</Text>
          <Text>
            {String(formikProps.values[item.name]) ||
              String(item.default) ||
              '0'}
          </Text>
          <Text>{item.max_value || '100'}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#000',
  },
  labels: {
    width: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CustomRange;
