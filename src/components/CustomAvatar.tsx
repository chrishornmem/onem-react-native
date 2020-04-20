import * as React from 'react';
import { Avatar, useTheme } from 'react-native-paper';

type CustomAvatarProps = {
  name?: string;
  source?: string;
  // All other props
  [x: string]: any;
};

export const CustomAvatar: React.FC<CustomAvatarProps> = props => {
  const { name, source, ...other } = props;

  const theme = useTheme();

  const makeInitials = (name?: String) => {
    if (name) {
      const words = name.split(' ');
      const firstInitial = words[0].slice(0, 1).toUpperCase();
      let secondInitial = '';
      if (words.length > 1) {
        secondInitial = words[1].slice(0, 1).toUpperCase();
      }
      return firstInitial + secondInitial;
    }
  };

  if (!name && !source) {
    return (
      <Avatar.Icon
        icon="account"
        style={{ backgroundColor: theme.colors.disabled }}
        color="white"
        {...other}
      />
    );
  } else if (name && !source) {
    return (
      <Avatar.Text
        label={makeInitials(name)}
        style={{ backgroundColor: theme.colors.disabled }}
        color="white"
        {...other}
      />
    );
  } else {
    return <Avatar.Image source={{ uri: source }} {...other} />;
  }
};