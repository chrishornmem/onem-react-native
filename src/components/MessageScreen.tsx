import React, { Suspense } from 'react';

import { Message, isForm, MtText } from '../react-client-shared/utils/Message';
import { User } from '../react-client-shared/reducers/userState';
import { MessageContext } from '../react-client-shared/reducers/messageState';
import MenuItemsList from './MenuItemsList';
import FormItemsList from './FormItemsList';

export const MessageScreen: React.FC<{
  token: string;
  tokenAction: any;
}> = ({ token, tokenAction }) => {

  const { messageState, messageAction, isRequesting } = React.useContext(
    MessageContext
  );

  const { message } = messageState;

  return (
    <>
      {isForm(message) ? (
        <FormItemsList token={token} tokenAction={tokenAction} />
      ) : (
        <MenuItemsList token={token} tokenAction={tokenAction} />
      )}
    </>
  );
};
