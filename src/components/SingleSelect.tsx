import React, { ReactText } from 'react';
import { Picker } from 'react-native';
import { Paragraph, useTheme } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';
import { FormItem } from '../react-client-shared/utils/Message';
import { useIsDrawerOpen } from '@react-navigation/drawer';

const SingleSelect = (props: { formikProps: any; item: FormItem }) => {
  const { formikProps, item } = props;
  const [selectedValue, setSelectedValue] = React.useState(item.default || '');
  const [options, contentItems] = makeSelectOptions(item.body);

  const theme = useTheme();
  const isDrawerOpen = useIsDrawerOpen();

  const NUM_PICKER_ROWS = 3;

  function makeSelectOptions(body: any) {
    let options: any = [];
    let contentItems: any = [];
    body.forEach(
      (option: { type: string; description: string; value: any }) => {
        if (option.type === 'option') {
          options.push({
            label: option.description,
            value: option.value,
          });
        } else {
          contentItems.push(option.description);
        }
      }
    );
    return [options, contentItems];
  }

  const handleChange = (value: string, index: number) => {
    formikProps.setFieldTouched(item.name, true); // seems this should be called before setting the value
    formikProps.setFieldValue(item.name, value, true);
    setSelectedValue(value);
  };

  return (
    <>
      {contentItems.map((item: any, i: number) => (
        <Paragraph style={{ marginVertical: 0, paddingVertical: 0 }} key={i}>
          {item}
        </Paragraph>
      ))}
      {!isDrawerOpen && ( // this forces theme to be updated on IOS
        <Picker
          itemStyle={{
            color: theme.colors.text,
            height: 44 * NUM_PICKER_ROWS,
          }}
          selectedValue={selectedValue as ReactText}
          onValueChange={handleChange}
        >
          {options.map((option: any, i: number) => (
            <Picker.Item key={i} label={option.label} value={option.value} />
          ))}
        </Picker>
      )}
    </>
  );
};

export default SingleSelect;
