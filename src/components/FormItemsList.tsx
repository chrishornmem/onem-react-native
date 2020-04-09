import React, { Suspense } from 'react';
import { StyleSheet } from 'react-native';

import { Paragraph, Card } from 'react-native-paper';

import { MtText, MenuItem } from '../react-client-shared/utils/Message';
import { User } from '../react-client-shared/reducers/userState';

import { Header } from './Header';
import { Footer } from './Footer';

const FormItemsList: React.FC<{
  mtText: MtText;
  dispatch: any;
  token: string;
  tokenAction: any;
  userAction: any;
  user: User;
}> = ({ mtText, dispatch, token, tokenAction, userAction, user }) => {
  return (
    <>
      <Header
        title={mtText.header}
        leftHidden={mtText.__is_root}
        dispatch={dispatch}
      />
      <Card style={styles.cardWrapper}>
        <Card.Content style={styles.container}>
          <Paragraph>Form</Paragraph>
        </Card.Content>
      </Card>
      <Footer />
    </>
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
