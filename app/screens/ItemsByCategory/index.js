import React from 'react';
import {FlatList, View} from 'react-native';
import {Styles} from './styles';
import DashboardHeader from '../../components/DashboardHeader';
import MeasurementAndSizeCard from '../../components/MeasurementAndSizeCard';

const ItemsArray = [
  {
    id: '1',
    title: 'Hip',
    count: '23',
  },
  {
    id: 2,
    title: 'Waist',
    count: '25',
  },
  {
    id: 3,
    title: 'Chest',
    count: '23',
  },
  {
    id: 4,
    title: 'Shoulder',
    count: '23',
  },
  {
    id: 5,
    title: 'Inseam',
    count: '23',
  },
  {
    id: 6,
    title: 'Outseam',
    count: '23',
  },
];

const BrandsArray = [
  {
    id: 1,
    title: 'Altuzzaara',
    count: '23',
  },
  {
    id: 2,
    title: 'Khaite',
    count: '25',
  },
  {
    id: 3,
    title: 'SAINT LAURENT',
    count: '23',
  },
  {
    id: 4,
    title: 'Loewe',
    count: '23',
  },
  {
    id: 5,
    title: 'Frankie shop',
    count: '23',
  },
  {
    id: 6,
    title: 'The Row',
    count: '23',
  },
];

const ColorsArray = [
  {
    _id: '63e5f749f77aac630b5afb98',
    colorId: 5,
    colorCode: '#f5f5dc',
    colorName: 'beige',
    __v: 0,
  },
  {
    _id: '637f8dc17bc47e5cd178a50c',
    colorId: 1,
    colorCode: '#000000',
    colorName: 'black',
  },
  {
    _id: '64789208a8819c7d28b892b9',
    colorId: 21,
    colorCode: '#0000ff',
    colorName: 'blue',
  },
  {
    _id: '63e5f749f77aac630b5afb9c',
    colorId: 9,
    colorCode: '#964b00',
    colorName: 'brown',
    __v: 0,
  },
  {
    _id: '64789250a8819c7d28b892ba',
    colorId: 22,
    colorCode: '#FFD700',
    colorName: 'gold',
  },
  {
    _id: '63e5f749f77aac630b5afb9b',
    colorId: 8,
    colorCode: '#00ff00',
    colorName: 'green',
    __v: 0,
  },
  {
    _id: '63e5f749f77aac630b5afb9e',
    colorId: 11,
    colorCode: '#808080',
    colorName: 'grey',
    __v: 0,
  },
  {
    _id: '64b5689f1efdf30183afe95b',
    colorId: 51,
    colorName: 'multi',
    colorCode: 'multi',
  },
  {
    _id: '63e5f749f77aac630b5afba2',
    colorId: 14,
    colorCode: '#ffa500',
    colorName: 'orange',
    __v: 0,
  },
  {
    _id: '63e5f749f77aac630b5afb99',
    colorId: 6,
    colorCode: '#ffc0cb',
    colorName: 'pink',
    __v: 0,
  },
  {
    _id: '63e5f749f77aac630b5afba0',
    colorId: 12,
    colorCode: '#a020f0',
    colorName: 'purple',
    __v: 0,
  },
  {
    _id: '63e5f749f77aac630b5afb9d',
    colorId: 10,
    colorCode: '#ff0000',
    colorName: 'red',
    __v: 0,
  },
  {
    _id: '63e5f749f77aac630b5afb9a',
    colorId: 7,
    colorCode: '#c0c0c0',
    colorName: 'silver',
    __v: 0,
  },
  {
    _id: '6486110ff92b3be8fc200034',
    colorCode: '#ffffff',
    colorName: 'white',
    colorId: 53,
  },
  {
    _id: '63e5f749f77aac630b5afb9f',
    colorId: 15,
    colorCode: '#ffff00',
    colorName: 'yellow',
    __v: 0,
  },
];

const data = [
  {
    Clothing: 1,
  },
  {
    shoes: 2,
  },
];

const brands = [
  {
    AERIN: 1,
  },
];

const colorStats = [
  {
    '#ffffff': 1,
  },
];

const ItemsByCategory = props => {
  const {navigation} = props;
  const {comingFromItemCat, headerText} = props.route.params || '';
  const {isColorComp} = props.route.params;
  const {dataArray} = props.route.params || [];

  const getDataArray = () => {
    const updatedColorsArray = ColorsArray.map(item => ({
      title: item.colorName,
      colorCode: item?.colorCode,
      count: item?.colorId,
    }));
    if (comingFromItemCat) {
      return data;
    } else if (!comingFromItemCat && !isColorComp) {
      return brands;
    } else {
      return updatedColorsArray;
    }
  };

  const renderItem = (data, index) => {
    const {item} = data;
    return (
      <MeasurementAndSizeCard
        key={item?.id}
        showBorder={index === ItemsArray.length - 1 ? false : true}
        isColorComp={isColorComp}
        colorCode={isColorComp ? item?.colorCode : undefined}
        title={Object.keys(item)}
        count={item[Object.keys(item)]}
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
