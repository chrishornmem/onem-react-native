import React from 'react';
import { View } from 'react-native';
import { Paragraph, useTheme } from 'react-native-paper';
import MultiSelect from 'react-native-multiple-select';
import { FormItem } from '../react-client-shared/utils/Message';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const CustomMultiSelect = (props: { formikProps: any; item: FormItem }) => {
  const { formikProps, item } = props;
  const [selectedItems, setSelectedItems] = React.useState([]); // should also use item.default
  const [options, contentItems] = makeSelectOptions(item.body);

  const multiSelect = React.useRef();

  const theme = useTheme();

  function makeSelectOptions(body: any) {
    let options: any = [];
    let contentItems: any = [];
    body.forEach(
      (option: { type: string; description: string; value: any }) => {
        if (option.type === 'option') {
          options.push({
            name: option.description,
            id: option.value,
          });
        } else {
          contentItems.push(option.description);
        }
      }
    );
    return [options, contentItems];
  }

  const handleChange = (newItems: []) => {
    formikProps.setFieldTouched(item.name, true); // seems this should be called before setting the value
    formikProps.setFieldValue(item.name, newItems, true);
    setSelectedItems(newItems);
  };

  return (
    <View style={{ flex: 1 }}>
      {contentItems.map((item: any, i: number) => (
        <Paragraph key={i}> {item} </Paragraph>
      ))}
      {/* <MultiSelect
        items={options}
        styleMainWrapper={{ backgroundColor: theme.colors.surface }}
        onSelectedItemsChange={handleChange}
        selectedItems={selectedItems as []}
        uniqueKey="id"
        styleInputGroup={{ backgroundColor: theme.colors.surface }}
        tagRemoveIconColor={theme.colors.accent}
        tagBorderColor={theme.colors.placeholder}
        tagTextColor={theme.colors.placeholder}
        selectedItemTextColor={theme.colors.primary}
        selectedItemIconColor={theme.colors.primary}
        itemTextColor={theme.colors.text}
        styleListContainer={{ backgroundColor: theme.colors.surface }}
        submitButtonColor={theme.colors.primary}
        submitButtonText="Done"
        styleSelectorContainer={{ backgroundColor: theme.colors.surface }}
      /> */}
      <SectionedMultiSelect
        items={options}
        uniqueKey="id"
        ref={multiSelect}
        onSelectedItemsChange={handleChange}
        selectedItems={selectedItems}
        selectText="Select items"
        displayKey="name"
        modalWithSafeAreaView
      />
      {/* <View>{multiSelect?.current?.getSelectedItemsExt(selectedItems)}</View> */}
    </View>
  );
};

export default CustomMultiSelect;
