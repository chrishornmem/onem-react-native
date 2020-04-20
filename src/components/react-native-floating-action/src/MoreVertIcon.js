import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { IconButton } from 'react-native-paper';

class MoreVertIcon extends PureComponent {
  render() {
    const { size=28, color } = this.props;

    return (
      <IconButton
        icon="dots-vertical"
        color={color}
        size={size}
      />
    );
  }
}

MoreVertIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string
};

export default MoreVertIcon;
