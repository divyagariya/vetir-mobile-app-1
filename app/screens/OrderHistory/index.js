import React from 'react';
import {FlatList, View} from 'react-native';
import {Styles} from './styles';
import DashboardHeader from '../../components/DashboardHeader';
import OrderHistoryCard from '../../components/OrderHistoryCard';

const OrderHistoryArray = [
  {
    orderId: '3473485',
    itemName: 'Cable Knit Cotton Cardigan',
    itemPrice: '$2500',
    orderDate: '9/10/23',
    status: 'Delivered',
  },
  {
    orderId: '34734845',
    itemName: 'Trouser',
    itemPrice: '$4500',
    orderDate: '20/10/23',
    status: 'Pending',
  },
  {
    orderId: '34373485',
    itemName: 'Jeans',
    itemPrice: '$500',
    orderDate: '19/10/23',
    status: 'Delivered',
  },
];

const OrderHistory = props => {
  const {navigation} = props;

  const renderItem = data => {
    const {item} = data;
    return (
      <OrderHistoryCard
        key={item?.id}
        imageLink={require('../../assets/orderHistoryStatic.png')}
        orderId={item?.orderId}
        onPress={() => {
          navigation.navigate('OrderHistoryDetails');
        }}
        itemPrice={item?.itemPrice}
        orderDate={item?.orderDate}
        status={item?.status}
        itemName={item?.itemName}
      />
    );
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.headerContainer}>
        <DashboardHeader navigation={navigation} headerText={'Order History'} />
      </View>
      <View style={Styles.flatListContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={OrderHistoryArray}
          contentContainerStyle={{paddingBottom: 100}}
          renderItem={renderItem}
          keyExtractor={item => item?.orderId.toString()}
        />
      </View>
    </View>
  );
};
export default OrderHistory;
