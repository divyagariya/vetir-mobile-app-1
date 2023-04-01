import React from 'react';
import {Text} from 'react-native';

const VText = props => {
  return <Text {...props}>{props.text}</Text>;
};

export default VText;
