import React from 'react';
import { Platform } from 'react-native';
import moment from 'moment';

import { logger } from '../react-client-shared/utils/Log';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Paragraph } from 'react-native-paper';

import { EditButton } from './EditButton';
import { FormItem } from '../react-client-shared/utils/Message';

const DateSelect = (props: { formikProps: any; item: FormItem }) => {
  const { formikProps, item } = props;
  const [show, setShow] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  const handleChange = (event: any, newDate: any) => {
    setShow(Platform.OS === 'ios');
    if (newDate && newDate.toISOString() !== date.toISOString()) {
      setDate(newDate);
      formikProps.setFieldValue(item.name, newDate);
      formikProps.setFieldTouched(item.name, true);
    }
  };

  return (
    <>
      <Paragraph>
        {item.description ? item.description.replace('\n', '\n\n') : ''}
      </Paragraph>
      {((Platform.OS == 'ios' && !show) || Platform.OS !== 'ios') && (
        <EditButton
          disabled={show}
          //        mode={Platform.OS == 'ios' && show ? 'text' : 'outlined'}
          onPress={() => {
            setShow(true);
          }}
        >
          {moment(formikProps.values[item.name]).format('D MMM') ||
            'Choose date'}
        </EditButton>
      )}
      {show && (
        <DateTimePicker
          mode="date"
          display={Platform.OS == 'android' ? 'calendar' : undefined}
          value={date || new Date()}
          onChange={handleChange}
        />
      )}
    </>
  );
};

export default DateSelect;
