import React from 'react';
import { Snackbar } from 'react-native-paper';
import { getError } from '../react-client-shared/utils/Message'

export const Error: React.FC<{ message: any | string }> = ({ message }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar onDismiss={handleClose} visible={open}>
      {getError(message).error_text}
    </Snackbar>
  );
};
