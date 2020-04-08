import React, { Suspense } from 'react';

import { MtText, MenuItem } from '../react-client-shared/utils/Message';
import { User } from '../react-client-shared/reducers/userState';

const FormItemsList: React.FC<{
  mtText: MtText;
  dispatch: any;
  token: string;
  tokenAction: any;
  userAction: any;
  user: User;
}> = ({ mtText, dispatch, token, tokenAction, userAction, user }) => {
  return <>Form</>;
};

export default FormItemsList;
