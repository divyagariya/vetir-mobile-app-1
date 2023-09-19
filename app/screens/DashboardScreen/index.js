import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Styles} from './styles';
import DashboardHeader from '../../components/DashboardHeader';
import BoldLightText from '../../components/BoldLightText';
import PurchaseInsightsCard from '../../components/PurchaseInsightsCard';

const purchaseInsightsArray = [
  {
    id: 1,
    title: 'Order History',
    icon: require('../../assets/orderHis.png'),
  },
  {
    id: 2,
    title: 'Items by category',
    icon: require('../../assets/itemBycat.png'),
  },
  {
    id: 3,
    title: 'Top brands',
    icon: require('../../assets/topBr.png'),
  },
  {
    id: 4,
    title: 'Favorite colors',
    icon: require('../../assets/favCol.png'),
  },
];

const DashboardScreen = props => {
  const {navigation} = props;

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
        });
        break;
      case 3:
        props.navigation.navigate('ItemsByCategory', {
          comingFromItemCat: false,
          isColorComp: false,
          headerText: 'Top Brands',
        });
        break;
      case 4:
        props.navigation.navigate('ItemsByCategory', {
          comingFromItemCat: false,
          isColorComp: true,
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
            source={require('../../assets/iProfile.png')}
            style={Styles.profilePic}
          />
          <Text style={Styles.nameText}>Paula Lee</Text>
        </View>
        <View style={[Styles.firstRowView, {marginTop: 10}]}>
          <BoldLightText
            headerText={'$5678'}
            bodyText={'TOTAL PRODUCT VALUE'}
          />
          <View style={Styles.separatorView} />
          <BoldLightText
            headerText={'$5678'}
            bodyText={'AVERAGE ORDER VALUE'}
          />
        </View>
        <View style={Styles.firstRowView}>
          <BoldLightText headerText={'$5678'} bodyText={'OUTFITS'} />
          <View style={Styles.separatorView} />
          <BoldLightText headerText={'$5678'} bodyText={'CLOSET ITEMS'} />
        </View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('ProfileDetails', {
              userName: 'Vinay',
              gender: 'Female',
              email: 'paula.lee008@gmail.com',
              phone: '+1122342434',
              add: '264 Orphan road, Buffalo',
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
