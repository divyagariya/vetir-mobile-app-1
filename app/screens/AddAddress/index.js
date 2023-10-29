import React, {useEffect, useRef, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../colors';
import DashboardHeader from '../../components/DashboardHeader';
import {Styles} from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SimpleToast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {addNewAddress} from '../../redux/actions/cartAction';
import {VText} from '../../components';

const AddAddress = props => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.AuthReducer.userId);
  const addAddressResponse = useSelector(
    state => state.CartReducer.addAddressResponse,
  );
  const {route, navigation} = props;
  const {params = {}} = route;
  const {addressData = {}} = params;
  const [name, setname] = useState(addressData?.name || '');
  const [phone, setphone] = useState(addressData?.mobileNumber || '');
  const [addressLine1, setaddressLine1] = useState(
    addressData?.addressLine1 || '',
  );
  const [addressLine2, setaddressLine2] = useState(
    addressData?.addressLine2 || '',
  );
  const [city, setcity] = useState(addressData?.city || '');
  const [state, setstate] = useState(addressData?.state || '');
  const [zipCode, setzipCode] = useState(
    addressData?.pincode?.toString() || '',
  );
  const [country, setcountry] = useState(addressData?.country || 'USA');
  const [isDisabled, setIsDisabled] = useState(true);

  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const addressLine1InputRef = useRef(null);
  const addressLine2InputRef = useRef(null);
  const cityInputRef = useRef(null);
  const stateInputRef = useRef(null);
  const zipCodeInputRef = useRef(null);
  const countryInputRef = useRef(null);

  useEffect(() => {
    if (
      name !== '' &&
      phone !== '' &&
      addressLine1 !== '' &&
      addressLine2 !== '' &&
      city !== '' &&
      state !== '' &&
      zipCode !== '' &&
      country !== ''
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [addressLine1, addressLine2, city, country, name, phone, state, zipCode]);

  useEffect(() => {
    if (Object.keys(addAddressResponse).length) {
      props.navigation.navigate('AddressList', {
        refreshAddress: true,
      });
      dispatch({type: 'ADD_ADDRESS', value: {}});
    }
    // dispatch({type: 'ADD_ADDRESS', value: {}});
  }, [addAddressResponse, dispatch, props.navigation]);

  const onChangeName = text => {
    setname(text);
  };
  const onChangePhone = text => {
    setphone(text);
  };
  const onChangeAddressLine1 = text => {
    setaddressLine1(text);
  };
  const onChangeAddressLine2 = text => {
    setaddressLine2(text);
  };
  const onChangeCity = text => {
    setcity(text);
  };
  const onChangeState = text => {
    setstate(text);
  };
  const onChangeZipCode = text => {
    setzipCode(text);
  };
  const onChangeCountry = text => {
    setcountry(text);
  };

  const OnPressBtn = () => {
    if (name === '') {
      SimpleToast.show('Please enter name');
    } else if (phone === '') {
      SimpleToast.show('Please enter phone number');
    } else if (addressLine1 === '') {
      SimpleToast.show('Please enter address line 1');
    } else if (addressLine2 === '') {
      SimpleToast.show('Please enter address line 2');
    } else if (city === '') {
      SimpleToast.show('Please enter city');
    } else if (state === '') {
      SimpleToast.show('Please enter state');
    } else if (zipCode === '') {
      SimpleToast.show('Please enter zip Code');
    } else if (country === '') {
      SimpleToast.show('Please enter country');
    }
    const data = {
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      isActive: 1,
      mobileNumber: phone,
      pincode: zipCode,
      state: state,
      userId: userId,
      name: name,
      id: addressData?.id,
    };
    dispatch(addNewAddress(data));
  };

  const onBlurName = () => {
    setname(name.trim());
  };
  const onBlurPhone = () => {
    setphone(phone.trim());
  };
  const onBluraddress1 = () => {
    setaddressLine1(addressLine1.trim());
  };
  const onBluraddress2 = () => {
    setaddressLine2(addressLine2.trim());
  };
  const onBlurCity = () => {
    setcity(city.trim());
  };
  const onBlurState = () => {
    setstate(state.trim());
  };
  const onBlurZip = () => {
    setzipCode(zipCode.trim());
  };
  const onBlurCountry = () => {
    setcountry(country.trim());
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.headerContainer}>
        <DashboardHeader
          onBack={() =>
            props.navigation.navigate('AddressList', {
              refreshAddress: false,
            })
          }
          // navigation={props.navigation}
          headerText={'Address'}
        />
      </View>
      <Text style={Styles.headingText}>
        {Object.keys(addressData).length > 0
          ? 'Edit Shipping Address Details'
          : 'Enter Shipping Address Details'}
      </Text>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        style={Styles.inputContainer}>
        <VText text="Name" />
        <TextInput
          ref={nameInputRef}
          placeholder={'Name'}
          style={Styles.input}
          onBlur={onBlurName}
          value={name}
          onChangeText={onChangeName}
          autoCorrect={false}
          onSubmitEditing={() => phoneInputRef.current.focus()}
          returnKeyType="next"
        />
        <VText text="Phone Number" />
        <TextInput
          ref={phoneInputRef}
          placeholder={'Phone Number'}
          style={Styles.input}
          onBlur={onBlurPhone}
          value={phone}
          maxLength={15}
          keyboardType="phone-pad"
          onChangeText={onChangePhone}
          autoCorrect={false}
        />
        <VText text="Address Line 1" />
        <TextInput
          ref={addressLine1InputRef}
          placeholder={'Address Line 1'}
          style={Styles.input}
          onBlur={onBluraddress1}
          value={addressLine1}
          onChangeText={onChangeAddressLine1}
          autoCorrect={false}
          onSubmitEditing={() => addressLine2InputRef.current.focus()}
          returnKeyType="next"
        />
        <VText text="Address Line 2" />
        <TextInput
          ref={addressLine2InputRef}
          placeholder={'Address Line 2'}
          style={Styles.input}
          onBlur={onBluraddress2}
          value={addressLine2}
          onChangeText={onChangeAddressLine2}
          autoCorrect={false}
          onSubmitEditing={() => cityInputRef.current.focus()}
          returnKeyType="next"
        />
        <VText text="City" />
        <TextInput
          ref={cityInputRef}
          placeholder={'City'}
          style={Styles.input}
          onBlur={onBlurCity}
          value={city}
          onChangeText={onChangeCity}
          autoCorrect={false}
          onSubmitEditing={() => stateInputRef.current.focus()}
          returnKeyType="next"
        />
        <VText text="State" />
        <TextInput
          ref={stateInputRef}
          placeholder={'State'}
          style={Styles.input}
          onBlur={onBlurState}
          value={state}
          onChangeText={onChangeState}
          autoCorrect={false}
        />
        <VText text="Zip Code" />
        <TextInput
          placeholder={'Zip Code'}
          style={Styles.input}
          onBlur={onBlurZip}
          value={zipCode}
          onChangeText={onChangeZipCode}
          autoCorrect={false}
          onSubmitEditing={() => countryInputRef.current.focus()}
          returnKeyType="next"
        />
        <VText text="Country" />
        <TextInput
          ref={countryInputRef}
          placeholder={'Country'}
          style={Styles.input}
          onBlur={onBlurCountry}
          value={country}
          onChangeText={onChangeCountry}
          autoCorrect={false}
          returnKeyType="done"
        />
      </KeyboardAwareScrollView>
      <TouchableOpacity
        onPress={OnPressBtn}
        disabled={isDisabled}
        style={[
          Styles.btn,
          {backgroundColor: isDisabled ? Colors.black30 : Colors.black},
        ]}>
        <Text style={Styles.btnText}>{'Save and Use Address'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddAddress;
