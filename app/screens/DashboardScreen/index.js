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
  return (
    <ScrollView bounces={false} style={Styles.container}>
      <DashboardHeader navigation={props.navigation} headerText={'Dashboard'} />
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
        <TouchableOpacity style={Styles.viewProfileBtn}>
          <Text style={Styles.btnText}>View Profile details</Text>
        </TouchableOpacity>
      </View>
      <Text style={Styles.purchaseHeader}>Purchase Insights</Text>
      {purchaseInsightsArray.map(item => {
        return (
          <PurchaseInsightsCard
            navigation={props.navigation}
            title={item.title}
            icon={item.icon}
          />
        );
      })}
    </ScrollView>
  );
};
export default DashboardScreen;
