import React, { Suspense } from 'react';

import { Message, isForm, MtText } from '../react-client-shared/utils/Message';
import { User } from '../react-client-shared/reducers/userState';

export const MessageScreen: React.FC<{
  message: Message;
  messageAction: any;
  token: string;
  tokenAction: any;
  user: User;
  userAction: any;
}> = ({ message, messageAction, token, tokenAction, user, userAction }) => {
  const MenuItemsList = React.lazy(() => import('./MenuItemsList'));
  const FormItemsList = React.lazy(() => import('./FormItemsList'));
  return (
    <Suspense fallback={<></>}>
      {isForm(message) ? (
        <FormItemsList
          dispatch={messageAction}
          mtText={message.mtText}
          token={token}
          tokenAction={tokenAction}
          userAction={userAction}
          user={user}
        />
      ) : (
        <MenuItemsList
          mtText={message.mtText as MtText}
          dispatch={messageAction}
          token={token}
          tokenAction={tokenAction}
          userAction={userAction}
          user={user}
        />
      )}
    </Suspense>
  );
};
