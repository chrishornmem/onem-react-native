import { logger } from '../react-client-shared/utils/Log';

import React, { Suspense } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Paragraph, Card, TextInput } from 'react-native-paper';

import { Formik, Form } from 'formik';
import { transformAll } from '@overgear/yup-ast';

import { MtText, FormItem } from '../react-client-shared/utils/Message';
import { User } from '../react-client-shared/reducers/userState';
import { toArrayOrNumber } from '../react-client-shared/utils';
import { emitToServer } from '../react-client-shared/utils/Socket';
import { Header } from './Header';
import { Footer } from './Footer';

const SwitchType = React.lazy(() => import('./SwitchType'));

function ItemList({
  mtText,
  dispatch,
  token,
  tokenAction,
}: {
  mtText: MtText | string;
  dispatch: any;
  token: string;
  tokenAction: any;
}) {
  const body = (mtText as MtText).body as FormItem[];

  const handleSubmit = (values: any, props: any) => {
    logger.info('/handleSubmit');
    logger.info(values);
    logger.info('props');
    logger.info(props);

    dispatch({
      type: 'REQUESTING',
    });
    emitToServer({ action_type: 'formSubmit', params: values });
    // resetForm();
  };

  const handleReset = (resetFn: any) => {
    logger.info('/handleReset:');
    resetFn(); // formik reset form
    //  resetForm(); // clear persistent storage
  };

  const buildInitialValues = () => {
    let values: any = {};
    let touchedFields: string[] = [];

    body.forEach((item: FormItem, i: any) => {

      if (item.default !== null) {
        touchedFields.push(item.name);
        if (
          typeof item.default === 'string' &&
          (item.type === 'int' || item.type === 'number')
        ) {
          item.default = parseFloat(item.default as string);
          if (isNaN(item.default)) item.default = '';
        } else if (typeof item.default === 'string' && item.type === 'range') {
          try {
            item.default = toArrayOrNumber(item.default);
            logger.info(item.default);
            logger.info('converted item.default');
            logger.info(item.default);
          } catch (e) {
            item.default = '';
          }
        } else if (typeof item.default === 'number' && isNaN(item.default)) {
          item.default = '';
        }
      }
      values[item.name] = item.default || '';
      // if (item.type === 'date') {
      //     values[item.name] = new Date().toString();
      // }
      if (item.type === 'hidden') {
        values[item.name] = item.value;
      } else if (item.type === 'range') {
        if (values[item.name] === '') {
          touchedFields.push(item.name);
          if (!item.default) {
            values[item.name] = 0;
          } else {
            try {
              values[item.name] =
                typeof item.default === 'number'
                  ? item.default
                  : JSON.parse(item.default as string);
            } catch (e) {
              values[item.name] = 0;
            }
          }
        }
      } else if (item.type === 'date') {
        if (values[item.name] === '') {
          touchedFields.push(item.name);
          values[item.name] = new Date();
        }
      } else if (item.type === 'form-menu' && Array.isArray(item.body)) {
        item.body = item.body || [{ value: '' }];
        if (item.default !== null && item.meta.multi_select === 1) {
          values[item.name] = Array.isArray(item.default)
            ? item.default
            : [item.default];
        } else if (item.default === null && item.meta.multi_select === 1) {
          delete values[item.name];
          if (item.required !== 1) {
            touchedFields.push(item.name);
          }
        } else if (item.default !== null) {
          values[item.name] = item.default;
       // } else {
          // logger.info("item.body:")
          // logger.info(item.body);
          // logger.info("form-menu:" + (item.body.slice(1, 2)[0] as any).value);
       //   values[item.name] = (item.body.slice(1, 2)[0] as any).value;
        }
      }
    });

    logger.info('touchedFields');
    logger.info(touchedFields);

    const disableSubmitButton = touchedFields.length !== body.length;

    return [touchedFields, values, disableSubmitButton];
  };

  const buildValidationSchema = () => {
    let yupArr = [];
    let yupObj: any = {};

    // logger.info("/buildValidationSchema");
    // logger.info(JSON.stringify(body, null, 4));

    body.forEach((item: FormItem, i: any) => {
      yupObj[item.name] = [];

      switch (item.type) {
        case 'int':
        case 'range':
        case 'float':
        case 'number':
          yupObj[item.name].push(['yup.number']);
          yupObj[item.name].push(['yup.typeError', 'must be a valid number']);
          if (item.required) {
            yupObj[item.name].push(['yup.required']);
          }
          if (item.min_value) {
            yupObj[item.name].push([
              'yup.min',
              item.min_value,
              item.min_value_error || 'Minimum value is ' + item.min_value,
            ]);
          }
          if (item.max_value) {
            yupObj[item.name].push([
              'yup.max',
              item.max_value,
              item.max_value_error || 'Maximum value is ' + item.max_value,
            ]);
          }
          break;

        case 'date':
          yupObj[item.name].push(['yup.date']);
          if (item.required) {
            yupObj[item.name].push(['yup.required']);
          }
          break;

        case 'email':
          yupObj[item.name].push(['yup.string']);
          yupObj[item.name].push(['yup.email']);
          if (item.required) {
            yupObj[item.name].push(['yup.required']);
          }
          break;

        case 'url':
          yupObj[item.name].push(['yup.string']);
          yupObj[item.name].push(['yup.url']);
          if (item.required) {
            yupObj[item.name].push(['yup.required']);
          }
          break;

        case 'form-menu':
          let options: any = [];
          item.body.forEach((option: FormItem, i: any) => {
            if (option.type === 'option') {
              options.push(option.value);
            }
          });
          if (item.meta.multi_select === 1) {
            yupObj[item.name].push(['yup.array']);
          } else {
            yupObj[item.name].push(['yup.string'], ['yup.oneOf', options]);
          }
          if (item.required === 1) {
            yupObj[item.name].push(['yup.required']);
          }

          break;

        case 'string':
        case 'hidden':
        default:
          yupObj[item.name].push(['yup.string']);
          if (item.required) {
            yupObj[item.name].push(['yup.required']);
          }
          if (item.min_length) {
            yupObj[item.name].push([
              'yup.min',
              item.min_length,
              item.min_length_error || 'Minimum length is' + item.min_length,
            ]);
          }
          if (item.max_length) {
            yupObj[item.name].push([
              'yup.max',
              item.max_length,
              item.max_length_error || 'Maximum length is' + item.max_length,
            ]);
          }
          break;
      }

      if (!item.required) {
        yupObj[item.name].push(['yup.nullable']);
      }
    });

    yupArr.push([['yup.object'], ['yup.shape', yupObj]]);

    // logger.info("yupArr")
    // logger.info(yupArr)

    return transformAll(yupArr);
  };

  const schema = buildValidationSchema();
  const [touchedFields, values, disableSubmitButton] = buildInitialValues();
  const formHeader =
    typeof mtText === 'object' && mtText.header
      ? mtText.header
      : 'Complete the form';
  const [isFocussed, setIsFocussed] = React.useState(false);

  return (
    <>
      <Formik
        onSubmit={handleSubmit}
        initialValues={values}
        initialTouched={touchedFields}
        // enableReinitialize={true}
        validationSchema={schema}
        initialStatus={disableSubmitButton}
      >
        {props => {
          logger.info('props');
          logger.info(props);
          return (
            <>
              <Header
                title={formHeader}
                dispatch={dispatch}
                leftVariant="cancel"
                handleLeftClick={() => {
                  handleReset(props.resetForm);
                }}
                rightVariant="submit"
                // rightDisabled={Object.keys(props.errors).length !== 0}
                rightDisabled={
                  disableSubmitButton && (!props.dirty || !props.isValid)
                }
                handleSubmit={props.handleSubmit}
              />
              <Card style={[styles.cardWrapper, { paddingBottom: 50 }]}>
                <Card.Content style={styles.container}>
                  <ScrollView>
                    {body.map((item: FormItem, i: any) => {
                      return (
                        <View key={i}>
                          <SwitchType
                            item={item}
                            isFocussed={(val: any) => {
                              setIsFocussed(val);
                            }}
                            tabIndex={i + 1}
                            props={props}
                          />
                          {/* <Paragraph>{item.description}</Paragraph>
                          <TextInput
                            onChangeText={props.handleChange(item.name)}
                            onBlur={props.handleBlur(item.name)}
                            value={props.values[item.name]}
                          /> */}
                        </View>
                      );
                    })}
                  </ScrollView>
                </Card.Content>
              </Card>
              {/* <Button
                  color="primary"
                  style={submitButtonStyle}
                  type="submit"
                  disabled={!props.dirty || !props.isValid}
              >
                  Submit
              </Button> */}
              <Footer
                hidden={isFocussed}
                verbs={
                  typeof mtText === 'object' && mtText.__verbs
                    ? (mtText as MtText).__verbs
                    : []
                }
                messageAction={dispatch}
                token={token}
                tokenAction={tokenAction}
              />
            </>
          );
        }}
      </Formik>
    </>
  );
}

const FormItemsList: React.FC<{
  mtText: MtText;
  dispatch: any;
  token: string;
  tokenAction: any;
}> = ({ mtText, dispatch, token, tokenAction }) => {
  return (
    <ItemList
      dispatch={dispatch}
      mtText={mtText}
      token={token}
      tokenAction={tokenAction}
    />
  );
};

const styles = StyleSheet.create({
  buttonFullWidth: {
    width: '100%',
  },
  item: {
    paddingVertical: 10,
  },
  container: {
    flex: 1,
  },
  cardWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default FormItemsList;
