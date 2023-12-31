import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {wp, hp} from '../../utils/normalise';
import {FONTS_SIZES} from '../../fonts';
import {Colors} from '../../colors';

const OrderHistoryCard = props => {
  const {
    itemName,
    orderId,
    imageLink,
    orderDate,
    itemPrice,
    status,
    onPress,
    isOrderhistoryDetails,
    quantity,
  } = props || '';

  return isOrderhistoryDetails ? (
    <View style={Styles.cardContainer}>
      <Image source={imageLink} />
      <View
        style={[
          Styles.orderIdContainer,
          {justifyContent: 'flex-start', width: '70%'},
        ]}>
        <Text style={Styles.nameText}>{itemName}</Text>
        <Text
          style={[
            Styles.orderText,
            {marginTop: hp(6)},
          ]}>{`QTY: ${quantity}`}</Text>
      </View>
      <Text style={[Styles.nameText, {alignSelf: 'flex-start'}]}>
        {itemPrice}
      </Text>
    </View>
  ) : (
    <TouchableOpacity onPress={onPress} style={Styles.cardContainer}>
      <Image source={imageLink} />
      <View style={Styles.orderIdContainer}>
        <Text style={Styles.orderText}>{`ORDER ID: ${orderId}`}</Text>
        <Text style={Styles.nameText}>{itemName}</Text>
        <Text style={Styles.dateText}>{orderDate}</Text>
      </View>
      <View style={Styles.priceAndStatusContainer}>
        <Text style={[Styles.nameText, {textAlign: 'right'}]}>{itemPrice}</Text>
        <Text style={Styles.statusText}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default OrderHistoryCard;

const Styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    height: hp(75),
    marginTop: hp(5),
    backgroundColor: Colors.white,
  },
  orderIdContainer: {
    justifyContent: 'space-between',
    height: '100%',
    marginLeft: wp(12),
    width: '65%',
    overflow: 'hidden',
  },
  orderText: {
    fontWeight: '400',
    fontSize: FONTS_SIZES.s5,
    color: Colors.greyText,
  },
  nameText: {
    fontWeight: '400',
    fontSize: FONTS_SIZES.s4,
  },
  dateText: {
    fontWeight: '400',
    fontSize: FONTS_SIZES.s4,
    color: Colors.greyText,
  },
  priceAndStatusContainer: {
    width: '18%',
  },
  statusText: {
    color: '#26A411',
    textAlign: 'right',
  },
});
