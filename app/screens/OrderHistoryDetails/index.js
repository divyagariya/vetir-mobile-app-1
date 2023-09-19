import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Styles} from './styles';
import DashboardHeader from '../../components/DashboardHeader';
import OrderHistoryCard from '../../components/OrderHistoryCard';
import ItemPriceCard from './ItemPriceCard';
import {hp} from '../../utils/normalise';

const OrderHistoryDetails = props => {
  const {navigation} = props;

  return (
    <View style={Styles.container}>
      <View style={Styles.headerContainer}>
        <DashboardHeader
          showRightBtn={true}
          navigation={navigation}
          headerText={'Order History'}
        />
      </View>
      <View style={Styles.ordercontainer}>
        <Text style={Styles.orderText}>{`Order ID: ${342524}`}</Text>
        <Text style={Styles.orderText}>{'Placed on: 9/10/23 at 10:21am'}</Text>
        <Text style={Styles.deliverText}>{'Delivered to'}</Text>
        <Text style={Styles.orderText}>
          {'264 Orphan Road, Buffalo, NY 14214 '}
        </Text>
      </View>
      <View style={Styles.btncontainer}>
        <TouchableOpacity style={Styles.reOrderBtn}>
          <Image
            style={Styles.icon}
            source={require('../../assets/reorder.webp')}
          />
          <Text style={Styles.btnText}>{'Reorder'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={Styles.reOrderBtn}>
          <Image
            style={Styles.icon}
            source={require('../../assets/down.webp')}
          />
          <Text style={Styles.btnText}>{'Invoice'}</Text>
        </TouchableOpacity>
      </View>
      <OrderHistoryCard
        key={'34373485'}
        isOrderhistoryDetails={true}
        imageLink={require('../../assets/orderHistoryStatic.png')}
        quantity={'2'}
        itemPrice={'$2500'}
        itemName={'Cable Knit Cotton Cardigan'}
      />
      <View style={Styles.cardContainer}>
        <ItemPriceCard heading={'Item total'} value={'$2590'} />
        <ItemPriceCard heading={'Discount'} isGreen value={'-$130'} />
        <ItemPriceCard heading={'Handling Charge'} value={'$5'} />
        <ItemPriceCard heading={'Delivery Fee'} value={'$35'} />
        <ItemPriceCard marginTop={hp(6)} heading={'Total'} value={'$2500'} />
      </View>
    </View>
  );
};
export default OrderHistoryDetails;
