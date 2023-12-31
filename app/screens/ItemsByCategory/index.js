import React from 'react';
import {FlatList, View} from 'react-native';
import {Styles} from './styles';
import DashboardHeader from '../../components/DashboardHeader';
import MeasurementAndSizeCard from '../../components/MeasurementAndSizeCard';

const ItemsByCategory = props => {
  const {navigation} = props;
  const {comingFromItemCat, headerText} = props.route.params || '';
  const {isColorComp} = props.route.params;
  const {dataArray} = props.route.params || [];

  const getDataArray = () => {
    if (comingFromItemCat) {
      dataArray &&
        dataArray.sort((a, b) => {
          const valueA = Object.values(a)[0]; // Extract the sorting value from the first object
          const valueB = Object.values(b)[0]; // Extract the sorting value from the second object
          return valueB - valueA; // Compare the sorting values
        });
      return dataArray;
    } else if (!comingFromItemCat && !isColorComp) {
      dataArray &&
        dataArray.sort((a, b) => {
          const valueA = Object.values(a)[0]; // Extract the sorting value from the first object
          const valueB = Object.values(b)[0]; // Extract the sorting value from the second object
          return valueB - valueA; // Compare the sorting values
        });
      return dataArray;
    } else {
      dataArray &&
        dataArray.sort((a, b) => {
          const valueA = Object.values(a)[0]; // Extract the sorting value from the first object
          const valueB = Object.values(b)[0]; // Extract the sorting value from the second object
          return valueB - valueA; // Compare the sorting values
        });
      return dataArray;
    }
  };

  const renderItem = (data, index) => {
    const {item} = data;
    return (
      <MeasurementAndSizeCard
        key={item?.id}
        showBorder={index === dataArray.length - 1 ? false : true}
        isColorComp={isColorComp}
        colorCode={isColorComp ? item?.colorCode : undefined}
        title={isColorComp ? item?.colorName : Object.keys(item)}
        count={isColorComp ? item?.count : item[Object.keys(item)]}
      />
    );
  };

  return (
    <View style={Styles.container}>
      <DashboardHeader navigation={navigation} headerText={headerText} />
      <View style={Styles.flatListContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={getDataArray()}
          contentContainerStyle={{paddingBottom: 100}}
          renderItem={renderItem}
          keyExtractor={item => Math.random().toString()}
        />
      </View>
    </View>
  );
};
export default ItemsByCategory;
