import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';

import { Appbar, Button, useTheme } from 'react-native-paper';
import { emitToServer } from '../react-client-shared/utils/Socket';
import { ONEM_ACTION } from '../react-client-shared/types/actions';
import { AppsContext } from '../context/appsContext';

export const Header = (props: {
  dispatch: any;
  title?: string;
  leftVariant?: string;
  rightVariant?: string;
  rightDisabled?: boolean;
  rightHidden?: boolean;
  leftDisabled?: boolean;
  leftHidden?: boolean;
  handleSubmit?: any;
  handleLeftClick?: any;
}) => {
  const theme = useTheme();
  const { getCurrentApp } = React.useContext(AppsContext);

  const {
    title,
    dispatch,
    handleSubmit = null,
    handleLeftClick = null,
    rightDisabled = false,
    leftDisabled = false,
    rightHidden = false,
    leftHidden = false,
  } = props;

  let leftVariant = props.leftVariant
    ? props.leftVariant.toLowerCase()
    : 'back';
  let rightVariant = props.rightVariant
    ? props.rightVariant.toLowerCase()
    : 'home';

    const insets = useSafeArea();

  const backEmitProps = {
    action_type: ONEM_ACTION.SYSTEM_VERB_SELECTED,
    name: 'back',
  };

  const homeEmitProps = {
    action_type: ONEM_ACTION.SERVICE_SWITCH,
    app_id: getCurrentApp().id,
  };

  const handleHome = () => {
    if (homeEmitProps) {
      dispatch({
        type: 'REQUESTING',
      });
      emitToServer(homeEmitProps);
    }
  };

  const handleBack = () => {
    if (backEmitProps) {
      dispatch({
        type: 'REQUESTING',
      });
      emitToServer(backEmitProps);
    }
  };

  return (
    <>
      <Appbar
        theme={{ colors: { primary: theme.colors.surface } }}
        style={{
          justifyContent: 'space-between',
          elevation: 1,
          // marginTop: insets.top,
          // marginLeft: insets.left,
          // marginRight: insets.right,
        }}
      >
        {leftVariant === 'back' && !leftHidden ? (
          <Appbar.Action
            disabled={leftDisabled}
            accessibilityLabel="Back"
            color={theme.colors.text}
            size={36}
            style={{ margin: 0, padding: 0, alignItems: 'flex-start' }}
            icon="chevron-left"
            onPress={() => handleBack()}
          />
        ) : null}
        {leftVariant === 'cancel' && !leftHidden ? (
          <Button
            mode="text"
            color={theme.colors.accent}
            disabled={leftDisabled}
            style={{ margin: 0, padding: 0, alignItems: 'flex-start' }}
            onPress={() => handleBack()}
          >
            Cancel
          </Button>
        ) : null}
        <Appbar.Content title={title} />
        {rightVariant === 'home' && !rightHidden ? (
          <Appbar.Action
            disabled={rightDisabled}
            accessibilityLabel="Home"
            color={theme.colors.text}
            size={24}
            style={{ alignItems: 'flex-end' }}
            icon="home-outline"
            onPress={() => handleHome()}
          />
        ) : null}
        {rightVariant === 'submit' && !rightHidden ? (
          <Button
            mode="contained"
            disabled={rightDisabled}
            style={{ margin: 0, padding: 0, alignItems: 'flex-end' }}
            onPress={() =>
              typeof handleSubmit === 'function' ? handleSubmit() : {}
            }
          >
            Submit
          </Button>
        ) : null}
      </Appbar>
    </>
  );
};
