import { logger } from '../react-client-shared/utils/Log';

import React, { Suspense } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { HelperText, Paragraph, TextInput } from 'react-native-paper';
import DateSelect from './DateSelect';
import { FormItem } from '../react-client-shared/utils';

const SwitchType: React.FC<{
  item: FormItem;
  tabIndex: number;
  props: any;
  isFocussed?: any;
}> = ({ item, tabIndex, props, isFocussed }) => {
  function makeSelectOptions(body: any) {
    let options: any = [];
    let contentItems: any = [];
    body.forEach(
      (option: { type: string; description: string; value: any }) => {
        if (option.type === 'option') {
          options.push({ label: option.description, value: option.value });
        } else {
          contentItems.push(option.description);
        }
      }
    );
    return [options, contentItems];
  }

  // let inputEl :any = null;
  // let inputEl = React.useRef(React.createElement('div'));

  // React.useEffect(() => {
  //     if (inputEl && inputEl.current) {
  //         logger.info("inputEl:")
  //         logger.info(inputEl.current);
  //         inputEl.current.getElementsByTagName('input')[0].onfocus = function() {
  //             inputEl.current.getElementsByTagName('input')[0].blur();
  //         }
  //     }
  //   },[inputEl]);

  let type: string;
  let multiline = false;

  switch (item.type) {
    case 'date':
    case 'time':
      return <DateSelect formikProps={props} item={item} />;

    // case 'form-menu': {
    //   const [options, contentItems] = makeSelectOptions(item.body);

    //   // logger.info("options")
    //   // logger.info(options)
    //   // logger.info("label")
    //   // logger.info(label)

    //   logger.info('props');
    //   logger.info(props);

    //   if (item.meta.multi_select !== 1) {
    //     return (
    //       <>
    //         {contentItems.map((item: any, i: number) => (
    //           <Typography key={i} style={labelStyle}>
    //             {' '}
    //             {item}{' '}
    //           </Typography>
    //         ))}
    //         <Field
    //           innerRef={Ref}
    //           name={item.name}
    //           // label={label}
    //           // options={options}
    //           autoWidth
    //           as={Select}
    //           size="small"
    //         >
    //           {/* <Select
    //                     multiple={item.meta.multi_select === 1}
    //                     value={props.values[item.name]}
    //                     inputProps={{ tabIndex }}
    //                     onChange={(e) => {props.setFieldValue(item.name, e.target.value)}}
    //                     input={<Input />}
    //                     > */}
    //           {options.map((name: any) => (
    //             <MenuItem dense key={name.label} value={name.value}>
    //               {name.label}
    //             </MenuItem>
    //           ))}
    //           {/* </Select> */}
    //         </Field>
    //       </>
    //     );
    //   } else {
    //     return (
    //       <>
    //         {contentItems.map((item: any, i: number) => (
    //           <Typography key={i} style={labelStyle}>
    //             {' '}
    //             {item}{' '}
    //           </Typography>
    //         ))}
    //         <MultiSelect
    //           name={item.name}
    //           options={options}
    //           tabIndex={tabIndex}
    //           formikProps={props}
    //         />
    //       </>
    //     );
    //   }
    // }

    // case 'hidden':
    //   return null;

    // case 'range':
    //   logger.info('range:' + item.default);

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
    case 'tel':
    case 'string':
    case 'text':
    case 'textarea':
    case 'url':
    case 'email':
    default:
      if (item.type === 'int' || item.type === 'float') {
        type = 'number';
      } else if (item.type === 'string') {
        type = 'text';
      } else if (item.type === 'textarea') {
        type = 'text';
        multiline = true;
      } else {
        type = item.type;
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
          />
          <HelperText type="error" visible={props.errors[item.name] !== ''}>
            {props.errors[item.name]}
          </HelperText>
        </>
      );
  }
};

export default SwitchType;
