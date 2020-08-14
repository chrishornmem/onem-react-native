import React, { Suspense } from 'react';

import { Message, isForm, MtText } from '../react-client-shared/utils/Message';
import { User } from '../react-client-shared/reducers/userState';
import { MessageContext } from '../react-client-shared/reducers/messageState';

export const MessageScreen: React.FC<{
  token: string;
  tokenAction: any;
}> = ({ token, tokenAction }) => {
  const MenuItemsList = React.lazy(() => import('./MenuItemsList'));
  const FormItemsList = React.lazy(() => import('./FormItemsList'));

  const { messageState, messageAction, isRequesting } = React.useContext(
    MessageContext
  );

  const { message } = messageState;

  return (
    <Suspense fallback={<></>}>
      {isForm(message) ? (
        <FormItemsList token={token} tokenAction={tokenAction} />
      ) : (
        <MenuItemsList token={token} tokenAction={tokenAction} />
      )}
    </Suspense>
  );
};