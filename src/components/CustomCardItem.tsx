import React from 'react';
import { View } from 'react-native';

import { Media } from './Media';
import { CustomAvatar } from './CustomAvatar';

import {
  Avatar,
  Button,
  Card,
  Paragraph,
  Subheading,
  Title,
} from 'react-native-paper';

export const CustomCardItem = (props: {
  item: CardItem;
  onCardSelected?: any;
  onCardActionSelected?: any;
  disabled?: boolean;
}) => {
  const {
    item,
    disabled = false,
    onCardSelected = null,
    onCardActionSelected = null,
  } = props;

  const LeftContent = props => (
    <CustomAvatar
      size={40}
      source={item?.header?.avatar.src}
      name={item?.header?.avatar.name}
      {...props}
    />
  );

  return (
    <View style={{ padding: 5, flex: 1, alignItems: 'center' }}>
      <Card
        onPress={
          typeof onCardSelected === 'function' && !disabled
            ? onCardSelected
            : undefined
        }
        style={{ maxWidth: 470, width: '100%' }}
      >
        {item?.header && (
          <Card.Title
            style={{ padding: 10 }}
            title={item?.header?.title}
            subtitle={item?.header?.subtitle}
            left={item?.header?.avatar ? LeftContent : false}
          />
        )}
        {item.src && <Media src={item.src} />}
        <Card.Content>
          {item.title && <Title>{item.title}</Title>}
          {item.subtitle && <Subheading>{item.subtitle}</Subheading>}
          {item.description && <Paragraph>{item.description}</Paragraph>}
        </Card.Content>
        <Card.Actions style={{ flexWrap: 'wrap' }}>
          {item?.actions?.map((action, i) => {
            return (
              <Button
                onPress={() => {
                  if (typeof onCardActionSelected === 'function') {
                    onCardActionSelected(i);
                  }
                }}
                key={i}
              >
                {action.name}
              </Button>
            );
          })}
        </Card.Actions>
      </Card>
    </View>
  );
};
