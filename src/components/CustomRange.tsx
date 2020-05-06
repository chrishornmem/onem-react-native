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

  return (
    <>
      <Paragraph>
        {item.description ? item.description.replace('\n', '\n\n') : ''}
      </Paragraph>
      <View style={styles.container}>
        <Slider
          style={{ width: 300 }}
          step={item.step || 1}
          minimumValue={item.min_value || 0}
          maximumValue={item.max_value || 100}
          value={(item.default as number) || 0}
          onSlidingComplete={handleChange}
        />
        <View style={styles.labels}>
          <Text>{item.min_value || '0'}</Text>
          <Text>{formikProps.values[item.name] || item.default || 0}</Text>
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
