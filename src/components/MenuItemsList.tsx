import React, { Suspense } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { MtText, MenuItem } from '../react-client-shared/utils/Message';
import { User } from '../react-client-shared/reducers/userState';

const MenuItemsList: React.FC<{
  mtText: MtText;
  dispatch: any;
  token: string;
  tokenAction: any;
  userAction: any;
  user: User;
}> = ({ mtText, dispatch, token, tokenAction, userAction, user }) => {
  return <View><Text>Menu</Text></View>;
};

export default MenuItemsList;
