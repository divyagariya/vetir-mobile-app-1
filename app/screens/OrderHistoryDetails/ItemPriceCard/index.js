import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../colors';
import {FONTS_SIZES} from '../../../fonts';

const ItemPriceCard = props => {
  const {heading, value, isGreen, marginTop} = props || '';

  return (
    <View
      style={[
        Styles.cardContainer,
        {marginTop: marginTop ? marginTop : undefined},
      ]}>
      <Text style={Styles.headingText}>{heading}</Text>
      <Text
        style={[Styles.valueText, {color: isGreen ? Colors.green : undefined}]}>
        {value}
      </Text>
    </View>
  );
};
export default ItemPriceCard;

const Styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
  },
  headingText: {
    fontWeight: '400',
    fontSize: FONTS_SIZES.s4,
  },
  valueText: {
    fontWeight: '400',
    fontSize: FONTS_SIZES.s4,
  },
});
