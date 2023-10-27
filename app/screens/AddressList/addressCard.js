import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {wp, hp, normalize, spV, spH} from '../../utils/normalise';
import {FONTS_SIZES} from '../../fonts';
import {Colors} from '../../colors';

const AddressCard = props => {
  const {name, address, onPressEditBtn, isSelected, onPressSelectBtn} = props;
  return (
    <View style={Styles.cardContainer}>
      <View style={Styles.nameAddContainer}>
        <Text style={Styles.nameText}>{name}</Text>
        <Text style={Styles.addText}>{address}</Text>
        <TouchableOpacity onPress={onPressEditBtn} style={Styles.editBtn}>
          <Text>Edit</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onPressSelectBtn}>
        <Image
          style={Styles.filledIcon}
          source={
            isSelected
              ? require('../../assets/filled.webp')
              : require('../../assets/unfilled.webp')
          }
        />
      </TouchableOpacity>
    </View>
  );
};
export default AddressCard;

const Styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 2,
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    height: spV(100),
    flexDirection: 'row',
  },
  editBtn: {
    width: wp(65),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(30),
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.black60,
  },
  nameAddContainer: {
    width: '90%',
  },
  filledIcon: {
    height: 30,
    width: 30,
  },
  nameText: {
    fontWeight: '700',
    fontSize: 17,
  },
  addText: {
    marginTop: spV(5),
    marginBottom: spV(8),
    fontWeight: '400',
    color: Colors.grey66,
    fontSize: FONTS_SIZES.s14,
  },
});
