import React from 'react';
import { Platform } from 'react-native';
import { logger } from '../react-client-shared/utils/Log';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Paragraph } from 'react-native-paper';

import { FormItem } from '../react-client-shared/utils/Message';

const DateSelect = (props: { formikProps: any; item: FormItem }) => {
  const { formikProps, item } = props;
  const [show, setShow] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  const handleChange = (event: any, date: any) => {
    setShow(Platform.OS === 'ios');
    setDate(date);
    formikProps.setFieldValue(item.name, date);
    formikProps.setFieldTouched(item.name, true);
  };

  return (
    <>
      <Paragraph>
        {item.description ? item.description.replace('\n', '\n\n') : ''}
      </Paragraph>
      <Button
        onPress={() => {
          setShow(true);
        }}
      >
        {formikProps.values[item.name]?.toISOString() || 'Choose date'}
      </Button>
      {show && (
        <DateTimePicker
          mode="date"
          display={Platform.OS == 'android' ? 'calendar' : undefined}
          value={date}
          onChange={handleChange}
        />
      )}
      <Paragraph>{JSON.stringify(show)}</Paragraph>
    </>
  );
};

export default DateSelect;
