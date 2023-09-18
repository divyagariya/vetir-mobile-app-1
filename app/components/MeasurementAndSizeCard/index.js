import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {wp, hp} from '../../utils/normalise';
import {FONTS_SIZES} from '../../fonts';
import {Colors} from '../../colors';

const MeasurementAndSizeCard = props => {
  const {title, count, showBorder, isColorComp, colorCode} = props;

  const renderColorBlock = () => {
    return title === 'multi' ? (
      <Image
        source={require('../../assets/multi.png')}
        style={Styles.multiIcon}
      />
    ) : (
      <View style={[Styles.colorBlock, {backgroundColor: colorCode}]} />
    );
  };

  return (
    <View
      style={[Styles.cardContainer, {borderBottomWidth: showBorder ? 1 : 0}]}>
      <View style={Styles.titleAndColorContainer}>
        {isColorComp ? renderColorBlock() : null}
        <Text style={Styles.titleText}>{title}</Text>
      </View>
      <Text style={Styles.countText}>{count}</Text>
    </View>
  );
};
export default MeasurementAndSizeCard;

const Styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: hp(40),
    borderBottomWidth: 1,
    borderColor: Colors.greyBorder,
  },
  titleAndColorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorBlock: {
    width: 24,
    height: 24,
    borderWidth: 1,
    marginRight: wp(8),
    borderColor: Colors.greyBorder,
  },
  titleText: {
    fontWeight: '400',
    fontSize: FONTS_SIZES.s4,
  },
  countText: {
    fontWeight: '400',
    fontSize: FONTS_SIZES.s4,
    color: Colors.greyText,
  },
  multiIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});
