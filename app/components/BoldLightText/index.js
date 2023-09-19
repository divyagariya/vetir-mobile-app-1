import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {hp, fp} from '../../utils/normalise';
import {FONTS_SIZES} from '../../fonts';

const BoldLightText = props => {
  const {headerText, bodyText} = props;
  return (
    <View style={Styles.textContainer}>
      <Text style={Styles.headerText}>{headerText}</Text>
      <Text style={Styles.bodyText}>{bodyText}</Text>
    </View>
  );
};
export default BoldLightText;

const Styles = StyleSheet.create({
  textContainer: {
    width: '45%',
    alignItems: 'center',
    marginVertical: hp(15),
  },
  headerText: {
    fontSize: FONTS_SIZES.s4,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyText: {
    fontSize: fp(9),
    fontWeight: '300',
    lineHeight: 12,
  },
});
