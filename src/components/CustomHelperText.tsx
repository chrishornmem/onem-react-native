import { logger } from '../react-client-shared/utils/Log';

import React from 'react';
//import color from 'color';

import { StyleSheet, Text, View } from 'react-native';

// const CharCounter = ({ ...props }) => {
//   const { error = false, current = 0, maxLength = 0 } = props;

//   const useStyles = makeStyles(theme => ({
//     root: {
//       marginRight: 0,
//       marginTop:
//         theme.props?.MuiFormControl?.margin === 'dense'
//           ? error
//             ? -18
//             : 4
//           : error
//           ? -18
//           : 4,
//       textAlign: 'right',
//     },
//   }));
//   const classes = useStyles();

//   const counterText =
//     maxLength == null || maxLength === undefined
//       ? String(current)
//       : current + '/' + maxLength;

//   return (
//     <FormHelperText className={classes.root} {...props}>
//       {counterText}
//     </FormHelperText>
//   );
// };

const CustomHelperText = ({ ...props }) => {
  const {
    charCounter = true,
    helperText,
    maxLength,
    minLength,
    style,
    theme,
    type,
    visible = true,
  } = props;

  const { colors, dark } = theme;

  const textColor =
    type === 'error'
      ? 'red'
      : 'initial';

  return (
    <>
      {visible && (
        <View style={[styles.container, styles.text, style]}>
          <Text style={{ color: textColor }}>{helperText}</Text>
          {charCounter && (minLength || maxLength) && (
            <Text style={{ color: textColor }}>
              {helperText.length + '/' + maxLength}
            </Text>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    paddingVertical: 4,
  },
  container: {
    paddingHorizontal: 12,
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
  },
  justifyContent: helperText ? 'space-between' : 'flex-end',
});

export default CustomHelperText;
