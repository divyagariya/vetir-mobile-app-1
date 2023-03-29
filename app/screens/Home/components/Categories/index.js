import React from 'react';
import {FlatList, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../../../../colors';
import {VText, VView} from '../../../../components';
import {FONTS_SIZES} from '../../../../fonts';

const Categories = props => {
  const {optionName = '', products = []} = props.data || {};

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
        <VText text={optionName} style={styles.headingLeftText} />
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
