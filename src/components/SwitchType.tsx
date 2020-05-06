import { logger } from '../react-client-shared/utils/Log';

import React, { Suspense } from 'react';
import { Platform, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { HelperText, Paragraph, TextInput } from 'react-native-paper';
import DateSelect from './DateSelect';
import SingleSelect from './SingleSelect';
import CustomMultiSelect from './CustomMultiSelect';
import CustomRange from './CustomRange';
import CustomPhoneInput from './CustomPhoneInput';

import { FormItem } from '../react-client-shared/utils/Message';

import {
  isOfTypeKeyboardTypeOptions,
  isOfTypeTextContentType,
  isOfTypeAutoCompleteType,
} from '../react-client-shared/utils';

const SwitchType: React.FC<{
  item: FormItem;
  tabIndex: number;
  props: any;
  isFocussed?: any;
}> = ({ item, tabIndex, props, isFocussed }) => {
  // let inputEl :any = null;
  // let inputEl = React.useRef(React.createElement('div'));

  // React.useEffect(() => {
  //     if (inputEl && inputEl.current) {
  //         console.log("inputEl:")
  //         console.log(inputEl.current);
  //         inputEl.current.getElementsByTagName('input')[0].onfocus = function() {
  //             inputEl.current.getElementsByTagName('input')[0].blur();
  //         }
  //     }
  //   },[inputEl]);

  let type: string = 'default';
  let multiline = false;
  switch (item.type) {
    case 'date':
    case 'time':
      return <DateSelect formikProps={props} item={item} />;

    case 'form-menu': {
      if (item.meta.multi_select !== 1) {
        return <SingleSelect formikProps={props} item={item} />;
      } else {
        return <CustomMultiSelect formikProps={props} item={item} />;
      }
    }

    case 'hidden':
      return null;

    case 'range':
      return <CustomRange formikProps={props} item={item} />;

    // case 'phone':
    // case 'mobile':
    //   return (
    //     <>
    //       <Typography style={labelStyle}>
    //         {item.description ? item.description.replace('\n', '\n\n') : ''}
    //       </Typography>
    //       <PhoneField
    //         // innerRef={(el :any) => inputEl = el}
    //         innerRef={handleRef}
    //         type="tel"
    //         hiddenLabel
    //         label=""
    //         margin="dense"
    //         size="small"
    //         as={TextField}
    //         name={item.name}
    //         placeholder={item.header}
    //         helperText={props.errors[item.name] || ''}
    //         formikProps={props}
    //         InputProps={{ tabIndex: tabIndex, classes: { root: classes.root } }}
    //         required={item.required === 1}
    //       />
    //     </>
    //   );

    case 'int':
      type = 'number-pad';
      break;
    case 'phone':
      return <CustomPhoneInput formikProps={props} item={item} />;
    case 'tel':
      type = 'phone-pad';
      break;
    case 'float':
      type = 'decimal-pad';
      break;
    case 'string':
    case 'text':
    case 'textarea':
      if (item.type == 'textarea') {
        multiline = true;
      }
      type = 'default';
      break;
    case 'url':
      type = Platform.OS == 'ios' ? 'url' : 'default';
      break;
    case 'email':
      type = 'email-address';
      break;
    default:
      break;
  }

  // const component = item.type === 'textarea' ? TextareaAutosize : TextField;
  return (
    <>
      {/* <Typography style={labelStyle}>
            {item.description ? item.description.replace('\n', '\n\n') : ''}
          </Typography>
          <Field
            InputProps={{ classes: { root: classes.root } }}
            inputProps={{ tabIndex: tabIndex, type: type }}
            innerRef={handleRef}
            type={type}
            hiddenLabel
            multiline={multiline}
            label=""
            // margin="dense"
            // size={isSmall ? 'small' : 'medium'}
            as={TextField}
            name={item.name}
            placeholder={item.header}
            helperText={props.errors[item.name] || ''}
          /> */}
      <Paragraph>{item.description}</Paragraph>
      <TextInput
        // label={
        //   item.description ? item.description.replace('\n', '\n\n') : ''
        // }
        value={props.values[item.name]}
        onChangeText={props.handleChange(item.name)}
        onBlur={props.handleBlur(item.name)}
        error={props.errors[item.name] !== ''}
        multiline={multiline}
        placeholder={item.header}
        autoCompleteType={
          isOfTypeAutoCompleteType(item.name) ? item.name : undefined
        }
        defaultValue={props.values[item.name]}
        keyboardType={isOfTypeKeyboardTypeOptions(type) ? type : 'default'}
        textContentType={
          isOfTypeTextContentType(item.name) ? item.name : undefined
        }
        maxLength={item.max_length || undefined}
        returnKeyType="done"
      />
      <HelperText type="error" visible={props.errors[item.name] !== ''}>
        {props.errors[item.name]}
      </HelperText>
    </>
  );
};

export default SwitchType;
