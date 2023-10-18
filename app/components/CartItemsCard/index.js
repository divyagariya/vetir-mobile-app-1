import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { wp, hp, spV, spH } from '../../utils/normalise';
import { FONTS_SIZES } from '../../fonts';
import { Colors } from '../../colors';
import { useDispatch } from 'react-redux';
import { resetCart } from '../../redux/actions/cartAction';


const CartItemsCard = props => {
  const { count } = props;
  const dispatch = useDispatch()
  if (count <= 0) {
    return null
  }

  return (
    <View style={Styles.cardContainer}>
      <Text
        style={{
          width: '40%',
          fontSize: FONTS_SIZES.s4,
          fontWeight: '700',
        }}>{`${count} items in cart`}</Text>
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
        onPress={() => {
          props.navigation.navigate('Checkout', {
            cartData: props.cartData
          });
        }}>
        <Text style={{ color: Colors.white, fontWeight: '700' }}>
          {'Checkout'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        dispatch(resetCart())
      }}>
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
