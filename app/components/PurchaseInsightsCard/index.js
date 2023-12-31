import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {wp, hp} from '../../utils/normalise';
import {FONTS_SIZES} from '../../fonts';

const PurchaseInsightsCard = props => {
  const {title, icon, onPress} = props;
  return (
    <TouchableOpacity style={Styles.cardContainer} onPress={onPress}>
      <Image source={icon} style={Styles.backIcon} />
      <Text style={Styles.headerText}>{title}</Text>
      <Image
        source={require('../../assets/rightArrowDash.png')}
        style={Styles.icon}
      />
    </TouchableOpacity>
  );
};
export default PurchaseInsightsCard;

const Styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(8),
  },
  backIcon: {
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    height: 36,
    width: 36,
  },
  headerText: {
    marginLeft: wp(16),
    fontWeight: '400',
    width: '82%',
    fontSize: FONTS_SIZES.s4,
  },
});
