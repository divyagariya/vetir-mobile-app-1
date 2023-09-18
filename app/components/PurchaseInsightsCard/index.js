import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {wp, hp} from '../../utils/normalise';
import {FONTS_SIZES} from '../../fonts';

const PurchaseInsightsCard = props => {
  const {title, icon, navigation} = props;
  return (
    <TouchableOpacity
      style={Styles.cardContainer}
      onPress={() => navigation.goBack()}>
      <Image source={icon} style={Styles.backIcon} />
      <Text style={Styles.headerText}>{title}</Text>
      <Image
        source={require('../../assets/rightArrowDash.png')}
        style={Styles.rightIcon}
      />
    </TouchableOpacity>
  );
};
export default PurchaseInsightsCard;

const Styles = StyleSheet.create({
  cardContainer: {
    marginTop: hp(8),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(40),
  },
  backIcon: {
    backgroundColor: '#F7F7F7',
  },
  headerText: {
    marginLeft: wp(20),
    fontWeight: '400',
    width: '82%',
    fontSize: FONTS_SIZES.s4,
  },
});
