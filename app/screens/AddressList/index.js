import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../../colors';
import DashboardHeader from '../../components/DashboardHeader';
import {Styles} from './styles';
import AddressCard from './addressCard';
import {useDispatch, useSelector} from 'react-redux';
import {getAddressList} from '../../redux/actions/cartAction';
import {useFocusEffect} from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';

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

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getAddressList());
      if (refreshAddress) {
        SimpleToast.show('Address Added Successfully');
      }
    }, [dispatch, refreshAddress]),
  );

  useEffect(() => {
    if (Object.keys(getAddressResponse).length) {
      setAddressList(getAddressResponse);
      dispatch({type: 'GET_ADDRESS', value: {}});
    }
  }, [getAddressResponse, dispatch]);

  const onPressAddAddress = () => {
    navigation.navigate('AddAddress');
  };

  const onPressProceed = () => {
    navigation.navigate('AddAddress');
  };

  const onPressEditBtn = useMemo(
    () => item => {
      navigation.navigate('AddAddress', {
        addressData: item,
      });
    },
    [navigation],
  );

  const onPressSelectBtn = useMemo(
    () => id => {
      const updatedList = addressList.map(item => ({
        ...item,
        isSelected: item.id === id,
      }));
      setAddressList(updatedList);
    },
    [addressList, setAddressList],
  );

  const renderItem = useMemo(
    () => data => {
      const {item} = data;
      const add = `${item.addressLine1} ${item.addressLine2}, ${item.city} ${item.state} ${item.pincode}`;
      return (
        <AddressCard
          onPressEditBtn={() => onPressEditBtn(item)}
          name={'James'}
          address={add}
          onPressSelectBtn={() => onPressSelectBtn(item.id)}
          isSelected={item.isSelected}
        />
      );
    },
    [onPressEditBtn, onPressSelectBtn],
  );

  const returnAddressViews = () => {
    if (addressList.length > 0) {
      return (
        <FlatList
          extraData={item => item.isSelected}
          showsVerticalScrollIndicator={false}
          data={addressList}
          renderItem={renderItem}
          keyExtractor={item => item?.id.toString()}
        />
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

  return (
    <View style={Styles.container}>
      <View style={Styles.headerContainer}>
        <DashboardHeader
          navigation={navigation}
          headerText={'Select Delivery Address'}
        />
      </View>
      {returnAddressViews()}
      {addressList.length > 0 && (
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
      )}
    </View>
  );
};

export default AddressList;
