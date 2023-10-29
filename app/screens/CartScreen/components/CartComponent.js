import {Image, Text, TouchableHighlight, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {FONTS_SIZES} from '../../../fonts';
import {incrementCartProduct} from '../../../redux/actions/cartAction';

const CartComponent = props => {
  const product = props?.item?.product;
  const [quantity, setQuantity] = useState(props?.item?.quantity);
  const dispatch = useDispatch();

  const handleQuantity = async quan => {
    dispatch(incrementCartProduct('64af165b14d3490c1d71cbdd', quan));
    setQuantity(quan);
  };

  return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Image
            source={{uri: product?.imageUrls[0]}}
            style={{
              height: 80,
              width: 80,
            }}
          />
          <View
            style={{
              flex: 1,
              padding: 8,
            }}>
            <Text
              style={{
                fontSize: FONTS_SIZES.s2,
                fontWeight: '700',
              }}>
              {product?.brandName}
            </Text>
            <Text
              style={{
                fontSize: FONTS_SIZES.s2,
              }}>
              {product?.productDescription}
            </Text>

            <View
              style={{
                borderWidth: 1,
                width: '20%',
                alignItems: 'center',
                paddingVertical: 5,
                marginTop: 10,
                borderRadius: 8,
                borderColor: 'rgba(0,0,0,0.1)',
              }}>
              <Text
                style={{
                  color: 'rgba(0,0,0,0.6)',
                  textTransform: 'capitalize',
                }}>
                {product?.productSizes[0]}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          borderColor: 'rgba(0,0,0,0.1)',
          marginTop: 10,
          padding: 16,
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          alignItems: 'center',
        }}>
        <View
          style={{
            borderWidth: 1,
            flexDirection: 'row',
            padding: 10,
            borderRadius: 100,
            alignItems: 'center',
          }}>
          <TouchableHighlight
            style={{
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: FONTS_SIZES.s1,
              }}>
              -
            </Text>
          </TouchableHighlight>
          <TouchableHighlight>
            <Text
              style={{
                fontSize: FONTS_SIZES.s2,
                textAlignVertical: 'center',
                paddingHorizontal: 10,
              }}>
              {quantity}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => handleQuantity(quantity + 1)}
            style={{
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: FONTS_SIZES.s1,
              }}>
              +
            </Text>
          </TouchableHighlight>
        </View>
        <Text
          style={{
            fontSize: FONTS_SIZES.s2,
            fontWeight: '700',
          }}>
          ${product?.productPrice}
        </Text>
      </View>
    </>
  );
};

export default CartComponent;
