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
          style={{
            height: 192,
            width: 144,
            backgroundColor: Colors.grey1,
            marginBottom: 16,
          }}
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
              source={require('../../../../assets/star.webp')}
              style={{width: 24, height: 24}}
            />
            <View style={{marginLeft: 8}}>
              <Text style={styles.headingLeftText}>{optionName}</Text>
              <Text style={{fontSize: FONTS_SIZES.s4, color: '#212427'}}>
                by your stylist
              </Text>
            </View>
          </View>
        ) : (
          <VText text={optionName} style={styles.headingLeftText} />
        )}
        <TouchableOpacity onPress={props.viewAll}>
          <VText
            text="view all"
            style={{fontSize: FONTS_SIZES.s4, color: '#212427'}}
          />
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
    marginTop: 16,
    marginBottom: 16,
    alignItem: 'center',
    marginHorizontal: 16,
  },
  headingLeftText: {
    fontSize: FONTS_SIZES.s3,
    fontWeight: '700',
    marginBottom: 4,
    color: '#212427',
  },
});
