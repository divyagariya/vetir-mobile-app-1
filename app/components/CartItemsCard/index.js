import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {wp, hp, spV, spH} from '../../utils/normalise';
import {FONTS_SIZES} from '../../fonts';
import {Colors} from '../../colors';

const CartItemsCard = props => {
  const {count} = props;

  return (
    <View style={Styles.cardContainer}>
      <Text
        style={{
          width: '40%',
          fontSize: FONTS_SIZES.s4,
          fontWeight: '700',
        }}>{`${count} item in cart`}</Text>
      <TouchableOpacity
        style={{
          width: spH(135),
          height: spV(37),
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.black,
        }}
        text="Apply"
        onPress={() => {}}>
        <Text style={{color: Colors.white, fontWeight: '700'}}>
          {'Checkout'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          style={Styles.crossicon}
          source={require('../../assets/cross.webp')}
        />
      </TouchableOpacity>
    </View>
  );
};
export default CartItemsCard;

const Styles = StyleSheet.create({
  cardContainer: {
    width: '90%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    height: spV(56),
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  crossicon: {
    width: 24,
    height: 24,
  },
});
