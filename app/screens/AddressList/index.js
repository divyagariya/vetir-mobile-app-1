/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../../colors';
import DashboardHeader from '../../components/DashboardHeader';
import {Styles} from './styles';
import AddressCard from './addressCard';
import {useDispatch, useSelector} from 'react-redux';
import {getAddressList} from '../../redux/actions/cartAction';
import {useFocusEffect} from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import AddressListComponent from '../../components/AddressListComponent';
import {spV} from '../../utils/normalise';
import DeliveryComponent from '../../components/DeliveryComponent';

const AddressList = props => {
  const {route, navigation} = props;
  console.log('route', route);
  const {params = {}} = route;
  const {refreshAddress} = params;
  const dispatch = useDispatch();
  const getAddressResponse = useSelector(
    state => state.CartReducer.getAddressResponse,
  );
  const [addressList, setAddressList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [billingAddress, setBillingAddress] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isBillingAddressFromList, setIsBillingAddressFromList] =
    useState(false);
  const [isBillingAddressSame, setIsBillingAddressSame] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibledelView, setIsVisibleDelview] = useState(false);
  const animatedHeight = useMemo(() => new Animated.Value(0), []);
  const animatedHeightForDelView = useMemo(() => new Animated.Value(0), []);

  useFocusEffect(
    React.useCallback(() => {
      setIsLoading(true);
      dispatch(getAddressList(setIsLoading));
      if (refreshAddress) {
        SimpleToast.show('Address Added Successfully');
      }
    }, [dispatch, refreshAddress]),
  );

  useEffect(() => {
    if (Object.keys(getAddressResponse).length) {
      setAddressList(getAddressResponse);
      setIsLoading(false);
      dispatch({type: 'GET_ADDRESS', value: {}});
    }
  }, [getAddressResponse, dispatch]);

  useEffect(() => {
    if (Object.keys(getAddressResponse).length) {
      addressList.forEach(item => {
        if (item.isSelected) {
          setDeliveryAddress(item);
        }
      });
    }
  }, [addressList, getAddressResponse]);

  const onPressAddAddress = () => {
    navigation.navigate('AddAddress');
  };

  //   const onPressProceed = () => {
  //     console.warn('delivery address', deliveryAddress);
  //     console.warn('bolling address', billingAddress);
  //     // navigation.navigate('AddAddress');
  //   };

  const onPressEditBtn = useMemo(
    () => item => {
      navigation.navigate('AddAddress', {
        addressData: item,
      });
    },
    [navigation],
  );

  const onPressProceed = useCallback(() => {
    if (Object.keys(billingAddress).length === 0) {
      SimpleToast.show('Please select billing address');
    } else {
      setIsVisibleDelview(true);
      Animated.timing(animatedHeightForDelView, {
        toValue: Dimensions.get('window').height * 1,
        duration: 300,
        easing: Easing.ease,
      }).start();
    }
  }, [animatedHeightForDelView, billingAddress]);

  const onPressChangeBtn = useCallback(() => {
    setIsVisible(true);

    Animated.timing(animatedHeight, {
      toValue: Dimensions.get('window').height * 1,
      duration: 300,
      easing: Easing.ease,
    }).start();
  }, [animatedHeight, setIsVisible]);

  const onPressCrossBtn = () => {
    setIsVisible(false);
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
    }).start();
  };

  const onPressCrossBtnDeliveryView = () => {
    setIsVisible(false);
    Animated.timing(animatedHeightForDelView, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
    }).start();
  };

  const onPressSelectBtn = useMemo(
    () => add => {
      const updatedList = addressList.map(item => ({
        ...item,
        isSelected: item.id === add?.id,
      }));
      setDeliveryAddress(add);
      setAddressList(updatedList);
    },
    [addressList, setAddressList],
  );

  const onPressSameBillingBtn = useMemo(
    () => () => {
      console.warn('vv', deliveryAddress);
      setBillingAddress(deliveryAddress);
      setIsBillingAddressSame(!isBillingAddressSame);
    },
    [isBillingAddressSame, deliveryAddress],
  );

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animatedHeight, {
        toValue: Dimensions.get('window').height * 1,
        duration: 300,
        easing: Easing.ease,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
      }).start();
    }
  }, [animatedHeight, isVisible]);

  useEffect(() => {
    if (isVisibledelView) {
      Animated.timing(animatedHeightForDelView, {
        toValue: Dimensions.get('window').height * 1,
        duration: 300,
        easing: Easing.ease,
      }).start();
    } else {
      Animated.timing(animatedHeightForDelView, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
      }).start();
    }
  }, [animatedHeightForDelView, isVisibledelView]);

  const renderItem = useMemo(
    () => data => {
      const {item} = data;
      const add = `${item.addressLine1} ${item.addressLine2}, ${item.city} ${item.state} ${item.pincode}`;
      return (
        <AddressCard
          onPressEditBtn={() => onPressEditBtn(item)}
          name={item?.name}
          address={add}
          onPressAddAddress={add => onPressAddAddress(add)}
          onPressSelectBtn={() => onPressSelectBtn(item)}
          isSelected={item.isSelected}
        />
      );
    },
    [onPressAddAddress, onPressEditBtn, onPressSelectBtn],
  );

  const onClickProceed = deliveryType => {
    console.warn('vvv', deliveryType);
  };

  const returnAddressViews = () => {
    if (addressList.length > 0) {
      return (
        <>
          <View style={{flex: 0.6}}>
            <FlatList
              bounces={false}
              extraData={item => item.isSelected}
              showsVerticalScrollIndicator={false}
              data={addressList}
              renderItem={renderItem}
              keyExtractor={item => item?.id.toString()}
            />
          </View>
          {returnBillingView()}
          <Animated.View
            style={{
              position: 'absolute',
              zIndex: 99,
              bottom: 0,
              left: 0,
              right: 0,
              height: animatedHeight,
              backgroundColor: 'transparent',
            }}>
            <AddressListComponent
              navigation={navigation}
              onPressCross={onPressCrossBtn}
              onPressUseThisAddress={onPressUseThisAddress}
            />
          </Animated.View>

          <Animated.View
            style={{
              position: 'absolute',
              bottom: 0,
              zIndex: 99,
              left: 0,
              right: 0,
              height: animatedHeightForDelView,
              backgroundColor: 'transparent',
            }}>
            <DeliveryComponent
              onClickProceed={deliveryType => onClickProceed(deliveryType)}
              onPressCross={onPressCrossBtnDeliveryView}
            />
          </Animated.View>
        </>
      );
    } else {
      return (
        <View style={Styles.parentContainer}>
          <Image
            style={Styles.searchWebIcon}
            source={require('../../assets/searchWeb.webp')}
          />
          <View style={Styles.emptyTextContainer}>
            <Text style={Styles.emptyText}>{'No addresses added yet.'}</Text>
            <Text style={Styles.emptyText}>
              {'Add new address to proceed.'}
            </Text>
            <TouchableOpacity onPress={onPressAddAddress} style={Styles.btn}>
              <Text style={Styles.btnText}>{'Add Address'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  const returnBillingView = useCallback(() => {
    if (isBillingAddressFromList || isBillingAddressSame) {
      return (
        <View
          style={[
            Styles.billingView,
            {
              backgroundColor: 'white',
              height: spV(50),
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <View style={Styles.billingTextView}>
            <Text
              style={
                Styles.billingTitle
              }>{`Billing Address : ${billingAddress?.name}`}</Text>
            <Text style={Styles.addressText}>
              {`${billingAddress?.addressLine1} ${billingAddress?.addressLine2} ${billingAddress?.city}, ${billingAddress?.state} ${billingAddress?.pincode}`}
            </Text>
          </View>
          <TouchableOpacity onPress={onPressChangeBtn} style={Styles.changeBtn}>
            <Text>Change</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={Styles.billingView}>
          <TouchableOpacity
            onPress={onPressSameBillingBtn}
            style={{
              backgroundColor: isBillingAddressSame ? 'green' : 'red',
              height: 20,
              width: 20,
            }}
          />
          <Text style={Styles.billingText}>
            Use selected address as Billing address also
          </Text>
          <TouchableOpacity onPress={onPressChangeBtn} style={Styles.selectBtn}>
            <Text>Select other</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }, [
    isBillingAddressFromList,
    isBillingAddressSame,
    billingAddress?.name,
    billingAddress?.addressLine1,
    billingAddress?.addressLine2,
    billingAddress?.city,
    billingAddress?.state,
    billingAddress?.pincode,
    onPressChangeBtn,
    onPressSameBillingBtn,
  ]);

  const onPressUseThisAddress = address => {
    setBillingAddress(address);
    onPressCrossBtn();
    setIsBillingAddressFromList(true);
    console.warn('address', address);
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.headerContainer}>
        <DashboardHeader
          navigation={navigation}
          headerText={'Select Delivery Address'}
        />
      </View>
      {returnAddressViews()}
      <View style={Styles.bottomView}>
        <TouchableOpacity onPress={onPressAddAddress} style={Styles.whiteBtn}>
          <Text style={[Styles.btnText, {color: Colors.black}]}>
            {'Add New Address'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressProceed} style={Styles.btn}>
          <Text style={Styles.btnText}>{'Proceed'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddressList;
