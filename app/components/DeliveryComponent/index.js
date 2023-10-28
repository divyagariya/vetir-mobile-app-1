import React, {useCallback, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../colors';
import {hp, spH, spV, wp} from '../../utils/normalise';
import {FONTS_SIZES} from '../../fonts';

const DeliveryComponent = props => {
  const {onPressCross, onClickProceed} = props;
  const [deliveryType, setDeliveryType] = useState('standard');

  const onPressProceed = useCallback(() => {
    onClickProceed(deliveryType);
  }, [deliveryType, onClickProceed]);

  const onPressSelectBtn = type => {
    if (type === 'standard') {
      setDeliveryType('standard');
    } else {
      setDeliveryType('express');
    }
  };

  return (
    <View style={Styles.container}>
      <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}} />
      <View style={Styles.headerView}>
        <Text>SELECT DELIVERY TYPE</Text>
        <TouchableOpacity onPress={onPressCross}>
          <Image
            style={Styles.crossIcon}
            source={require('../../assets/crossIcon.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={Styles.deliveryContainer}>
        <View style={Styles.deliveryView}>
          <View style={[Styles.rowView, {marginTop: spV(15)}]}>
            <Text style={Styles.deliveryText}>Standard Delivery</Text>
            <TouchableOpacity onPress={() => onPressSelectBtn('standard')}>
              <Image
                style={Styles.filledIcon}
                source={
                  deliveryType === 'standard'
                    ? require('../../assets/filled.webp')
                    : require('../../assets/unfilled.webp')
                }
              />
            </TouchableOpacity>
          </View>
          <View style={Styles.rowView}>
            <View style={Styles.roundView} />
            <Text style={Styles.greyText}>3-5 Days to Ship</Text>
          </View>
          <View style={Styles.rowView}>
            <View style={Styles.roundView} />
            <Text style={Styles.greyText}>Standard Delivery Charges</Text>
          </View>
        </View>

        <View style={Styles.deliveryView}>
          <View style={[Styles.rowView, {marginTop: spV(15)}]}>
            <Text style={Styles.deliveryText}>Express Delivery</Text>
            <TouchableOpacity onPress={() => onPressSelectBtn('express')}>
              <Image
                style={Styles.filledIcon}
                source={
                  deliveryType === 'express'
                    ? require('../../assets/filled.webp')
                    : require('../../assets/unfilled.webp')
                }
              />
            </TouchableOpacity>
          </View>
          <View style={Styles.rowView}>
            <View style={Styles.roundView} />
            <Text style={Styles.greyText}>1-2 Days to Ship</Text>
          </View>
          <View style={Styles.rowView}>
            <View style={Styles.roundView} />
            <Text style={Styles.greyText}>$10 Extra Delivery Charges</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={onPressProceed} style={Styles.btn}>
        <Text style={Styles.btnText}>{'Proceed'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeliveryComponent;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
  },
  headerView: {
    height: spV(45),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: Colors.greyBorder,
    borderBottomWidth: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  roundView: {
    height: spH(8),
    width: spH(8),
    borderRadius: spH(4),
    backgroundColor: Colors.grey2,
  },
  deliveryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 10,
  },
  deliveryView: {
    width: '48%',
    height: spV(120),
    paddingLeft: spH(15),
    borderRadius: 7,
    alignItems: 'flex-start',
    borderColor: Colors.greyBorder,
    borderWidth: 1,
  },
  greyText: {
    fontWeight: '400',
    fontSize: 13,
    width: '67%',
    marginLeft: spH(10),
    color: Colors.black60,
  },
  deliveryText: {
    fontSize: FONTS_SIZES.s13,
    fontWeight: '700',
    color: Colors.black,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spV(10),
    justifyContent: 'space-between',
  },
  addressText: {
    fontWeight: '400',
    fontSize: 15,
    color: Colors.black60,
  },
  filledIcon: {
    height: 20,
    width: 20,
    marginLeft: spH(5),
  },
  changeBtn: {
    width: wp(65),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(25),
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.black60,
  },
  crossIcon: {
    height: 15,
    width: 15,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: spV(50),
    marginLeft: spH(16),
    width: '92%',
    marginTop: spV(30),
    marginBottom: spV(15),
    borderRadius: 10,
    backgroundColor: Colors.black,
  },
  btnText: {
    fontSize: FONTS_SIZES.s14,
    fontWeight: '700',
    color: Colors.white,
  },
});
