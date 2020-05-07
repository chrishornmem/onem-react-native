import React from 'react';
import { View } from 'react-native';
import { Paragraph, useTheme } from 'react-native-paper';
import { FormItem } from '../react-client-shared/utils/Message';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const CustomMultiSelect = (props: { formikProps: any; item: FormItem }) => {
  const { formikProps, item } = props;
  const [selectedItems, setSelectedItems] = React.useState([]); // should also use item.default
  const [options, contentItems] = makeSelectOptions(item.body);
  const multiSelect = React.useRef();
  const theme = useTheme();
  const ITEM_HEIGHT = 45;
  const MIN_ITEMS_IN_VIEW = 2;
  const MAX_ITEMS_IN_VIEW = 9;

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

  const getItemCount = (itemsLength: number) => {

    if (itemsLength > MAX_ITEMS_IN_VIEW) {
      return MAX_ITEMS_IN_VIEW;
    } else if (itemsLength < MIN_ITEMS_IN_VIEW) {
      return MIN_ITEMS_IN_VIEW;
    } else {
      return itemsLength;
    }
  }


  return (
    <View style={{ flex: 1 }}>
      {contentItems.map((item: any, i: number) => (
        <Paragraph key={i}> {item} </Paragraph>
      ))}
      <SectionedMultiSelect
        modalWithSafeAreaView
        modalWithTouchable
        items={options}
        uniqueKey="id"
        ref={multiSelect}
        onSelectedItemsChange={handleChange}
        selectedItems={selectedItems}
        selectText="Select items"
        displayKey="name"
        colors={{
          subText: theme.colors.text,
          text: theme.colors.disabled,
          itemBackground: theme.colors.surface,
          subItemBackground: theme.colors.surface,
          disabled: theme.colors.disabled,
          primary: theme.colors.primary,
          success: theme.colors.accent,
          cancel: theme.colors.error,
          selectToggleTextColor: theme.colors.text,
          searchSelectionColor: theme.colors.text,
          searchPlaceholderTextColor: theme.colors.text,
        }}
        styles={{
          selectedItemText: { color: theme.colors.primary },
          itemText: { fontWeight: 'normal', fontSize: 17 },
          container: {
            maxHeight: ITEM_HEIGHT * getItemCount(options.length) + 95,
            backgroundColor: theme.colors.surface,
          },
          scrollView: {
            maxHeight: ITEM_HEIGHT * getItemCount(options.length) + 95,
          },
          searchBar: {
            backgroundColor: theme.colors.disabled,
          },
          modalWrapper: { backgroundColor: theme.colors.surface },
          backdrop: { backgroundColor: theme.colors.placeholder },
          item: { height: ITEM_HEIGHT },
        }}
      />
    </View>
  );
};

export default CustomMultiSelect;
