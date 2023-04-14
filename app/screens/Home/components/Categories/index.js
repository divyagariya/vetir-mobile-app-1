import React from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Colors} from '../../../../colors';
import {VText, VView} from '../../../../components';
import {FONTS_SIZES} from '../../../../fonts';

const Categories = props => {
  const {
    optionName = '',
    products = [],
    fromStylist = false,
  } = props.data || {};

  const renderCategory = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{marginLeft: 16}}
        onPress={() => props.getProductDetails(item.productId)}>
        <Image
          source={{uri: item.productImage}}
          style={{height: 192, width: 144}}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  return (
    <VView>
      <VView style={styles.headingContainer}>
        {fromStylist && !props.isStylistUser ? (
          <View style={{flexDirection: 'row'}}>
            <Image
              source={require('../../../../assets/star.png')}
              style={{width: 24, height: 24}}
            />
            <View style={{marginLeft: 8}}>
              <Text style={styles.headingLeftText}>{optionName}</Text>
              <Text>by your stylist</Text>
            </View>
          </View>
        ) : (
          <VText text={optionName} style={styles.headingLeftText} />
        )}
        <TouchableOpacity onPress={props.viewAll}>
          <VText text="VIEW ALL" />
        </TouchableOpacity>
      </VView>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderCategory}
      />
    </VView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    alignItem: 'center',
    marginHorizontal: 16,
  },
  headingLeftText: {
    fontSize: FONTS_SIZES.s3,
    fontWeight: '700',
  },
});
