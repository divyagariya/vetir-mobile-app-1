import React from 'react';
import {View} from 'react-native';

const VView = props => {
  return <View {...props}>{props.children}</View>;
};

export default VView;
