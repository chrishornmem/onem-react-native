import React from 'react';
import { useTheme, Portal, FAB } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { useIsFocused, RouteProp } from '@react-navigation/native';
import { StackNavigatorParamlist } from './types';

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'FeedList'>;
};

export const ChatWindow = (props: Props) => {

  const theme = useTheme();
  const safeArea = useSafeArea();
  const isFocused = useIsFocused();
  const [isOpen, setOpen] = React.useState(false);


  let iconClosed = 'dots-vertical';
  let iconOpen = 'dots-horizontal';

  return (
    <React.Fragment>
      <Portal>
        <FAB.Group
          open={isOpen}
          actions={[
            {
              icon: 'star',
              label: 'Add',
              onPress: () => console.log('Pressed add'),
            },
            {
              icon: 'star',
              label: 'Star',
              onPress: () => console.log('Pressed star'),
            },
            {
              icon: 'email',
              label: 'Email',
              onPress: () => console.log('Pressed email'),
            },
            {
              icon: 'bell',
              label: 'Remind',
              onPress: () => console.log('Pressed notifications'),
            },
          ]}
          onStateChange={({ open }) => setOpen(open)}
          visible={isFocused}
          icon={isOpen ? iconOpen : iconClosed}
          style={{
            position: 'absolute',
            bottom: safeArea.bottom + 20,
            right: 20,
          }}
          color="#e0e0e0"
        //   theme={{
        //     colors: {
        //       accent: 'white',
        //     },
        //   }}
          onPress={() => {}}
        />
      </Portal>
    </React.Fragment>
  );
};
