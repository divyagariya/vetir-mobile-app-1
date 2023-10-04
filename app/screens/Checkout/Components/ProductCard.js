import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Linking,
  Alert,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {Colors} from '../../../colors';
import {FONTS_SIZES} from '../../../fonts';

export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = SLIDER_WIDTH;

const ProductCard = ({
  productDetails,
  productCount,
  removeItemFromCart = () => {},
  onIncrement = () => {},
  onDecrement = () => {},
}) => {
  const [count, setCount] = useState(productCount);
  return (
    <View testID="ProductCard" style={styles.productCard}>
      <View style={styles.container}>
        <Image
          source={{uri: productDetails?.imageUrls?.[0]}}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.boldText}>{productDetails?.brandName}</Text>
        <Text style={styles.text}>{productDetails?.productName}</Text>
        <Text style={styles.text}>{'$' + productDetails?.productPrice}</Text>
        <View style={{...styles.flexRow, marginBottom: 8}}>
          <Text style={styles.textLightBlack}>{'Estimated delivery by '}</Text>
          <Text style={styles.boldText}>{'Tomorrow'}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: 4,
            borderRadius: 4,
            gap: 16,
            borderWidth: 1,
            borderColor: Colors.tertiary,
            backgroundColor: Colors.tertiaryLight,
            width: 80,
            justifyContent: 'center',
            alignItems: 'center',
            // height: 56,
          }}>
          <Pressable
            style={{
              paddingHorizontal: 8,
              minWidth: 24,
            }}
            onPress={() => {
              if (count < 1) {
                removeItemFromCart();
                setCount(0);
                return;
              }
              setCount(current => current - 1);
              onDecrement(count);
            }}>
            <Text style={{color: Colors.tertiary, fontSize: 20}}>-</Text>
          </Pressable>
          <View
            style={{
              paddingHorizontal: 8,
            }}>
            <Text
              style={{color: Colors.tertiary, fontSize: 15, fontWeight: '700'}}>
              {count}
            </Text>
          </View>
          <Pressable
            style={{
              paddingHorizontal: 8,
              minWidth: 24,
            }}
            onPress={() => {
              setCount(current => current + 1);
              onIncrement(count);
            }}>
            <Text style={{color: Colors.tertiary, fontSize: 20}}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  container: {
    borderRadius: 8,
    marginHorizontal: 16,
  },
  productCard: {
    backgroundColor: 'white',
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 16,
    marginTop: 4,
  },
  productInfo: {
    lineHeight: 24,
  },
  image: {
    width: 48,
    height: 64,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
  },
  subitleStyle: {
    color: Colors.black60,
    marginTop: 4,
    marginBottom: 16,
  },
  titleStyle: {
    marginTop: 4,
  },
  text: {
    color: Colors.black,
    lineHeight: 24,
  },
  textLightBlack: {
    color: Colors.black60,
    lineHeight: 24,
  },
  boldText: {
    color: Colors.black,
    fontSize: FONTS_SIZES.s4,
    fontWeight: '700',
    lineHeight: 24,
  },
});

export default ProductCard;
