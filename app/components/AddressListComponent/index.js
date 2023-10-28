import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {getAddressList} from '../../redux/actions/cartAction';
import AddressCard from '../../screens/AddressList/addressCard';
import {Colors} from '../../colors';
import {hp, spH, spV, wp} from '../../utils/normalise';
import {FONTS_SIZES} from '../../fonts';

const AddressListComponent = props => {
  const {route, navigation, onPressCross, onPressUseThisAddress} = props;
  const dispatch = useDispatch();
  const getAddressResponse = useSelector(
    state => state.CartReducer.getAddressResponse,
  );
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getAddressList());
      //   if (refreshAddress) {
      //     SimpleToast.show('Address Added Successfully');
      //   }
    }, [dispatch]),
  );

  useEffect(() => {
    if (Object.keys(getAddressResponse).length) {
      addressList.forEach(item => {
        if (item.isSelected) {
          setSelectedAddress(item);
        }
      });
    }
  }, [addressList, getAddressResponse]);

  useEffect(() => {
    if (Object.keys(getAddressResponse).length) {
      setAddressList(getAddressResponse);
      dispatch({type: 'GET_ADDRESS', value: {}});
    }
  }, [getAddressResponse, dispatch]);

  const onPressAddAddress = address => {
    // onPressUseThisAddress(address);
  };

  const onPressProceed = () => {
    navigation.navigate('AddAddress');
  };

  const onPressEditBtn = useMemo(
    () => item => {
      onPressCross();
      navigation.navigate('AddAddress', {
        addressData: item,
      });
    },
    [navigation, onPressCross],
  );

  const onPressSelectBtn = useMemo(
    () => add => {
      setSelectedAddress(add);
      const updatedList = addressList.map(item => ({
        ...item,
        isSelected: item.id === add.id,
      }));
      setAddressList(updatedList);
    },
    [addressList, setAddressList],
  );

  const onPressUseAddress = selectedAddress => {
    onPressUseThisAddress(selectedAddress);
  };

  const onPressSameBillingBtn = () => {};

  const renderItem = useMemo(
    () => data => {
      const {item} = data;
      const add = `${item.addressLine1} ${item.addressLine2}, ${item.city} ${item.state} ${item.pincode}`;
      return (
        <AddressCard
          onPressEditBtn={() => onPressEditBtn(item)}
          name={item?.name}
          address={add}
          onPressSelectBtn={() => onPressSelectBtn(item)}
          isSelected={item.isSelected}
        />
      );
    },
    [onPressEditBtn, onPressSelectBtn],
  );

  const returnAddressViews = () => {
    if (addressList.length > 0) {
      return (
        <View style={{flex: 0.7, backgroundColor: Colors.white}}>
          <FlatList
            bounces={false}
            contentContainerStyle={{paddingBottom: 20}}
            extraData={item => item.isSelected}
            showsVerticalScrollIndicator={false}
            data={addressList}
            renderItem={renderItem}
            keyExtractor={item => item?.id.toString()}
          />
        </View>
      );
    } else {
      <View style={Styles.parentContainer}>
        <Image
          style={Styles.searchWebIcon}
          source={require('../../assets/searchWeb.webp')}
        />
        <View style={Styles.emptyTextContainer}>
          <Text style={Styles.emptyText}>{'No addresses added yet.'}</Text>
          <Text style={Styles.emptyText}>{'Add new address to proceed.'}</Text>
          <TouchableOpacity onPress={onPressAddAddress} style={Styles.btn}>
            <Text style={Styles.btnText}>{'Add Address'}</Text>
          </TouchableOpacity>
        </View>
      </View>;
    }
  };

  //   const returnBillingView = ()=>{
  //     if(is)
  //   }

  return (
    <View style={Styles.container}>
      <View style={{flex: 0.6, backgroundColor: 'rgba(0, 0, 0, 0.5)'}} />
      <View style={Styles.headerView}>
        <Text>CHANGE DELIVERY ADDRESS</Text>
        <TouchableOpacity onPress={onPressCross}>
          <Image
            style={Styles.crossIcon}
            source={require('../../assets/crossIcon.png')}
          />
        </TouchableOpacity>
      </View>
      {returnAddressViews()}
      {addressList.length > 0 && (
        <View style={Styles.bottomView}>
          <TouchableOpacity onPress={onPressAddAddress} style={Styles.whiteBtn}>
            <Text style={[Styles.btnText, {color: Colors.black}]}>
              {'Add New Address'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPressUseAddress(selectedAddress)}
            style={Styles.btn}>
            <Text style={Styles.btnText}>{'Use this Address'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AddressListComponent;

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
  parentContainer: {
    alignItems: 'center',
  },
  searchWebIcon: {
    height: 120,
    width: 120,
    marginTop: spV(60),
  },
  emptyTextContainer: {
    alignItems: 'center',
    marginTop: spV(15),
  },
  emptyText: {
    fontWeight: '400',
    fontSize: 15,
    color: '#333333',
    marginTop: spV(5),
  },
  whiteBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: spH(160),
    height: spV(40),
    marginTop: spV(20),
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.black60,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: spH(160),
    height: spV(40),
    marginTop: spV(20),
    borderRadius: 10,
    backgroundColor: Colors.black,
  },
  btnText: {
    fontSize: FONTS_SIZES.s14,
    fontWeight: '700',
    color: Colors.white,
  },
  bottomView: {
    height: spV(50),
    width: '100%',
    // position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: spV(20),
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: Colors.black30, // Shadow color
    shadowOffset: {
      width: 0,
      height: -5, // A negative value for the height creates a top shadow
    },
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 5,
    // shadowColor: '#000000',
  },
  billingView: {
    marginTop: spV(20),
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  billingTextView: {
    width: '75%',
  },
  billingText: {
    fontWeight: '400',
    fontSize: 15,
    color: Colors.black60,
    width: '55%',
  },
  addressText: {
    fontWeight: '400',
    fontSize: 15,
    color: Colors.black60,
  },
  selectBtn: {
    width: wp(95),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(25),
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.black60,
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
});
