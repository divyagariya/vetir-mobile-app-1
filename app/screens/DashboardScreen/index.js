import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Styles} from './styles';
import DashboardHeader from '../../components/DashboardHeader';
import BoldLightText from '../../components/BoldLightText';
import PurchaseInsightsCard from '../../components/PurchaseInsightsCard';
import {useDispatch, useSelector} from 'react-redux';
import {getClientDetails} from '../../redux/actions/stylistAction';

const purchaseInsightsArray = [
  {
    id: 1,
    title: 'Order History',
    icon: require('../../assets/orderHis.webp'),
  },
  {
    id: 2,
    title: 'Items by category',
    icon: require('../../assets/itemByCat.webp'),
  },
  {
    id: 3,
    title: 'Top brands',
    icon: require('../../assets/topBr.webp'),
  },
  {
    id: 4,
    title: 'Favorite colors',
    icon: require('../../assets/favCol.webp'),
  },
];

const DashboardScreen = props => {
  const dispatch = useDispatch();
  const clientRes = useSelector(state => state.StylistReducer.clientData);
  const [clientData, setClientData] = useState({});
  const {navigation} = props;
  const {
    profilePicUrl = '',
    name = '',
    emailId = '',
    userId,
  } = props?.route?.params || '';
  useEffect(() => {
    dispatch(getClientDetails(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    setClientData(clientRes);
  }, [clientRes]);

  console.log('clientData', clientData);
  const onPressCard = id => {
    switch (id) {
      case 1:
        props.navigation.navigate('OrderHistory', {});
        break;
      case 2:
        props.navigation.navigate('ItemsByCategory', {
          comingFromItemCat: true,
          isColorComp: false,
          headerText: 'Items by category',
          dataArray: clientData?.categoryStats,
        });
        break;
      case 3:
        props.navigation.navigate('ItemsByCategory', {
          comingFromItemCat: false,
          isColorComp: false,
          headerText: 'Top Brands',
          dataArray: clientData?.brandStats,
        });
        break;
      case 4:
        props.navigation.navigate('ItemsByCategory', {
          comingFromItemCat: false,
          isColorComp: true,
          dataArray: clientData?.colorStats,
          headerText: 'Favorite Colors',
        });
        break;
      default:
        break;
    }
  };
  return (
    <ScrollView bounces={false} style={Styles.container}>
      <DashboardHeader navigation={navigation} headerText={'Dashboard'} />
      <View style={Styles.profileDetailsContainer}>
        <View style={Styles.profileImageContainer}>
          <Image
            source={
              profilePicUrl
                ? {uri: profilePicUrl}
                : require('../../assets/iProfile.png')
            }
            style={Styles.profilePic}
          />

          <Text style={Styles.nameText}>{name}</Text>
        </View>
        <View style={[Styles.firstRowView, {marginTop: 10}]}>
          <BoldLightText
            headerText={`$${clientData?.totalProductValue}`}
            bodyText={'TOTAL PRODUCT VALUE'}
          />
          <View style={Styles.separatorView} />
          <BoldLightText
            headerText={`$${parseFloat(clientData?.averageOrderValue)
              .toFixed(2)
              .toString()}`}
            bodyText={'AVERAGE ORDER VALUE'}
          />
        </View>
        <View style={Styles.firstRowView}>
          <BoldLightText
            headerText={clientData?.totalOutfits}
            bodyText={'OUTFITS'}
          />
          <View style={Styles.separatorView} />
          <BoldLightText
            headerText={
              clientData?.closetDetails && clientData?.closetDetails.length
            }
            bodyText={'CLOSET ITEMS'}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('ProfileDetails', {
              userName: clientData?.name,
              gender: clientData?.gender,
              email: clientData?.emailId,
              // phone: '+1122342434',
              // add: '264 Orphan road, Buffalo',
            });
          }}
          style={Styles.viewProfileBtn}>
          <Text style={Styles.btnText}>View Profile details</Text>
        </TouchableOpacity>
      </View>
      <Text style={Styles.purchaseHeader}>Purchase Insights</Text>
      {purchaseInsightsArray.map(item => {
        return (
          <PurchaseInsightsCard
            navigation={navigation}
            title={item.title}
            onPress={() => onPressCard(item.id)}
            icon={item.icon}
          />
        );
      })}
    </ScrollView>
  );
};
export default DashboardScreen;
