import React, { Suspense } from 'react';

import { Message, isForm, MtText } from '../react-client-shared/utils/Message';
import { User } from '../react-client-shared/reducers/userState';

export const MessageScreen: React.FC<{
  message: Message;
  messageAction: any;
  token: string;
  tokenAction: any;
}> = ({ message, messageAction, token, tokenAction }) => {
  const MenuItemsList = React.lazy(() => import('./MenuItemsList'));
  const FormItemsList = React.lazy(() => import('./FormItemsList'));
  return (
    <Suspense fallback={<></>}>
      {isForm(message) ? (
        <FormItemsList
          dispatch={messageAction}
          mtText={message.mtText as MtText}
          token={token}
          tokenAction={tokenAction}
        />
      ) : (
        <MenuItemsList
          mtText={message.mtText as MtText}
          dispatch={messageAction}
          token={token}
          tokenAction={tokenAction}
        />
      )}
    </Suspense>
  );
};
