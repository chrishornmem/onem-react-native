import { logger } from '../react-client-shared/utils/Log';

import React, { Suspense } from 'react';
import { Platform, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { HelperText, Paragraph, TextInput } from 'react-native-paper';
import DateSelect from './DateSelect';
import SingleSelect from './SingleSelect';

import {
  FormItem,
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
  function handleSelect(value: string, index: number) {
    console.log('onChangeText');
    console.log(value);
    console.log(index);
    props.setFieldValue(item.name, options[index].actualValue);
    props.setFieldTouched(item.name, true);
  }

  const [selected, setSelected] = React.useState(props.values[item.name]);

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
      // if (item.meta.multi_select !== 1) {
        return (
          <>
            {/* {contentItems.map((item: any, i: number) => (
              <Paragraph key={i}> {item} </Paragraph>
            ))} */}
            <SingleSelect formikProps={props} item={item} />
          </>
        );
      // } else {
      //   return (
      //     <>
      //       <Dropdown
      //         label={contentItems.join('\n')}
      //         value={item.default || undefined}
      //         data={options}
      //         onChangeText={(value: string, index: number) => {
      //           // console.log('onChangeText');
      //           // console.log(item.name);
      //           // console.log(value);
      //           // console.log(index);
      //           // console.log(options[index].actualValue);
      //           props.setFieldValue(item.name, options[index].actualValue);
      //           props.setFieldTouched(item.name, true);
      //         }}
      //       />
      //     </>
      //   );
      // }
    }

    case 'hidden':
      return null;

    // case 'range':
    //   console.log('range:' + item.default);

    //   return (
    //     <>
    //       <Typography style={labelStyle}>
    //         {item.description ? item.description.replace('\n', '\n\n') : ''}
    //       </Typography>
    //       <Field
    //         innerRef={handleRef}
    //         name={item.name}
    //         step={item.step}
    //         min={item.min_value}
    //         max={item.max_value}
    //         // label={label}
    //         // options={options}
    //         component={SliderField}
    //         valueLabelDisplay="auto"
    //         defaultValue={item.default}
    //       ></Field>
    //     </>
    //   );
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
  console.log('item.type:' + item.type);
  console.log('type:' + type);
  console.log(JSON.stringify(isOfTypeKeyboardTypeOptions(type)));
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
      />
      <HelperText type="error" visible={props.errors[item.name] !== ''}>
        {props.errors[item.name]}
      </HelperText>
    </>
  );
};

export default SwitchType;
